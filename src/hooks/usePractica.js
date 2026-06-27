/* ============================================================
   DrivePrep+ — usePractica (hook)
   Gestiona progreso persistido, sesión activa y métricas.
   Todo el almacenamiento está aislado por usuario.
   TODO Fase backend: reemplazar localStorage por API calls
   ============================================================ */

import { useState, useCallback, useEffect } from 'react';
import {
  obtenerPreguntasPorCategoria,
  evaluarRespuestaPractica,
  CATEGORIAS_PRACTICA,
} from '../data/bancoPractica';
import { useAuth } from '../context/AuthContext';
import { leerJSON, guardarJSON } from '../utils/storageUsuario';

const STORAGE_KEY   = 'driveprep_practica_progreso';
const HISTORIAL_KEY = 'driveprep_practica_historial';

/* ── Id del usuario activo, leído directamente de la sesión ──
   Se usa así (en vez de recibir el id por parámetro) para que
   leerHistorialPractica() pueda seguir llamándose sin argumentos
   desde EstadisticasPage, RecomendacionesPage y PracticaPage. */
function idUsuarioActivo() {
  try {
    const s = localStorage.getItem('driveprep_session');
    return s ? JSON.parse(s).id : null;
  } catch { return null; }
}

function leerProgreso(userId) {
  return leerJSON(STORAGE_KEY, userId, {});
}
function guardarProgreso(userId, data) {
  guardarJSON(STORAGE_KEY, userId, data);
}
export function leerHistorialPractica() {
  return leerJSON(HISTORIAL_KEY, idUsuarioActivo(), []);
}
function agregarAlHistorial(userId, entrada) {
  const hist = leerJSON(HISTORIAL_KEY, userId, []);
  hist.unshift(entrada);
  guardarJSON(HISTORIAL_KEY, userId, hist.slice(0, 20));
}

