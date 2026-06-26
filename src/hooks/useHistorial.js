/* ============================================================
   DrivePrep+ — useHistorial (hook unificado)
   Fusiona el historial de simulacros + práctica por temas.
   Cada usuario lee únicamente su propio namespace de datos.
   TODO Fase 4: reemplazar por GET /api/historial/:userId
   ============================================================ */
import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { leerJSON } from '../utils/storageUsuario';

const KEY_SIMULACROS = 'driveprep_historial';
const KEY_PRACTICA   = 'driveprep_practica_historial';

/* ── Leer cada fuente, aisladas por usuario ── */
function leerSimulacros(userId) {
  return leerJSON(KEY_SIMULACROS, userId, []);
}
function leerPractica(userId) {
  return leerJSON(KEY_PRACTICA, userId, []);
}

/* ── Normalizar un simulacro completo al formato unificado ── */
function normalizarSimulacro(s, idx) {
  return {
    id:            `sim-${idx}`,
    tipo:          'simulacro_completo',
    tipoLabel:     'Simulador completo',
    tipoSub:       'Simulacro tipo MTC',
    categoriaId:   null,
    categoriaLabel: null,
    puntaje:       s.puntaje       || 0,
    correctas:     s.correctas     || 0,
    incorrectas:   s.incorrectas   || 0,
    omitidas:      s.omitidas      || 0,
    total:         s.total         || 0,
    aprobado:      s.aprobado      ?? (s.puntaje >= 70),
    tiempoSegundos: s.tiempoUsadoSegundos || 0,
    porCategoria:  s.porCategoria  || [],
    fecha:         s.fecha         || '—',
    hora:          s.hora          || '—',
    fechaTs:       s.fechaTs       || 0,
  };
}

/* ── Normalizar una sesión de práctica al formato unificado ── */
function normalizarPractica(p, idx) {
  return {
    id:            `prac-${idx}`,
    tipo:          'practica',
    tipoLabel:     p.categoriaLabel || 'Práctica por temas',
    tipoSub:       'Práctica por temas',
    categoriaId:   p.categoriaId   || null,
    categoriaLabel: p.categoriaLabel || null,
    categoriaColor: p.categoriaColor || '#6366f1',
    categoriaEmoji: p.categoriaEmoji || '📚',
    puntaje:       p.puntaje       || 0,
    correctas:     p.correctas     || 0,
    incorrectas:   (p.total || 0) - (p.correctas || 0),
    omitidas:      0,
    total:         p.total         || 0,
    aprobado:      p.puntaje >= 70,
    tiempoSegundos: 0,
    porCategoria:  [],
    fecha:         p.fecha         || '—',
    hora:          p.hora          || '—',
    fechaTs:       p.fechaTs       || 0,
  };
}

/* ── Formatear segundos → "X min Y seg" ── */
export function formatearTiempo(segundos) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  if (m === 0) return `${s} seg`;
  if (s === 0) return `${m} min`;
  return `${m}m ${s}s`;
}

/* ════════════════════════════════════════════ */
export function useHistorial() {
  const { usuario } = useAuth();
  const userId = usuario?.id || null;

  const [_tick, setTick] = useState(0);
  const recargar = useCallback(() => setTick((t) => t + 1), []);

  /* Combinar y ordenar las dos fuentes (más reciente primero).
     Se recalcula también cuando cambia el usuario activo, así al
     cambiar de cuenta nunca se mezclan datos de la sesión anterior. */
  const entradas = useMemo(() => {
    const sims   = leerSimulacros(userId).map(normalizarSimulacro);
    const practs = leerPractica(userId).map(normalizarPractica);
    return [...sims, ...practs].sort((a, b) => {
      // Ordena por índice aproximado (sin timestamp real, respetamos el orden de inserción)
      // En Fase 4 se ordena por timestamp real del servidor
      return 0;
    });
  }, [_tick, userId]);

  /* ── Métricas globales ── */
  const metricas = useMemo(() => {
    if (entradas.length === 0) return {
      totalSesiones: 0, simulacrosRealizados: 0, sesionasPractica: 0,
      promedioPuntaje: 0, mejorPuntaje: 0, totalCorrectaas: 0,
      totalRespondidas: 0, tiempoTotalSegundos: 0,
    };

    const simulacros = entradas.filter((e) => e.tipo === 'simulacro_completo');
    const practicas  = entradas.filter((e) => e.tipo === 'practica');
    const totalRespondidas  = entradas.reduce((a, e) => a + e.total, 0);
    const totalCorrectas    = entradas.reduce((a, e) => a + e.correctas, 0);
    const promedio = Math.round(entradas.reduce((a, e) => a + e.puntaje, 0) / entradas.length);
    const mejor    = Math.max(...entradas.map((e) => e.puntaje));
    const tiempoSeg = entradas.reduce((a, e) => a + (e.tiempoSegundos || 0), 0);

    return {
      totalSesiones:        entradas.length,
      simulacrosRealizados: simulacros.length,
      sesionasPractica:     practicas.length,
      promedioPuntaje:      promedio,
      mejorPuntaje:         mejor,
      totalCorrectas,
      totalRespondidas,
      tiempoTotalSegundos:  tiempoSeg,
    };
  }, [entradas]);

  /* ── Filtrar por tipo ── */
  const filtrar = useCallback((tipo = 'todos') => {
    if (tipo === 'todos')      return entradas;
    if (tipo === 'simulacros') return entradas.filter((e) => e.tipo === 'simulacro_completo');
    if (tipo === 'practica')   return entradas.filter((e) => e.tipo === 'practica');
    return entradas;
  }, [entradas]);

  return { entradas, metricas, filtrar, recargar };
}
