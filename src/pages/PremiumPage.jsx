/* ============================================================
   DrivePrep+ — PremiumPage
   Página de upgrade. Implementa el flujo completo de compra:
     Paso 1 → Selección de plan (NO activa nada)
     Paso 2 → Modal de confirmación del plan elegido
     Paso 3 → Pantalla de pago (método + datos + resumen)
     Paso 4 → Confirmación final (solo aquí se activa Premium)
   TODO Fase 3: reemplazar el procesamiento de pago demo por
   una pasarela de pago real.
   ============================================================ */

import { useState } from 'react';
import {
  Crown, CheckCircle2, Check, X, Calendar, CreditCard,
  Smartphone, Wallet, ShieldCheck, Lock,
} from 'lucide-react';
import { usePremium, PLANES } from '../context/PremiumContext';
import { useIdioma  } from '../context/IdiomaContext';

const BENEFICIOS_LISTA = [
  'prem_b1','prem_b2','prem_b3','prem_b4','prem_b5','prem_b6',
];

/* ── Métodos de pago disponibles en el paso de pago ── */
const METODOS_PAGO = [
  { id: 'tarjeta', icono: CreditCard, labelKey: 'prem_metodo_tarjeta' },
  { id: 'gpay',    icono: Wallet,     labelKey: 'prem_metodo_gpay'    },
  { id: 'yape',    icono: Smartphone, labelKey: 'prem_metodo_yape'    },
  { id: 'plin',    icono: Smartphone, labelKey: 'prem_metodo_plin'   },
];