export function usePractica() {
  const { usuario } = useAuth();
  const userId = usuario?.id || null;

  const [progreso, setProgreso] = useState(() => leerProgreso(userId));
  const [sesion,   setSesion]   = useState(null);

  /* Si cambia el usuario activo (cambio de cuenta), recargar su
     propio progreso en vez de seguir mostrando el de la cuenta
     anterior que quedó en el estado de React. */
  useEffect(() => {
    setProgreso(leerProgreso(userId));
    setSesion(null);
  }, [userId]);

  /* ── Métricas globales ── */
  const metricas = useCallback(() => {
    const cats = Object.values(CATEGORIAS_PRACTICA);
    let totalRespondidas = 0, totalCorrectas = 0, totalTiempoMin = 0;
    cats.forEach((cat) => {
      const p = progreso[cat.id] || {};
      totalRespondidas += p.preguntasRespondidas || 0;
      totalCorrectas   += p.respuestasCorrectas  || 0;
      totalTiempoMin   += p.tiempoTotalMin        || 0;
    });
    const temasDebiles = cats
      .map((cat) => {
        const p    = progreso[cat.id] || {};
        const resp = p.preguntasRespondidas || 0;
        const corr = p.respuestasCorrectas  || 0;
        const pct  = resp > 0 ? Math.round((corr / resp) * 100) : null;
        return { ...cat, respondidas: resp, correctas: corr, porcentaje: pct };
      })
      .filter((t) => t.porcentaje !== null)
      .sort((a, b) => a.porcentaje - b.porcentaje)
      .slice(0, 3);

    return {
      totalRespondidas,
      totalCorrectas,
      promedioAciertos: totalRespondidas > 0 ? Math.round((totalCorrectas / totalRespondidas) * 100) : 0,
      totalTiempoMin:   Math.round(totalTiempoMin),
      temasDebiles,
    };
  }, [progreso]);

  /* ── Progreso de una categoría ── */
  const progresoCat = useCallback((catId) => {
    const p     = progreso[catId] || {};
    const total = CATEGORIAS_PRACTICA[catId]?.totalPreguntas || 10;
    const resp  = p.preguntasRespondidas || 0;
    const corr  = p.respuestasCorrectas  || 0;
    return {
      preguntasRespondidas: resp,
      respuestasCorrectas:  corr,
      totalPreguntas:       total,
      porcentajeAvance:     Math.round((resp / total) * 100),
      porcentajeAciertos:   resp > 0 ? Math.round((corr / resp) * 100) : 0,
      intentos:             p.intentos || 0,
      ultimoIntento:        p.ultimoIntento || null,
    };
  }, [progreso]);

  /* ── Iniciar sesión ── */
  const iniciarPractica = useCallback((catId) => {
    const preguntas = obtenerPreguntasPorCategoria(catId);
    setSesion({
      categoriaId: catId,
      preguntas,
      indicePregunta: 0,
      respuestas: {},
      finalizada: false,
      resultado: null,
      tiempoInicio: Date.now(),
    });
  }, []);

  /* ── Responder ── */
  const responder = useCallback((preguntaId, valor) => {
    setSesion((prev) => prev ? { ...prev, respuestas: { ...prev.respuestas, [preguntaId]: valor } } : prev);
  }, []);

  const irA       = useCallback((idx) => setSesion((p) => p ? { ...p, indicePregunta: idx } : p), []);
  const siguiente = useCallback(() => setSesion((p) => p ? { ...p, indicePregunta: Math.min(p.indicePregunta + 1, p.preguntas.length - 1) } : p), []);
  const anterior  = useCallback(() => setSesion((p) => p ? { ...p, indicePregunta: Math.max(p.indicePregunta - 1, 0) } : p), []);

  /* ── Finalizar ── */
  const finalizarPractica = useCallback(() => {
    if (!sesion) return;
    const { categoriaId, preguntas, respuestas, tiempoInicio } = sesion;
    const tiempoSeg = Math.round((Date.now() - tiempoInicio) / 1000);

    let correctas = 0, puntajeParcial = 0;
    const detalle = preguntas.map((p) => {
      const resp = respuestas[p.id];
      const ev   = evaluarRespuestaPractica(p, resp);
      if (ev.correcta) correctas++;
      puntajeParcial += ev.puntajeParcial;
      return { ...p, respuestaUsuario: resp, ...ev };
    });

    const total   = preguntas.length;
    const puntaje = total > 0 ? Math.round((puntajeParcial / total) * 100) : 0;
    const resultado = {
      categoriaId, puntaje, correctas, total,
      aprobado: puntaje >= 70,
      tiempoSegundos: tiempoSeg,
      detalle,
      fecha: new Date().toLocaleDateString('es-PE', { day:'2-digit', month:'short', year:'numeric' }),
      hora:  new Date().toLocaleTimeString('es-PE', { hour:'2-digit', minute:'2-digit' }),
      fechaTs: Date.now(),
    };

    const progresoActual = leerProgreso(userId);
    const ant = progresoActual[categoriaId] || {};
    const nuevo = {
      ...progresoActual,
      [categoriaId]: {
        preguntasRespondidas: (ant.preguntasRespondidas || 0) + total,
        respuestasCorrectas:  (ant.respuestasCorrectas  || 0) + correctas,
        tiempoTotalMin:       (ant.tiempoTotalMin        || 0) + tiempoSeg / 60,
        intentos:             (ant.intentos              || 0) + 1,
        ultimoIntento:        resultado.fecha,
        ultimoPuntaje:        puntaje,
      },
    };
    guardarProgreso(userId, nuevo);
    setProgreso(nuevo);

    agregarAlHistorial(userId, {
      categoriaId,
      categoriaLabel: CATEGORIAS_PRACTICA[categoriaId]?.label,
      categoriaColor: CATEGORIAS_PRACTICA[categoriaId]?.color,
      categoriaEmoji: CATEGORIAS_PRACTICA[categoriaId]?.emoji,
      puntaje, correctas, total,
      fecha: resultado.fecha,
    });

    setSesion((prev) => ({ ...prev, finalizada: true, resultado }));
  }, [sesion, userId]);

  const reiniciar    = useCallback(() => { if (sesion) iniciarPractica(sesion.categoriaId); }, [sesion, iniciarPractica]);
  const cerrarSesion = useCallback(() => setSesion(null), []);

  const preguntaActual       = sesion ? sesion.preguntas[sesion.indicePregunta] : null;
  const totalPreguntas       = sesion ? sesion.preguntas.length : 0;
  const respondidas          = sesion ? Object.keys(sesion.respuestas).length : 0;
  const porcentajeAvanceSesion = totalPreguntas > 0 ? Math.round((respondidas / totalPreguntas) * 100) : 0;

  return {
    sesion, progreso, preguntaActual, totalPreguntas,
    respondidas, porcentajeAvanceSesion,
    metricas, progresoCat,
    iniciarPractica, responder, irA, siguiente, anterior,
    finalizarPractica, reiniciar, cerrarSesion,
  };
}
