/* ============================================================
   DrivePrep+ — Motor del Asistente Educativo MTC (Perú)
   Motor de coincidencia de intenciones, contexto y banco de conocimientos
   con soporte híbrido para IA Generativa (Google Gemini 1.5/2.0)
   ============================================================ */

import { BASE_CONOCIMIENTOS_MTC, TEMAS_FUERA_DOMINIO } from '../data/chatbot/mtcKnowledge.js';
import { BANCO_PREGUNTAS } from '../data/bancoPreguntasMTC.js';
import { consultarGeminiMTC, getApiKeyGemini } from '../services/aiService.js';

/* ── Sugerencias categorizadas para el chat ── */
export const SUGERENCIAS_TUTOR = [
  { id: 'senales', label: '🚦 Señales de tránsito', prompt: '¿Cuáles son los tipos de señales de tránsito y cómo identificarlas?' },
  { id: 'normas', label: '🛣️ Reglas de circulación', prompt: 'Explícame las reglas de prioridad de paso y circulación en intersecciones' },
  { id: 'pare_ceda', label: '🛑 PARE vs CEDA EL PASO', prompt: '¿Cuál es la diferencia entre PARE y CEDA EL PASO?' },
  { id: 'ovalo', label: '🔄 Prioridad en óvalos', prompt: '¿Quién tiene prioridad en un óvalo?' },
  { id: 'infracciones', label: '⚠️ Infracciones y sanciones', prompt: '¿Qué es una infracción de tránsito y cómo funciona el sistema de puntos?' },
  { id: 'mecanica', label: '🔧 Mecánica básica', prompt: 'Explícame mecánica básica para el examen MTC' },
  { id: 'pregunta', label: '📝 Hazme una pregunta', prompt: 'Hazme una pregunta tipo examen MTC' },
  { id: 'progreso', label: '📊 Analiza mi progreso', prompt: '¿Qué debería estudiar según mi progreso?' },
  { id: 'estudiar_hoy', label: '🔥 ¿Qué debería estudiar hoy?', prompt: '¿Qué debería estudiar hoy?' },
  { id: 'listo_examen', label: '🏆 ¿Estoy listo para el examen?', prompt: '¿Consideras que ya estoy listo para rendir el examen oficial del MTC?' },
  { id: 'consejos', label: '💡 Consejos para aprobar', prompt: 'Dame consejos para el examen de reglas del MTC' },
];

/* ── Normalización de texto para búsqueda limpia ── */
function normalizar(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
    .replace(/[^a-z0-9\s]/g, ' ')   // Quitar signos de puntuación
    .replace(/\s+/g, ' ')           // Espacios simples
    .trim();
}

/* ── Generador de Pregunta Interactiva tipo MTC ── */
export function generarPreguntaPractica(categoriaFiltro = null, temaKeyword = '') {
  let pool = BANCO_PREGUNTAS.filter(p => p.tipo === 'opcion_multiple');

  if (categoriaFiltro) {
    const normFiltro = normalizar(categoriaFiltro);
    const filtradas = pool.filter(p => {
      const normCat = normalizar(p.categoria || '');
      return normCat.includes(normFiltro) || normFiltro.includes(normCat);
    });
    if (filtradas.length > 0) pool = filtradas;
  } else if (temaKeyword) {
    const kw = normalizar(temaKeyword);
    const filtradas = pool.filter(p => {
      const textoP = normalizar(`${p.enunciado} ${p.explicacion}`);
      return kw.split(' ').some(token => token.length > 3 && textoP.includes(token));
    });
    if (filtradas.length > 0) pool = filtradas;
  }

  const p = pool[Math.floor(Math.random() * pool.length)] || BANCO_PREGUNTAS[0];
  return p;
}

const STOPWORDS = new Set(['que', 'qué', 'significa', 'significan', 'es', 'son', 'la', 'las', 'el', 'los', 'un', 'una', 'unos', 'unas', 'de', 'del', 'en', 'para', 'por', 'con', 'cual', 'cuál', 'como', 'cómo', 'y', 'o', 'al', 'se', 'su', 'sus', 'lo', 'los']);

