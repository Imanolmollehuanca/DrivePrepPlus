/* ============================================================
   DrivePrep+ — useSimulacro (hook) — Fase 3 (tipos mixtos)
   Lógica central: temporizador, respuestas, evaluación universal.
   ============================================================ */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  obtenerPreguntasSimulacro, CATEGORIAS,
  CONFIG_SIMULACRO, evaluarRespuesta,
} from '../data/bancoPreguntasMTC';
import { useAuth } from '../context/AuthContext';
import { leerJSON, guardarJSON } from '../utils/storageUsuario';

export const ESTADOS = {
  IDLE:       'idle',
  ACTIVO:     'activo',
  FINALIZADO: 'finalizado',
};

/* ── Calcula resultados por categoría usando el evaluador universal ── */
function calcularResultadosPorCategoria(preguntas, respuestas) {
  const mapa = {};
  preguntas.forEach((p) => {
    const cat = p.categoria;
    if (!mapa[cat]) mapa[cat] = { correctas: 0, incorrectas: 0, omitidas: 0, total: 0, puntajeParcial: 0 };
    mapa[cat].total += 1;

    const resp = respuestas[p.id];
    if (resp === undefined || resp === null) {
      mapa[cat].omitidas += 1;
    } else {
      const { correcta, puntajeParcial } = evaluarRespuesta(p, resp);
      mapa[cat].puntajeParcial += puntajeParcial;
      if (correcta) mapa[cat].correctas += 1;
      else          mapa[cat].incorrectas += 1;
    }
  });

  return Object.entries(mapa).map(([catId, datos]) => ({
    categoriaId:  catId,
    label:        CATEGORIAS[catId]?.label || catId,
    color:        CATEGORIAS[catId]?.color || '#6366f1',
    ...datos,
    porcentaje: datos.total > 0 ? Math.round((datos.puntajeParcial / datos.total) * 100) : 0,
  })).sort((a, b) => a.porcentaje - b.porcentaje);
}

