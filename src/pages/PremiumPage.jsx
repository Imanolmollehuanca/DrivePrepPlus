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

        {/* Header */}
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

        {/* Body */}
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

        {/* Footer */}
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
  const [metodo, setMetodo] = useState('tarjeta');
  const [datos,  setDatos]  = useState({ titular:'', numero:'', vencimiento:'', cvv:'' });

  if (!plan) return null;

  const requiereTarjeta = metodo === 'tarjeta';
  const tarjetaCompleta = datos.titular.trim() && datos.numero.trim() && datos.vencimiento.trim() && datos.cvv.trim();
  const puedeConfirmar  = requiereTarjeta ? tarjetaCompleta : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }}>
      <div className="w-full max-w-lg rounded-2xl flex flex-col overflow-hidden animate-[fadeInUp_0.25s_ease]"
           style={{
             background:'var(--color-card)',
             boxShadow:'var(--shadow-card-hover)',
             maxHeight:'calc(100vh - 2rem)',
           }}>

        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-5 border-b shrink-0"
             style={{ borderColor:'var(--color-border)' }}>
          <div className="min-w-0">
            <p className="font-extrabold text-lg" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
              {t('prem_completa_pago')}
            </p>
            <p className="text-sm break-words" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
              {t(plan.labelKey)} — {plan.precio} {plan.periodo}
            </p>
          </div>
          <button onClick={onCancelar}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0">
            <X size={16} style={{ color:'var(--color-text-muted)' }} />
          </button>
        </div>

        {/* Body con scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

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

          {/* ── Tarjeta ── */}
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

          ) : metodo === 'gpay' ? (
            /* ── Google Pay ── */
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-lg"
                   style={{ background:'#f0fdf4', border:'1px solid #bbf7d0' }}>
                <ShieldCheck size={14} style={{ color:'#16a34a' }} className="shrink-0" />
                <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'#166534' }}>
                  Pago seguro mediante Google Pay.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-full rounded-2xl flex items-center justify-center gap-3 py-4 px-6"
                     style={{
                       background: '#000',
                       border: '1px solid #333',
                       boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                     }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span style={{ fontFamily:'sans-serif', fontWeight:500, fontSize:'18px', color:'#fff', letterSpacing:'-0.3px' }}>
                    Pay
                  </span>
                </div>
                <p className="text-xs text-center"
                   style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                  Al confirmar se simulará el pago con Google Pay.<br/>
                  <span style={{ color:'#6366f1' }}>Integración real disponible en Fase 3.</span>
                </p>
              </div>
            </div>

          ) : (metodo === 'yape' || metodo === 'plin') ? (
            /* ── Yape / Plin — QR real ── */
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-lg"
                   style={{ background:'#fdf4ff', border:'1px solid #e9d5ff' }}>
                <ShieldCheck size={14} style={{ color:'#7c3aed' }} className="shrink-0" />
                <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'#6d28d9' }}>
                  Escanea el código QR con tu app {metodo === 'yape' ? 'Yape' : 'Plin'} para completar el pago.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-2xl border-2"
                     style={{
                       background: '#fff',
                       borderColor: metodo === 'yape' ? '#7c3aed' : '#0ea5e9',
                       boxShadow: `0 4px 24px ${metodo === 'yape' ? 'rgba(124,58,237,0.15)' : 'rgba(14,165,233,0.15)'}`,
                     }}>
                  <img
                    src={metodo === 'yape' ? '/src/assets/images/qr-yape.png' : '/src/assets/images/qr-plin.png'}
                    alt={`Código QR ${metodo === 'yape' ? 'Yape' : 'Plin'}`}
                    width={160}
                    height={160}
                    style={{ display:'block', borderRadius:'8px' }}
                  />
                </div>
                <div className="text-center space-y-0.5">
                  <p className="text-lg font-extrabold"
                     style={{ fontFamily:'var(--font-display)', color: metodo === 'yape' ? '#7c3aed' : '#0ea5e9' }}>
                    {plan.precio}
                  </p>
                  <p className="text-xs font-semibold"
                     style={{ fontFamily:'var(--font-display)', color:'var(--color-text-secondary)' }}>
                    DrivePrep+ · {metodo === 'yape' ? 'Yape' : 'Plin'}
                  </p>
                  <p className="text-[11px]"
                     style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                    QR demo académico · integración real en Fase 3
                  </p>
                </div>
              </div>
            </div>

          ) : null}

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

        {/* Footer */}
        <div className="p-4 border-t shrink-0 space-y-3"
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

      {/* Encabezado */}
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

      {/* Contadores de uso */}
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

      {/* Planes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {PLANES.map((plan) => (
          <div key={plan.id}
            className={`card p-6 space-y-5 relative transition-all hover:scale-[1.02] ${plan.popular ? 'ring-2' : ''}`}
            style={{ ...(plan.popular ? { boxShadow:`0 0 0 2px ${plan.color}` } : {}) }}>

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

      {/* Flujo de compra */}
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