/* ── Buscador de coincidencia en la Base de Conocimientos ── */
function buscarEnBaseConocimientos(textoNormalizado, ultimoTema) {
  let mejorItem = null;
  let maxPuntaje = 0;

  const tokensUsuario = textoNormalizado.split(' ').filter(t => t.length > 1 && !STOPWORDS.has(t));

  for (const item of BASE_CONOCIMIENTOS_MTC) {
    for (const patron of item.patrones) {
      const patronNorm = normalizar(patron);

      // Coincidencia exacta de frase
      if (textoNormalizado === patronNorm) {
        return { item, puntaje: 200 };
      }

      // El usuario contiene el patrón completo
      if (textoNormalizado.includes(patronNorm) && patronNorm.length > 5) {
        const puntaje = 100 + patronNorm.length;
        if (puntaje > maxPuntaje) {
          maxPuntaje = puntaje;
          mejorItem = item;
        }
      }

      // El patrón contiene al texto del usuario (si es suficientemente largo)
      if (patronNorm.includes(textoNormalizado) && textoNormalizado.length > 8) {
        const puntaje = 80 + textoNormalizado.length;
        if (puntaje > maxPuntaje) {
          maxPuntaje = puntaje;
          mejorItem = item;
        }
      }

      // Coincidencia por tokens significativos ponderados (sin stopwords)
      const tokensPatron = patronNorm.split(' ').filter(t => t.length > 1 && !STOPWORDS.has(t));
      if (tokensPatron.length > 0 && tokensUsuario.length > 0) {
        let aciertos = 0;
        for (const t of tokensUsuario) {
          if (tokensPatron.includes(t)) aciertos += 2;
          else if (tokensPatron.some(tp => tp.includes(t) || t.includes(tp))) aciertos += 1;
        }

        const similitud = (aciertos / (tokensPatron.length * 2)) * 50;
        // Bonus si el tema coincide con el contexto reciente
        const bonusContexto = (ultimoTema && item.categoria === ultimoTema) ? 15 : 0;
        const puntajeTotal = similitud + bonusContexto;

        if (puntajeTotal > maxPuntaje && aciertos >= 2) {
          maxPuntaje = puntajeTotal;
          mejorItem = item;
        }
      }
    }
  }

  return maxPuntaje >= 20 ? { item: mejorItem, puntaje: maxPuntaje } : null;
}

/* ══════════════════════════════════════════════════════════════
   MOTOR PRINCIPAL HÍBRIDO (GEMINI IA + FALLBACK LOCAL MTC)
   ══════════════════════════════════════════════════════════════ */

export async function responderTutorIAPrompt({
  mensajeUsuario,
  chatMensajes = [],
  contextoConversacion = {},
  datosUsuario = {},
  historialSimulacros = [],
  progresoPractica = {},
  metricasHistorial = {},
  catDebil = ''
}) {
  const apiKey = getApiKeyGemini();

  // Si hay clave configurada, intentar respuesta con IA Gemini Generativa
  if (apiKey) {
    try {
      const resGemini = await consultarGeminiMTC({
        mensajeUsuario,
        contextoConversacion: chatMensajes,
        datosUsuario,
        metricas: metricasHistorial,
        catDebil
      });

      if (resGemini && resGemini.texto) {
        return {
          texto: resGemini.texto,
          preguntaData: null,
          nuevoContexto: { ...contextoConversacion, ultimoTema: 'gemini_ia' },
          esIA: true,
          proveedor: resGemini.proveedor
        };
      }
    } catch (err) {
      console.warn('[TutorIA] Fallo de Gemini API, activando fallback local MTC:', err?.message || err);
    }
  }

  // Fallback determinista local si no hay API key o si falla la llamada
  const resLocal = responderTutorIA({
    mensajeUsuario,
    contextoConversacion,
    datosUsuario,
    historialSimulacros,
    progresoPractica,
    metricasHistorial
  });

  return {
    ...resLocal,
    esIA: false,
    proveedor: 'Motor Local MTC'
  };
}