/* ════════════════════════════════════════════ */
export function useSimulacro() {
  const { usuario } = useAuth();
  const userId = usuario?.id || null;

  const tiempoTotal = CONFIG_SIMULACRO.tiempoLimiteMinutos * 60;

  const [estado,         setEstado]         = useState(ESTADOS.IDLE);
  const [preguntas,      setPreguntas]      = useState([]);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [respuestas,     setRespuestas]     = useState({});
  const [marcadas,       setMarcadas]       = useState({});
  const [tiempoRestante, setTiempoRestante] = useState(tiempoTotal);
  const [resultado,      setResultado]      = useState(null);
  const [tiempoUsado,    setTiempoUsado]    = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  /* ── Temporizador ── */
  useEffect(() => {
    if (estado !== ESTADOS.ACTIVO) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) { clearInterval(intervalRef.current); finalizarSimulacro(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [estado]);

  /* ── Iniciar ── */
  const iniciarSimulacro = useCallback(() => {
    const qs = obtenerPreguntasSimulacro();
    setPreguntas(qs);
    setIndicePregunta(0);
    setRespuestas({});
    setMarcadas({});
    setTiempoRestante(tiempoTotal);
    setTiempoUsado(0);
    setResultado(null);
    setEstado(ESTADOS.ACTIVO);
  }, [tiempoTotal]);

  /* ── Seleccionar respuesta (cualquier tipo) ── */
  const seleccionarRespuesta = useCallback((preguntaId, valor) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: valor }));
  }, []);

  /* ── Navegación ── */
  const irAPregunta = useCallback((i) => {
    if (i >= 0 && i < preguntas.length) setIndicePregunta(i);
  }, [preguntas.length]);

  const siguiente = useCallback(() => {
    setIndicePregunta((i) => Math.min(i + 1, preguntas.length - 1));
  }, [preguntas.length]);

  const anterior = useCallback(() => {
    setIndicePregunta((i) => Math.max(i - 1, 0));
  }, []);

  /* ── Marcar ── */
  const toggleMarcada = useCallback((id) => {
    setMarcadas((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  /* ── Finalizar ── */
  const finalizarSimulacro = useCallback((porTiempo = false) => {
    clearInterval(intervalRef.current);
    setEstado(ESTADOS.FINALIZADO);

    // Calcular con evaluador universal (puntaje parcial para tipos complejos)
    let puntajeSuma = 0;
    let correctas   = 0;
    let incorrectas = 0;
    let omitidas    = 0;

    preguntas.forEach((p) => {
      const resp = respuestas[p.id];
      if (resp === undefined || resp === null) {
        omitidas += 1;
      } else {
        const { correcta, puntajeParcial } = evaluarRespuesta(p, resp);
        puntajeSuma += puntajeParcial;
        if (correcta) correctas += 1;
        else          incorrectas += 1;
      }
    });

    const total    = preguntas.length;
    const puntaje  = total > 0 ? Math.round((puntajeSuma / total) * 100) : 0;
    const aprobado = puntaje >= CONFIG_SIMULACRO.puntajeAprobacion;
    const usadoSeg = porTiempo ? tiempoTotal : tiempoTotal - tiempoRestante;

    const res = {
      puntaje, correctas, incorrectas, omitidas, total,
      aprobado, porTiempo,
      porCategoria: calcularResultadosPorCategoria(preguntas, respuestas),
      tiempoUsadoSegundos: usadoSeg,
      fecha: new Date().toLocaleDateString('es-PE', { day:'2-digit', month:'short', year:'numeric' }),
      hora:  new Date().toLocaleTimeString('es-PE', { hour:'2-digit', minute:'2-digit' }),
      fechaTs: Date.now(), 
    };

    setResultado(res);
    setTiempoUsado(usadoSeg);

    try {
      const hist = leerJSON('driveprep_historial', userId, []);
      hist.unshift(res);
      guardarJSON('driveprep_historial', userId, hist.slice(0, 20));
    } catch { /* ignore */ }
  }, [preguntas, respuestas, tiempoRestante, tiempoTotal, userId]);

  /* ── Reiniciar ── */
  const reiniciar = useCallback(() => {
    clearInterval(intervalRef.current);
    setEstado(ESTADOS.IDLE);
    setPreguntas([]);
    setIndicePregunta(0);
    setRespuestas({});
    setMarcadas({});
    setTiempoRestante(tiempoTotal);
    setTiempoUsado(0);
    setResultado(null);
  }, [tiempoTotal]);

  /* ── Derivados ── */
  const preguntaActual = preguntas[indicePregunta] || null;
  const totalPreguntas = preguntas.length;

  /* "Respondida" = tiene algún valor no nulo */
  const contarRespondidas = () => {
    return Object.values(respuestas).filter((v) => {
      if (v === null || v === undefined) return false;
      if (typeof v === 'object' && !Array.isArray(v)) return Object.keys(v).length > 0;
      if (Array.isArray(v)) return v.length > 0;
      return true;
    }).length;
  };

  const respondidas      = contarRespondidas();
  const porcentajeAvance = totalPreguntas > 0 ? Math.round((respondidas / totalPreguntas) * 100) : 0;

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return {
    estado, preguntas, preguntaActual, indicePregunta,
    respuestas, marcadas, resultado,
    tiempoRestante,
    tiempoRestanteFormato: fmt(tiempoRestante),
    tiempoUsadoFormato:    fmt(tiempoUsado),
    tiempoEsCritico:       tiempoRestante <= 120,
    totalPreguntas, respondidas,
    sinResponder:   totalPreguntas - respondidas,
    porcentajeAvance,
    iniciarSimulacro, seleccionarRespuesta, irAPregunta,
    siguiente, anterior, toggleMarcada, finalizarSimulacro, reiniciar,
  };
}
