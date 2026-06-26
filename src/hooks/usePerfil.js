/* ============================================================
   DrivePrep+ — usePerfil (hook)
   Calcula el perfil del usuario: preparación, logros, resumen.
   Combina datos del AuthContext + historial persistido.
   TODO Fase 4: reemplazar lecturas locales por:
     GET /api/perfil/:userId
     GET /api/logros/:userId
   ============================================================ */

import { useMemo } from 'react';
import { useAuth }      from '../context/AuthContext';
import { useHistorial } from './useHistorial';
import { leerJSON, guardarJSON } from '../utils/storageUsuario';

/* ── Clave de localStorage del perfil extra del usuario ── */
const KEY_PERFIL_EXTRA = 'driveprep_perfil_extra';

/* ── Leer / guardar perfil extra, aislado por usuario ── */
export function leerPerfilExtra(userId) {
  return leerJSON(KEY_PERFIL_EXTRA, userId, {});
}
export function guardarPerfilExtra(userId, datos) {
  const actual = leerPerfilExtra(userId);
  guardarJSON(KEY_PERFIL_EXTRA, userId, { ...actual, ...datos });
}

/* ── Catálogo de logros del sistema ── */
export const CATALOGO_LOGROS = [
  {
    id:          'primer_simulacro',
    titulo:      'Primer simulacro',
    descripcion: 'Completaste tu primer simulacro completo.',
    emoji:       '🏆',
    color:       '#f59e0b',
    bg:          '#fef3c7',
    /* TODO Fase 4: evaluar en servidor */
    evaluar:     (metricas) => metricas.simulacrosRealizados >= 1,
  },
  {
    id:          'cinco_simulacros',
    titulo:      '5 simulacros realizados',
    descripcion: 'Has completado 5 simulacros tipo MTC.',
    emoji:       '🥈',
    color:       '#64748b',
    bg:          '#f1f5f9',
    evaluar:     (metricas) => metricas.simulacrosRealizados >= 5,
  },
  {
    id:          'diez_simulacros',
    titulo:      '10 simulacros realizados',
    descripcion: 'Has completado 10 simulacros. ¡Eres muy constante!',
    emoji:       '🥇',
    color:       '#f59e0b',
    bg:          '#fef9c3',
    evaluar:     (metricas) => metricas.simulacrosRealizados >= 10,
  },
  {
    id:          'promedio_80',
    titulo:      'Más de 80% de promedio',
    descripcion: 'Tu promedio general supera el 80%. ¡Excelente nivel!',
    emoji:       '⭐',
    color:       '#f59e0b',
    bg:          '#fef3c7',
    evaluar:     (metricas) => metricas.promedioPuntaje >= 80,
  },
  {
    id:          'promedio_90',
    titulo:      'Casi perfecto',
    descripcion: 'Tu promedio supera el 90%. ¡Estás listo para el examen!',
    emoji:       '💎',
    color:       '#6366f1',
    bg:          '#eef2ff',
    evaluar:     (metricas) => metricas.promedioPuntaje >= 90,
  },
  {
    id:          'primer_aprobado',
    titulo:      'Primer aprobado',
    descripcion: 'Aprobaste un simulacro completo con 70% o más.',
    emoji:       '✅',
    color:       '#10b981',
    bg:          '#d1fae5',
    evaluar:     (_, entradas) => entradas.some((e) => e.tipo === 'simulacro_completo' && e.aprobado),
  },
  {
    id:          'racha_aprobados',
    titulo:      'Racha ganadora',
    descripcion: 'Aprobaste 3 simulacros consecutivos.',
    emoji:       '🔥',
    color:       '#ef4444',
    bg:          '#fee2e2',
    evaluar:     (_, entradas) => {
      const sims = entradas.filter((e) => e.tipo === 'simulacro_completo');
      if (sims.length < 3) return false;
      let racha = 0;
      for (const s of sims) { if (s.aprobado) racha++; else racha = 0; if (racha >= 3) return true; }
      return false;
    },
  },
  {
    id:          'explorador_temas',
    titulo:      'Explorador de temas',
    descripcion: 'Practicaste al menos 3 categorías diferentes.',
    emoji:       '🗺️',
    color:       '#0ea5e9',
    bg:          '#f0f9ff',
    evaluar:     (_, entradas) => {
      const cats = new Set(entradas.filter((e) => e.tipo === 'practica' && e.categoriaId).map((e) => e.categoriaId));
      return cats.size >= 3;
    },
  },
  {
    id:          'practica_constante',
    titulo:      'Práctica constante',
    descripcion: 'Realizaste más de 10 sesiones de práctica por temas.',
    emoji:       '📚',
    color:       '#10b981',
    bg:          '#ecfdf5',
    evaluar:     (metricas) => metricas.sesionasPractica >= 10,
  },
];