/* ── Motor Local Determinista Síncrono ── */
export function responderTutorIA({
  mensajeUsuario,
  contextoConversacion = {},
  datosUsuario = {},
  historialSimulacros = [],
  progresoPractica = {},
  metricasHistorial = {}
}) {
  const textoOriginal = (mensajeUsuario || '').trim();
  const textoNorm = normalizar(textoOriginal);
  const nombre = datosUsuario?.nombre ? datosUsuario.nombre.split(' ')[0] : '';

  /* ── 1. EVALUACIÓN DE RESPUESTA A PREGUNTA TIPO EXAMEN ACTIVA ── */
  if (contextoConversacion?.preguntaActiva) {
    const pActiva = contextoConversacion.preguntaActiva;
    
    // Detectar respuesta por letra (A, B, C, D) o por texto
    let opcionElegida = null;

    const regexLetra = /\b(opcion\s+)?([a-d])\b/i;
    const match = textoNorm.match(regexLetra);
    if (match) {
      opcionElegida = match[2].toLowerCase();
    } else if (pActiva.opciones) {
      // Buscar si el texto coincide con una de las alternativas
      for (const op of pActiva.opciones) {
        const opNorm = normalizar(op.texto);
        if (textoNorm.includes(opNorm.slice(0, 15)) || opNorm.includes(textoNorm)) {
          opcionElegida = op.id.toLowerCase();
          break;
        }
      }
    }

    if (opcionElegida && ['a', 'b', 'c', 'd'].includes(opcionElegida)) {
      const esCorrecta = opcionElegida === pActiva.correcta.toLowerCase();
      const opcionCorrectaObj = pActiva.opciones.find(o => o.id.toLowerCase() === pActiva.correcta.toLowerCase());

      if (esCorrecta) {
        return {
          texto: `🎉 **¡Correcto${nombre ? `, ${nombre}` : ''}!**\n\n### 🚦 Respuesta\n**Opción (${pActiva.correcta.toUpperCase()}):** ${opcionCorrectaObj?.texto || ''}\n\n### 📌 Explicación\n${pActiva.explicacion}\n\n### 🧠 Para recordar\n¡Excelente razonamiento! Dominar este tipo de preguntas te asegura un alto puntaje en el examen oficial.\n\n¿Quieres que te haga otra pregunta de práctica o prefieres consultar sobre algún tema en específico?`,
          preguntaData: null,
          nuevoContexto: { ...contextoConversacion, preguntaActiva: null, ultimoTema: pActiva.categoria || 'practica' }
        };
      } else {
        return {
          texto: `⚠️ **Respuesta incorrecta.** Elegiste la opción (${opcionElegida.toUpperCase()}), pero la respuesta correcta es la **(${pActiva.correcta.toUpperCase()})**.\n\n### 🚦 Respuesta Correcta\n👉 **(${pActiva.correcta.toUpperCase()}):** ${opcionCorrectaObj?.texto || ''}\n\n### 📌 Explicación\n${pActiva.explicacion}\n\n### 🧠 Para recordar\nNo te preocupes: practicar y entender el porqué de cada error es la forma más efectiva de aprender antes del examen oficial.\n\n¿Quieres intentar otra pregunta de examen?`,
          preguntaData: null,
          nuevoContexto: { ...contextoConversacion, preguntaActiva: null, ultimoTema: pActiva.categoria || 'practica' }
        };
      }
    }
  }

  /* ── 2. DETECCIÓN DE PREGUNTAS FUERA DEL ÁMBITO MTC ── */
  const esFueraDominio = TEMAS_FUERA_DOMINIO.some(t => textoNorm.includes(normalizar(t))) &&
    !textoNorm.includes('transito') && !textoNorm.includes('mtc') && !textoNorm.includes('licencia') &&
    !textoNorm.includes('brevete') && !textoNorm.includes('regla') && !textoNorm.includes('carro') && !textoNorm.includes('auto');

  if (esFueraDominio) {
    return {
      texto: `Soy el asistente de DrivePrepPlus y estoy especializado en ayudarte con la preparación para el examen de reglas de tránsito del MTC 🚗.\n\nPuedo ayudarte con:\n• 🚦 Señales de tránsito y sus significados\n• 🛣️ Reglas de circulación y prioridad de paso\n• 🛑 PARE y CEDA EL PASO\n• 🔄 Óvalos e intersecciones\n• ⚠️ Infracciones y sistema de puntos\n• 🔧 Mecánica básica y primeros auxilios\n• 📝 Preguntas de práctica tipo examen\n\n¿Qué tema del MTC quieres estudiar?`,
      preguntaData: null,
      nuevoContexto: { ...contextoConversacion, ultimoTema: null }
    };
  }

  /* ── 3. SOLICITUD DE PREGUNTAS TIPO EXAMEN ── */
  const pidePregunta = /^(hazme|dame|ponme|quiero|preguntame)\s+(una\s+)?pregunta/i.test(textoNorm) ||
    textoNorm.includes('hazme una pregunta') ||
    textoNorm.includes('dame una pregunta') ||
    textoNorm.includes('ponme una pregunta') ||
    textoNorm.includes('quiero practicar') ||
    textoNorm.includes('pregunta de examen') ||
    textoNorm.includes('pregunta de senales') ||
    textoNorm.includes('pregunta de señales') ||
    textoNorm.includes('pregunta sobre pare') ||
    textoNorm.includes('pregunta sobre mecanica') ||
    textoNorm.includes('pregunta sobre mecánica') ||
    textoNorm.includes('pregunta dificil') ||
    textoNorm.includes('pregunta difícil');

  if (pidePregunta) {
    let categoriaTema = null;
    let kw = '';
    if (textoNorm.includes('senal') || textoNorm.includes('señal')) {
      categoriaTema = 'senales';
    } else if (textoNorm.includes('pare') || textoNorm.includes('ceda')) {
      kw = 'pare';
    } else if (textoNorm.includes('mecanica') || textoNorm.includes('mecánica')) {
      categoriaTema = 'mecanica_basica';
    } else if (textoNorm.includes('infraccion') || textoNorm.includes('infracción') || textoNorm.includes('sancion')) {
      categoriaTema = 'infracciones';
    } else if (textoNorm.includes('norma') || textoNorm.includes('circulacion') || textoNorm.includes('circulación')) {
      categoriaTema = 'normas';
    }

    const p = generarPreguntaPractica(categoriaTema, kw);
    const opcionesFormato = p.opciones.map(o => `**${o.id.toUpperCase()})** ${o.texto}`).join('\n');

    return {
      texto: `📝 **Pregunta tipo examen MTC**\n\n**${p.enunciado}**\n\n${opcionesFormato}\n\n👉 *Escribe o selecciona tu respuesta (A, B, C o D) para verificar si es correcta.*`,
      preguntaData: p,
      nuevoContexto: { ...contextoConversacion, preguntaActiva: p, ultimoTema: p.categoria || 'practica' }
    };
  }

  /* ── 4. CONSULTA DE PROGRESO Y ESTADÍSTICAS REALES ── */
  const pideProgreso = /que deberia estudiar|qué debería estudiar|analiza mi progreso|analizar mi progreso|mis estadisticas|mis estadísticas|mis errores|estoy listo para el examen/i.test(textoNorm);

  if (pideProgreso) {
    const totalSimulacros = metricasHistorial?.simulacrosRealizados || historialSimulacros.filter(e => e.tipo === 'simulacro_completo').length || 0;
    
    if (totalSimulacros === 0) {
      return {
        texto: `Para recomendarte un tema específico necesito revisar tus resultados. Mientras tanto, puedo ayudarte a practicar cualquier categoría del examen MTC.\n\n### 🚦 Recomendación inicial\nTe sugiero ingresar a la sección de **Simuladores** y rendir tu primer simulacro de diagnóstico. Una vez completado, podré indicarte con exactitud tus temas a reforzar.\n\n¿Quieres que practiquemos con una pregunta rápida ahora mismo?`,
        preguntaData: null,
        nuevoContexto: { ...contextoConversacion, ultimoTema: 'progreso' }
      };
    }

    const promedio = metricasHistorial?.promedioPuntaje || 0;
    const mapaCat = {};
    historialSimulacros.forEach(s => {
      (s.porCategoria || []).forEach(cat => {
        const key = cat.categoriaId || cat.label;
        if (!mapaCat[key]) mapaCat[key] = { label: cat.label || key, corr: 0, total: 0 };
        mapaCat[key].corr += cat.correctas || 0;
        mapaCat[key].total += cat.total || 0;
      });
    });

    const ordenadas = Object.values(mapaCat)
      .map(c => ({ ...c, pct: c.total > 0 ? Math.round((c.corr / c.total) * 100) : 0 }))
      .sort((a, b) => a.pct - b.pct);

    const peorCat = ordenadas[0];
    const temaDebil = peorCat ? peorCat.label : 'Señales de Tránsito';

    return {
      texto: `Según tus últimos resultados registrados, tu promedio general es de **${promedio}%** y tu porcentaje más bajo está en **${temaDebil}** (${peorCat ? peorCat.pct : 50}% de acierto).\n\nTe recomiendo reforzar ese tema antes de realizar otro simulacro completo.\n\n¿Quieres que revisemos las reglas clave de **${temaDebil}** o prefieres hacer una pregunta de práctica?`,
      preguntaData: null,
      nuevoContexto: { ...contextoConversacion, ultimoTema: temaDebil }
    };
  }

  /* ── 5. BÚSQUEDA ESPECÍFICA EN LA BASE DE CONOCIMIENTOS ── */
  const resultadoBusqueda = buscarEnBaseConocimientos(textoNorm, contextoConversacion?.ultimoTema);

  if (resultadoBusqueda && resultadoBusqueda.item) {
    const item = resultadoBusqueda.item;
    const listaRespuestas = item.respuestas || [];
    const fnRespuesta = listaRespuestas[Math.floor(Math.random() * listaRespuestas.length)] || listaRespuestas[0];
    const textoRespuesta = typeof fnRespuesta === 'function' ? fnRespuesta(nombre) : fnRespuesta;

    return {
      texto: textoRespuesta,
      preguntaData: null,
      nuevoContexto: { ...contextoConversacion, ultimoTema: item.categoria }
    };
  }

  /* ── 6. RESPUESTA DE ORIENTACIÓN GENERAL ── */
  return {
    texto: `Comprendo tu consulta sobre el examen MTC${nombre ? `, ${nombre}` : ''}.\n\n### 🚦 Respuesta\nEn el Reglamento Nacional de Tránsito del Perú, cada situación se rige por la **jerarquía de las normas**, la **prioridad de paso** y la **conducción preventiva**.\n\nPuedes preguntarme puntualmente sobre:\n• **Señales:** Preventivas, reglamentarias o informativas.\n• **Cruce:** PARE, CEDA EL PASO u óvalos.\n• **Velocidades:** Límites en calles (30 km/h) y avenidas (50 km/h).\n• **Infracciones:** Faltas graves, muy graves y sistema de puntos.\n• **Mecánica:** Mantenimiento preventivo y testigos.\n\n¿Sobre cuál de estos temas te gustaría profundizar o quieres una pregunta de práctica?`,
    preguntaData: null,
    nuevoContexto: { ...contextoConversacion, ultimoTema: 'general_mtc' }
  };
}
