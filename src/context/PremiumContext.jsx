/* ============================================================
   DrivePrep+ — PremiumContext
   Gestiona los límites semanales del plan gratuito y
   el flujo completo de upgrade a Premium (selección de plan →
   confirmación → pago → activación), además de la cancelación
   de la suscripción.
   Límites: 5 simulacros / 10 prácticas por semana.
   TODO Fase 3: reemplazar el flujo de pago demo por una
   pasarela de pago real.
   ============================================================ */

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { leerJSON, guardarJSON } from '../utils/storageUsuario';

const PremiumContext = createContext(null);

const KEY = 'driveprep_uso_semanal';
const LIMITE_SIMULACROS = 5;
const LIMITE_PRACTICAS  = 10;

/* ── Catálogo de planes Premium disponibles ── */
export const PLANES = [
  {
    id:         'mensual',
    labelKey:   'prem_mensual',
    precio:     'S/ 19.90',
    periodo:    '/mes',
    popular:    false,
    color:      '#6366f1',
    meses:      1,
    beneficios: ['prem_b1', 'prem_b2', 'prem_b3', 'prem_b4', 'prem_b5', 'prem_b6'],
  },
  {
    id:         'trimestral',
    labelKey:   'prem_trimestral',
    precio:     'S/ 49.90',
    periodo:    '/3 meses',
    popular:    true,
    color:      '#8b5cf6',
    meses:      3,
    beneficios: ['prem_b1', 'prem_b2', 'prem_b3', 'prem_b4', 'prem_b5', 'prem_b6'],
  },
  {
    id:         'anual',
    labelKey:   'prem_anual',
    precio:     'S/ 179.90',
    periodo:    '/año',
    popular:    false,
    color:      '#10b981',
    meses:      12,
    beneficios: ['prem_b1', 'prem_b2', 'prem_b3', 'prem_b4', 'prem_b5', 'prem_b6'],
  },
];

/* ── Obtener el inicio de la semana actual (lunes 00:00) ── */
function inicioSemanaActual() {
  const hoy = new Date();
  const dia  = hoy.getDay(); // 0=Dom, 1=Lun...
  const diff = (dia === 0 ? -6 : 1 - dia);
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + diff);
  lunes.setHours(0, 0, 0, 0);
  return lunes.getTime();
}

/* ── Leer / resetear contadores si cambió la semana ── */
function leerContadores(userId) {
  const data = leerJSON(KEY, userId, null);
  const semanaActual = inicioSemanaActual();

  if (!data || data.semana !== semanaActual) {
    // Nueva semana, o usuario sin contadores aún → resetear/inicializar
    const fresh = { semana: semanaActual, simulacros: 0, practicas: 0 };
    guardarJSON(KEY, userId, fresh);
    return fresh;
  }
  return { semana: semanaActual, simulacros: data.simulacros || 0, practicas: data.practicas || 0 };
}