/* ── Calcular porcentaje de preparación ── */
function calcularPreparacion(metricas, entradas) {
  if (entradas.length === 0) return 0;
  /* Fórmula ponderada:
     40% → promedio de puntaje en simulacros
     30% → constancia (simulacros realizados, max 10 → 100%)
     30% → diversidad (categorías practicadas, max 8 → 100%)
     TODO Fase 4: usar modelo ML del backend
  */
  const factorPromedio   = (metricas.promedioPuntaje || 0) * 0.40;
  const factorConstancia = Math.min(metricas.simulacrosRealizados / 10, 1) * 100 * 0.30;
  const cats = new Set(entradas.filter((e) => e.categoriaId).map((e) => e.categoriaId));
  const factorDiversidad = Math.min(cats.size / 8, 1) * 100 * 0.30;
  return Math.round(factorPromedio + factorConstancia + factorDiversidad);
}

/* ── Formato de tiempo total ── */
function formatTiempoTotal(segundos) {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m} min`;
  return '—';
}

/* ════════════════════════════════════════════ */
export function usePerfil() {
  const { usuario, actualizarUsuario } = useAuth();
  const { entradas, metricas }         = useHistorial();
  const userId                         = usuario?.id || null;
  const perfilExtra                    = leerPerfilExtra(userId);

  /* ── Datos del usuario normalizados ── */
  const datosUsuario = useMemo(() => ({
    nombre:           usuario?.nombre     || 'Usuario',
    email:            usuario?.email      || '—',
    plan:             usuario?.plan       || 'gratuito',
    proveedor:        usuario?.proveedor  || 'email',
    tipoLicencia:     perfilExtra.tipoLicencia    || usuario?.tipoLicencia    || null,
    vehiculoPrincipal:perfilExtra.vehiculoPrincipal|| usuario?.vehiculoPrincipal|| null,
    vehiculoSecundario:perfilExtra.vehiculoSecundario || null,
    fechaRegistro:    usuario?.fechaRegistro || null,
    /* ── Datos de la suscripción Premium ── */
    planActual:                 usuario?.planActual                 || null,
    fechaInicioSuscripcion:     usuario?.fechaInicioSuscripcion     || null,
    fechaRenovacionSuscripcion: usuario?.fechaRenovacionSuscripcion || null,
    estadoSuscripcion:          usuario?.estadoSuscripcion          || null,
  }), [usuario, perfilExtra]);

  /* ── Nivel de preparación ── */
  const nivelPreparacion = useMemo(
    () => calcularPreparacion(metricas, entradas),
    [metricas, entradas]
  );

  /* ── Resumen rápido ── */
  const resumen = useMemo(() => ({
    simulacrosRealizados: metricas.simulacrosRealizados || 0,
    promedioPuntaje:      metricas.promedioPuntaje      || 0,
    mejorPuntaje:         metricas.mejorPuntaje         || 0,
    tiempoTotal:          formatTiempoTotal(metricas.tiempoTotalSegundos || 0),
  }), [metricas]);

  /* ── Logros desbloqueados / bloqueados ── */
  const logros = useMemo(() =>
    CATALOGO_LOGROS.map((logro) => ({
      ...logro,
      desbloqueado: logro.evaluar(metricas, entradas),
    })),
    [metricas, entradas]
  );

  const logrosDesbloqueados = logros.filter((l) => l.desbloqueado);
  const logrosBloqueados    = logros.filter((l) => !l.desbloqueado);

  /* ── Actualizar perfil extra ── */
  const actualizarPerfil = (cambios) => {
    guardarPerfilExtra(userId, cambios);
    actualizarUsuario(cambios);
  };

  return {
    datosUsuario,
    nivelPreparacion,
    resumen,
    logros,
    logrosDesbloqueados,
    logrosBloqueados,
    actualizarPerfil,
  };
}