/* ── Calcula la fecha de renovación legible para un plan ── */
function fechaRenovacionLegible(plan) {
  const hoy = new Date();
  const renovacion = new Date(hoy);
  renovacion.setMonth(hoy.getMonth() + (plan?.meses || 1));
  return renovacion.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ════════════════════════════════════════════
   PASO 1 → Modal de confirmación de plan
   ════════════════════════════════════════════ */
function ModalPlan({ plan, onContinuar, onCancelar }) {
  const { t } = useIdioma();
  if (!plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
         style={{ background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }}>
      <div className="w-full max-w-md max-h-[calc(100vh-1.5rem)] sm:max-h-[88vh] rounded-2xl flex flex-col overflow-hidden animate-[fadeInUp_0.25s_ease]"
           style={{ background:'var(--color-card)', boxShadow:'var(--shadow-card-hover)' }}>

        {/* Header (siempre visible, incluye la "X" de cierre) */}
        <div className="flex items-center justify-between gap-3 p-5 sm:p-6 border-b shrink-0"
             style={{ borderColor:'var(--color-border)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background:`${plan.color}15` }}>
              <Crown size={20} style={{ color:plan.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest"
                 style={{ fontFamily:'var(--font-display)', color:'var(--color-text-muted)' }}>
                {t('prem_modal_titulo')}
              </p>
              <p className="font-extrabold text-lg leading-tight break-words"
                 style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                {t(plan.labelKey)} — {plan.precio} {plan.periodo}
              </p>
            </div>
          </div>
          <button onClick={onCancelar}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0">
            <X size={16} style={{ color:'var(--color-text-muted)' }} />
          </button>
        </div>

        {/* Body (con scroll interno si el contenido excede el alto disponible) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">

          {/* Precio */}
          <div className="p-4 rounded-xl text-center"
               style={{ background:`${plan.color}08`, border:`1.5px solid ${plan.color}20` }}>
            <p className="text-3xl font-black" style={{ fontFamily:'var(--font-display)', color:plan.color }}>
              {plan.precio}
            </p>
            <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
              {plan.periodo}
            </p>
          </div>

          {/* Beneficios */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider"
               style={{ fontFamily:'var(--font-display)', color:'var(--color-text-muted)' }}>
              {t('prem_beneficios')}
            </p>
            {BENEFICIOS_LISTA.map((k) => (
              <div key={k} className="flex items-center gap-2">
                <CheckCircle2 size={15} style={{ color:'#10b981' }} className="shrink-0" />
                <span className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-primary)' }}>
                  {t(k)}
                </span>
              </div>
            ))}
          </div>

          {/* Renovación */}
          <div className="flex items-center gap-2 p-3 rounded-lg"
               style={{ background:'#f0fdf4', border:'1px solid #bbf7d0' }}>
            <Calendar size={14} style={{ color:'#16a34a' }} className="shrink-0" />
            <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'#15803d' }}>
              {t('prem_proxima_renov')} <strong>{fechaRenovacionLegible(plan)}</strong>
            </p>
          </div>
        </div>

        {/* Footer (siempre visible, contiene las acciones) */}
        <div className="flex gap-3 p-5 sm:p-6 border-t shrink-0"
             style={{ borderColor:'var(--color-border)' }}>
          <button onClick={onCancelar}
            className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors hover:bg-gray-50"
            style={{ borderColor:'var(--color-border)', color:'var(--color-text-secondary)', fontFamily:'var(--font-display)' }}>
            {t('prem_cancelar')}
          </button>
          <button onClick={onContinuar}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-95"
            style={{ background:`linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`, fontFamily:'var(--font-display)' }}>
            {t('prem_continuar')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   PASO 2 → Pantalla de pago
   ════════════════════════════════════════════ */
function PantallaPago({ plan, onCancelar, onConfirmar }) {
  const { t } = useIdioma();
  const [metodo, setMetodo]   = useState('tarjeta');
  const [datos,  setDatos]    = useState({ titular:'', numero:'', vencimiento:'', cvv:'' });

  if (!plan) return null;

  const requiereTarjeta = metodo === 'tarjeta';
  const tarjetaCompleta = datos.titular.trim() && datos.numero.trim() && datos.vencimiento.trim() && datos.cvv.trim();
  const puedeConfirmar  = requiereTarjeta ? tarjetaCompleta : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
         style={{ background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }}>
      <div className="w-full max-w-lg max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh] rounded-2xl flex flex-col overflow-hidden animate-[fadeInUp_0.25s_ease]"
           style={{ background:'var(--color-card)', boxShadow:'var(--shadow-card-hover)' }}>

        {/* Header (siempre visible, incluye la "X" de cierre) */}
        <div className="flex items-center justify-between gap-3 p-5 sm:p-6 border-b shrink-0"
             style={{ borderColor:'var(--color-border)' }}>
          <div className="min-w-0">
            <p className="font-extrabold text-lg" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
              {t('prem_completa_pago')}
            </p>
            <p className="text-sm break-words" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
              {t(plan.labelKey)} — {plan.precio} {plan.periodo}
            </p>
          </div>
          <button onClick={onCancelar} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0">
            <X size={16} style={{ color:'var(--color-text-muted)' }} />
          </button>
        </div>

        {/* Body (con scroll interno si el contenido excede el alto disponible) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">

          {/* Métodos de pago */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide"
               style={{ fontFamily:'var(--font-display)', color:'var(--color-text-muted)' }}>
              {t('prem_metodo_pago')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {METODOS_PAGO.map(({ id, icono: Ico, labelKey }) => (
                <button key={id} onClick={() => setMetodo(id)}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: metodo === id ? plan.color : 'var(--color-border)',
                    background:  metodo === id ? `${plan.color}0d` : 'transparent',
                  }}>
                  <Ico size={18} style={{ color: metodo === id ? plan.color : 'var(--color-text-muted)' }} />
                  <span className="text-xs font-semibold"
                        style={{ fontFamily:'var(--font-display)', color: metodo === id ? plan.color : 'var(--color-text-secondary)' }}>
                    {t(labelKey)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Formulario de tarjeta */}
          {requiereTarjeta ? (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wide"
                 style={{ fontFamily:'var(--font-display)', color:'var(--color-text-muted)' }}>
                {t('prem_pago_tarjeta')}
              </p>
              <div>
                <label className="form-label">{t('prem_titular')}</label>
                <input className="form-input" placeholder={t('prem_titular_ph')}
                       value={datos.titular} onChange={(e) => setDatos({ ...datos, titular:e.target.value })} />
              </div>
              <div>
                <label className="form-label">{t('prem_num_tarjeta')}</label>
                <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19}
                       value={datos.numero} onChange={(e) => setDatos({ ...datos, numero:e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">{t('prem_vencimiento')}</label>
                  <input className="form-input" placeholder="MM/AA" maxLength={5}
                         value={datos.vencimiento} onChange={(e) => setDatos({ ...datos, vencimiento:e.target.value })} />
                </div>
                <div>
                  <label className="form-label">{t('prem_cvv')}</label>
                  <input className="form-input" placeholder="123" maxLength={4} type="password"
                         value={datos.cvv} onChange={(e) => setDatos({ ...datos, cvv:e.target.value })} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-lg"
                 style={{ background:'#f0f9ff', border:'1px solid #bae6fd' }}>
              <ShieldCheck size={15} style={{ color:'#0369a1' }} className="shrink-0" />
              <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'#0369a1' }}>
                {t('prem_metodo_gpay_otro')}
              </p>
            </div>
          )}

          {/* Resumen de compra */}
          <div className="p-4 rounded-xl space-y-2"
               style={{ background:'#f8fafc', border:'1px solid var(--color-border)' }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-1"
               style={{ fontFamily:'var(--font-display)', color:'var(--color-text-muted)' }}>
              {t('prem_resumen_compra')}
            </p>
            <div className="flex items-center justify-between text-sm"
                 style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
              <span>{t(plan.labelKey)} ({plan.periodo})</span>
              <span>{plan.precio}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold pt-2 border-t"
                 style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)', borderColor:'var(--color-border)' }}>
              <span>{t('prem_total_pagar')}</span>
              <span style={{ color: plan.color }}>{plan.precio}</span>
            </div>
          </div>
        </div>

        {/* Footer (siempre visible, contiene el botón Confirmar suscripción) */}
        <div className="p-5 sm:p-6 border-t shrink-0 space-y-3"
             style={{ borderColor:'var(--color-border)' }}>
          <button onClick={onConfirmar} disabled={!puedeConfirmar}
            className="w-full py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background:`linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`, fontFamily:'var(--font-display)' }}>
            <Lock size={14} />
            {t('prem_confirmar_susc')}
          </button>

          <p className="text-xs text-center" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
            {t('prem_redirigiendo')}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   PASO 3 → Confirmación final / éxito
   ════════════════════════════════════════════ */
function PantallaExito({ plan, onComenzar }) {
  const { t } = useIdioma();
  if (!plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
         style={{ background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }}>
      <div className="w-full max-w-sm max-h-[calc(100vh-1.5rem)] rounded-2xl flex flex-col overflow-hidden animate-[fadeInUp_0.25s_ease]"
           style={{ background:'var(--color-card)', boxShadow:'var(--shadow-card-hover)' }}>

        <div className="flex-1 overflow-y-auto p-7 space-y-5 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
               style={{ background:'#dcfce7' }}>
            <Check size={32} style={{ color:'#16a34a' }} />
          </div>

          <div className="space-y-1">
            <p className="font-extrabold text-lg" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
              {t('prem_bienvenido')}
            </p>
            <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
              {t('prem_susc_activada')}
            </p>
          </div>

          <div className="p-4 rounded-xl text-left space-y-1"
               style={{ background:'#f0fdf4', border:'1px solid #bbf7d0' }}>
            <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'#15803d' }}>
              {t('prem_tu_plan')} <strong>{t(plan.labelKey)}</strong>
            </p>
            <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'#15803d' }}>
              {t('prem_vigente_hasta')} <strong>{fechaRenovacionLegible(plan)}</strong>
            </p>
          </div>

          <div className="text-left space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide"
               style={{ fontFamily:'var(--font-display)', color:'var(--color-text-muted)' }}>
              {t('prem_beneficios_act')}
            </p>
            {BENEFICIOS_LISTA.map((k) => (
              <div key={k} className="flex items-center gap-2">
                <CheckCircle2 size={14} style={{ color:'#10b981' }} className="shrink-0" />
                <span className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-primary)' }}>
                  {t(k)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-7 pt-0 space-y-3 shrink-0 text-center">
          <button onClick={onComenzar}
            className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-95"
            style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', fontFamily:'var(--font-display)' }}>
            {t('prem_comenzar')}
          </button>

          <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
            {t('prem_demo')}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════ */
export default function PremiumPage() {
  const { t }  = useIdioma();
  const {
    esPremium, stats,
    modalPlan, abrirModalPlan, cerrarModalPlan,
    planEnProceso, pantallaPago, continuarAPago, cancelarPago,
    confirmarSuscripcion, pantallaExito, cerrarExito,
  } = usePremium();

  if (esPremium) {
    return (
      <div className="page-enter flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
             style={{ background:'linear-gradient(135deg,#f59e0b,#d97706)' }}>
          <Crown size={36} className="text-white" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
            ¡Ya eres Premium! ✨
          </h2>
          <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
            Tienes acceso ilimitado a todos los simulacros y prácticas.
          </p>
        </div>
        <span className="badge badge-warning text-xs px-4 py-2">Plan Premium activo</span>
      </div>
    );
  }

  return (
    <div className="page-enter space-y-8 max-w-4xl mx-auto">

      {/* ── Encabezado ── */}
      <div className="text-center space-y-3 py-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
             style={{ background:'linear-gradient(135deg,#f59e0b,#d97706)' }}>
          <Crown size={26} className="text-white" />
        </div>
        <h1 className="text-3xl font-black" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
          {t('prem_titulo')}
        </h1>
        <p className="text-base" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
          {t('prem_subtitulo')}
        </p>
      </div>

      {/* ── Contadores de uso del plan gratuito ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: t('prem_limite_sim'),  usado: stats.simulacrosUsados, limite: stats.limiteSimulacros,  color: '#6366f1' },
          { label: t('prem_limite_prac'), usado: stats.practicasUsadas,  limite: stats.limitePracticas,   color: '#10b981' },
        ].map(({ label, usado, limite, color }) => {
          const pct = Math.min(100, Math.round((usado / limite) * 100));
          const agotado = usado >= limite;
          return (
            <div key={label} className="card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                  {label}
                </p>
                <span className="text-sm font-extrabold" style={{ fontFamily:'var(--font-display)', color: agotado ? '#ef4444' : color }}>
                  {usado} / {limite}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar__fill"
                     style={{ width:`${pct}%`, background: agotado ? '#ef4444' : color }} />
              </div>
              {agotado && (
                <p className="text-xs font-semibold" style={{ fontFamily:'var(--font-body)', color:'#ef4444' }}>
                  Límite alcanzado. Renueva el lunes o actualiza a Premium.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Planes ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {PLANES.map((plan) => (
          <div key={plan.id}
            className={`card p-6 space-y-5 relative transition-all hover:scale-[1.02] ${plan.popular ? 'ring-2' : ''}`}
            style={{ ...(plan.popular ? { ringColor: plan.color, boxShadow:`0 0 0 2px ${plan.color}` } : {}) }}>

            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold"
                   style={{ background: plan.color, fontFamily:'var(--font-display)' }}>
                {t('prem_popular')}
              </div>
            )}

            <div className="space-y-1">
              <p className="font-extrabold text-lg" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                {t(plan.labelKey)}
              </p>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-black" style={{ fontFamily:'var(--font-display)', color: plan.color }}>
                  {plan.precio}
                </span>
                <span className="text-sm pb-1" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                  {plan.periodo}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {BENEFICIOS_LISTA.map((k) => (
                <div key={k} className="flex items-center gap-2">
                  <CheckCircle2 size={14} style={{ color:'#10b981' }} className="shrink-0" />
                  <span className="text-xs" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
                    {t(k)}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => abrirModalPlan(plan)}
              className="w-full py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-95"
              style={{ background:`linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`, fontFamily:'var(--font-display)' }}>
              {t('prem_elegir')}
            </button>
          </div>
        ))}
      </div>

      {/* ── Flujo de compra (pasos 1 a 4) ── */}
      {modalPlan && (
        <ModalPlan plan={modalPlan} onCancelar={cerrarModalPlan} onContinuar={continuarAPago} />
      )}
      {pantallaPago && (
        <PantallaPago plan={planEnProceso} onCancelar={cancelarPago} onConfirmar={confirmarSuscripcion} />
      )}
      {pantallaExito && (
        <PantallaExito plan={planEnProceso} onComenzar={cerrarExito} />
      )}
    </div>
  );
}