/* ── Fecha del próximo lunes ── */
function proximoLunes() {
  const d = new Date(inicioSemanaActual() + 7 * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString('es-PE', { weekday:'long', day:'numeric', month:'long' });
}

/* ── Calcular la fecha de renovación según el plan elegido ── */
function calcularFechaRenovacion(plan, desde = new Date()) {
  const renovacion = new Date(desde);
  renovacion.setMonth(renovacion.getMonth() + (plan?.meses || 1));
  return renovacion;
}

export function PremiumProvider({ children }) {
  const { usuario, actualizarUsuario } = useAuth();
  const userId = usuario?.id || null;
  const [contadores, setContadores] = useState(() => leerContadores(userId));

  /* Al cambiar de cuenta, cargar los contadores de uso semanal de
     la cuenta nueva (que para una cuenta recién creada serán 0/0,
     tal como pide la consigna), en vez de mantener los de la
     sesión anterior en memoria. */
  useEffect(() => {
    setContadores(leerContadores(userId));
  }, [userId]);

  /* ── Estados del flujo de compra (paso 1 → 4) ── */
  const [modalLimite,   setModalLimite]   = useState(null);   // null | 'simulacro' | 'practica'
  const [modalPlan,     setModalPlan]     = useState(null);   // Paso 1: plan en confirmación
  const [planEnProceso, setPlanEnProceso] = useState(null);   // Plan que avanzó a pago/éxito
  const [pantallaPago,  setPantallaPago]  = useState(false);  // Paso 2: pantalla de pago
  const [pantallaExito, setPantallaExito] = useState(false);  // Paso 3: confirmación final

  /* ── Estado del modal "Cancelar suscripción" (Mi perfil) ── */
  const [modalCancelar, setModalCancelar] = useState(false);

  /* Estado activo real: el plan solo cuenta como Premium si no fue cancelado */
  const esPremium = usuario?.plan === 'premium' && usuario?.estadoSuscripcion !== 'cancelado';

  /* ── Guardar contadores ── */
  const guardar = useCallback((nuevos) => {
    const data = { semana: inicioSemanaActual(), ...nuevos };
    guardarJSON(KEY, userId, data);
    setContadores(data);
  }, [userId]);

  /* ── Verificar si puede iniciar simulacro ── */
  const puedeSimulacro = useCallback(() => {
    if (esPremium) return true;
    return contadores.simulacros < LIMITE_SIMULACROS;
  }, [esPremium, contadores.simulacros]);

  /* ── Verificar si puede iniciar práctica ── */
  const puedePractica = useCallback(() => {
    if (esPremium) return true;
    return contadores.practicas < LIMITE_PRACTICAS;
  }, [esPremium, contadores.practicas]);

  /* ── Registrar uso de simulacro ── */
  const registrarSimulacro = useCallback(() => {
    if (esPremium) return true;
    if (contadores.simulacros >= LIMITE_SIMULACROS) {
      setModalLimite('simulacro');
      return false;
    }
    guardar({ ...contadores, simulacros: contadores.simulacros + 1 });
    return true;
  }, [esPremium, contadores, guardar]);

  /* ── Registrar uso de práctica ── */
  const registrarPractica = useCallback(() => {
    if (esPremium) return true;
    if (contadores.practicas >= LIMITE_PRACTICAS) {
      setModalLimite('practica');
      return false;
    }
    guardar({ ...contadores, practicas: contadores.practicas + 1 });
    return true;
  }, [esPremium, contadores, guardar]);

  /* ════════════════════════════════════════════
     PASO 1 → Selección de plan
     Solo abre el modal de confirmación. NO activa nada.
     ════════════════════════════════════════════ */
  const abrirModalPlan = useCallback((plan) => {
    setModalPlan(plan);
  }, []);

  const cerrarModalPlan = useCallback(() => {
    setModalPlan(null);
  }, []);

  /* ════════════════════════════════════════════
     PASO 2 → Confirmar plan → avanza a pantalla de pago
     (todavía NO se activa la suscripción)
     ════════════════════════════════════════════ */
  const continuarAPago = useCallback(() => {
    setPlanEnProceso(modalPlan);
    setModalPlan(null);
    setPantallaPago(true);
  }, [modalPlan]);

  const cancelarPago = useCallback(() => {
    setPantallaPago(false);
    setPlanEnProceso(null);
  }, []);

  /* ════════════════════════════════════════════
     PASO 3 → Confirmar suscripción
     Aquí, y solo aquí, se activa el plan Premium.
     ════════════════════════════════════════════ */
  const confirmarSuscripcion = useCallback(() => {
    if (!planEnProceso) return;

    const hoy             = new Date();
    const fechaRenovacion = calcularFechaRenovacion(planEnProceso, hoy);

    actualizarUsuario({
      plan:                       'premium',
      planActual:                 planEnProceso.id,
      fechaInicioSuscripcion:     hoy.toISOString(),
      fechaRenovacionSuscripcion: fechaRenovacion.toISOString(),
      estadoSuscripcion:          'activo',
    });

    setPantallaPago(false);
    setPantallaExito(true);
  }, [planEnProceso, actualizarUsuario]);

  /* ── PASO 4 → Cerrar pantalla de éxito ── */
  const cerrarExito = useCallback(() => {
    setPantallaExito(false);
    setPlanEnProceso(null);
  }, []);

  /* ════════════════════════════════════════════
     Cancelación de suscripción (desde "Mi perfil")
     ════════════════════════════════════════════ */
  const abrirModalCancelar  = useCallback(() => setModalCancelar(true), []);
  const cerrarModalCancelar = useCallback(() => setModalCancelar(false), []);

  const cancelarSuscripcion = useCallback(() => {
    actualizarUsuario({ estadoSuscripcion: 'cancelado' });
    setModalCancelar(false);
  }, [actualizarUsuario]);

  const stats = useMemo(() => ({
    simulacrosUsados:    contadores.simulacros,
    simulacrosRestantes: Math.max(0, LIMITE_SIMULACROS - contadores.simulacros),
    practicasUsadas:     contadores.practicas,
    practicasRestantes:  Math.max(0, LIMITE_PRACTICAS  - contadores.practicas),
    limiteSimulacros:    LIMITE_SIMULACROS,
    limitePracticas:     LIMITE_PRACTICAS,
    proximaRenovacion:   proximoLunes(),
  }), [contadores]);

  return (
    <PremiumContext.Provider value={{
      esPremium,
      stats,
      puedeSimulacro, puedePractica,
      registrarSimulacro, registrarPractica,
      modalLimite,  cerrarModalLimite: () => setModalLimite(null),

      /* Flujo de compra */
      modalPlan, abrirModalPlan, cerrarModalPlan,
      planEnProceso,
      pantallaPago, continuarAPago, cancelarPago,
      confirmarSuscripcion,
      pantallaExito, cerrarExito,

      /* Cancelación */
      modalCancelar, abrirModalCancelar, cerrarModalCancelar, cancelarSuscripcion,
    }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error('usePremium debe usarse dentro de <PremiumProvider>');
  return ctx;
}
