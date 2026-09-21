/* ============================================================
   DrivePrep+ — Servicio de Inteligencia Artificial (Google Gemini)
   Conexión con la API REST gratuita de Gemini 1.5 / 2.0 Flash
   con soporte de fallback y gestión de claves API.
   ============================================================ */

const CHAVE_STORAGE_KEY = 'driveprep_gemini_key';

/* ── Obtener la clave API activa ── */
export function getApiKeyGemini() {
  const localKey = localStorage.getItem(CHAVE_STORAGE_KEY);
  if (localKey && localKey.trim()) {
    return localKey.trim();
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

/* ── Guardar o borrar clave API en localStorage ── */
export function setApiKeyGemini(key) {
  if (!key || !key.trim()) {
    localStorage.removeItem(CHAVE_STORAGE_KEY);
  } else {
    localStorage.setItem(CHAVE_STORAGE_KEY, key.trim());
  }
}

/* ── System Prompt especializado en el MTC (Perú) ── */
function construirSystemPrompt({ nombreUsuario = 'Estudiante', temaDebil = '', promedio = 0 }) {
  return `Eres **Max**, el instructor virtual especialista en el Examen de Reglas de Tránsito del MTC (Ministerio de Transportes y Comunicaciones del Perú) para la app DrivePrepPlus.

Tu objetivo principal es capacitar y guiar a ${nombreUsuario} para que apruebe su examen teórico de conducción MTC a la primera.

REGLAS DE RESPUESTA:
1. **Dominio Temático MTC Perú:** Solo responde consultas relacionadas al Reglamento Nacional de Tránsito del Perú, señales de tránsito (preventivas, reglamentarias, informativas), prioridad de paso, óvalos, infracciones y sanciones (M01, M39, etc.), mecánica básica y primeros auxilios. Si la pregunta no se relaciona al tránsito o examen MTC, amablemente reorienta a estudiar para la licencia.
2. **Personalización Educativa:** El estudiante tiene un promedio actual de ${promedio}% y su tema a reforzar es "${temaDebil || 'Reglamento General'}". Haz referencias sutiles a esto si viene al caso.
3. **Formato y Estilo:**
   - Usa un tono amigable, motivador y sumamente claro.
   - Utiliza formato Markdown impecable (títulos \`###\`, negritas \`**\`, listas con viñetas \`•\`, emojis útiles).
   - Mantén respuestas concisas de 2 a 4 párrafos bien estructurados para facilitar la lectura rápida.
4. **Preguntas tipo Examen:** Si el usuario te pide una pregunta de examen o evaluación, formula una pregunta de opción múltiple con 4 alternativas etiquetadas **A)**, **B)**, **C)**, **D)** e indícale que responda con la letra para darle el resultado.`;
}

/* ── Función principal para consultar a Gemini API ── */
export async function consultarGeminiMTC({
  mensajeUsuario,
  contextoConversacion = [],
  datosUsuario = {},
  metricas = {},
  catDebil = ''
}) {
  const apiKey = getApiKeyGemini();
  if (!apiKey) {
    throw new Error('Sin clave API de Gemini configurada.');
  }

  const nombreUsuario = datosUsuario?.nombre ? datosUsuario.nombre.split(' ')[0] : 'Estudiante';
  const systemPrompt = construirSystemPrompt({
    nombreUsuario,
    temaDebil: catDebil,
    promedio: metricas.promedioPuntaje || 0
  });

  // Construir historial de mensajes para la API de Gemini
  const contents = [
    {
      role: 'user',
      parts: [{ text: `[INSTRUCCIÓN DE SISTEMA GENERAL - NO RESPONDER DIRECTAMENTE A ESTO] ${systemPrompt}` }]
    },
    {
      role: 'model',
      parts: [{ text: `¡Entendido! Soy Max, el instructor virtual del MTC para ${nombreUsuario}. Estoy listo para guiarle con el Reglamento de Tránsito de Perú y preguntas de examen.` }]
    }
  ];

  // Agregar hasta los últimos 6 mensajes del chat para contexto
  if (Array.isArray(contextoConversacion) && contextoConversacion.length > 0) {
    const ultimos = contextoConversacion.slice(-6);
    ultimos.forEach((msg) => {
      if (msg.texto) {
        contents.push({
          role: msg.emisor === 'usuario' ? 'user' : 'model',
          parts: [{ text: msg.texto }]
        });
      }
    });
  }

  // Agregar el mensaje actual del usuario
  contents.push({
    role: 'user',
    parts: [{ text: mensajeUsuario }]
  });

  // Probar con gemini-1.5-flash primero, o gemini-2.0-flash
  const modelos = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
  let ultimoError = null;

  for (const modelo of modelos) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 segundos timeout

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
              topP: 0.95
            }
          })
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        console.warn(`[Gemini API] Error HTTP ${response.status} en modelo ${modelo}:`, errorBody);
        throw new Error(`Error en API Gemini (${response.status})`);
      }

      const data = await response.json();
      const respuestaTexto = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (respuestaTexto) {
        return {
          texto: respuestaTexto.trim(),
          proveedor: `Google Gemini (${modelo})`,
          esIA: true
        };
      }
    } catch (err) {
      ultimoError = err;
      // Continuar probando el siguiente modelo si falla el actual
    }
  }

  throw ultimoError || new Error('No se pudo obtener respuesta de la API de Gemini.');
}
