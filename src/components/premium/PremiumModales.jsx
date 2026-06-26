/* ============================================================
   DrivePrep+ — PremiumModales
   Todos los modales del sistema Premium en un solo componente
   montado en AppLayout para estar disponibles globalmente.
   ============================================================ */

import { Crown, X, Check, AlertTriangle, Clock, Star } from 'lucide-react';
import { usePremium, PLANES } from '../../context/PremiumContext';
import { useIdioma }          from '../../context/IdiomaContext';

/* ── Overlay base ── */
function Overlay({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

/* ── Modal: Límite alcanzado ── */
function ModalLimite() {
  const { t } = useIdioma();
  const { modalLimite, setModalLimite, setModalPlanes, proximoLunes } = usePremium();
  if (!modalLimite) return null;

  const esSimulacro = modalLimite === 'simulacro';

  return (
    <Overlay onClose={() => setModalLimite(null)}>
      <div
        className="w-full max-w-md rounded-2xl p-8 space-y-6"
        style={{ background: 'var(--color-card)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        {/* Ícono */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
               style={{ background: '#fef3c7' }}>
            <AlertTriangle size={32} style={{ color: '#f59e0b' }} />
          </div>
        </div>

        {/* Texto */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-extrabold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            {esSimulacro ? t('limite_sim_titulo') : t('limite_prac_titulo')}
          </h2>
          <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
            {esSimulacro ? t('limite_sim_msg') : t('limite_prac_msg')}
          </p>
        </div>

        {/* Renovación */}
        <div className="flex items-center gap-3 p-3 rounded-xl"
             style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
          <Clock size={16} style={{ color: '#0369a1' }} />
          <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: '#0369a1' }}>
            {t('limite_esperar')}: <strong>{proximoLunes}</strong>
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => { setModalLimite(null); setModalPlanes(true); }}
            className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', fontFamily: 'var(--font-display)' }}
          >
            <Crown size={16} />
            {t('limite_ir_premium')}
          </button>
          <button
            onClick={() => setModalLimite(null)}
            className="w-full py-2.5 rounded-xl font-semibold text-sm"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)' }}
          >
            {t('limite_cerrar')}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ── Modal: Planes Premium ── */
function ModalPlanes() {
  const { t } = useIdioma();
  const { modalPlanes, setModalPlanes, elegirPlan, esPremium } = usePremium();
  if (!modalPlanes) return null;

  return (
    <Overlay onClose={() => setModalPlanes(false)}>
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ background: 'var(--color-card)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        {/* Header */}
        <div className="p-6 flex items-start justify-between"
             style={{ background: 'linear-gradient(135deg,#1e1b4b,#4338ca)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3">
            <Crown size={24} className="text-yellow-400" />
            <div>
              <h2 className="text-xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                {t('prem_titulo')}
              </h2>
              <p className="text-indigo-300 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                {t('prem_subtitulo')}
              </p>
            </div>
          </div>
          <button onClick={() => setModalPlanes(false)}
                  className="p-2 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Planes */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANES.map((plan) => (
            <div key={plan.id}
                 className="relative rounded-2xl p-5 flex flex-col gap-4 border-2 transition-all"
                 style={{
                   borderColor: plan.popular ? '#6366f1' : 'var(--color-border)',
                   background:  plan.popular ? '#eef2ff' : 'var(--color-bg)',
                 }}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
                        style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', fontFamily: 'var(--font-display)' }}>
                    <Star size={10} /> {t('prem_popular')}
                  </span>
                </div>
              )}

              <div>
                <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)' }}>
                  {t(plan.labelKey)}
                </p>
                <p className="text-2xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                  {plan.precio}
                  <span className="text-sm font-normal ml-1" style={{ color: 'var(--color-text-muted)' }}>{plan.periodo}</span>
                </p>
              </div>

              <ul className="space-y-2 flex-1">
                {plan.beneficios.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs"
                      style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
                    <Check size={13} className="shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                    {t(b)}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => elegirPlan(plan)}
                className="w-full py-2.5 rounded-xl font-bold text-sm transition-all"
                style={{
                  fontFamily:  'var(--font-display)',
                  background:  plan.popular ? 'linear-gradient(90deg,#6366f1,#8b5cf6)' : 'transparent',
                  color:       plan.popular ? '#fff' : '#6366f1',
                  border:      plan.popular ? 'none' : '1.5px solid #6366f1',
                }}
              >
                {t('prem_elegir')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Overlay>
  );
}

/* ── Modal: Confirmar plan elegido ── */
function ModalConfirmacionPlan() {
  const { t }          = useIdioma();
  const { planElegido, setPlanElegido, confirmarPago, proximoLunes } = usePremium();
  if (!planElegido) return null;

  /* Calcular fecha de renovación aproximada */
  const hoy = new Date();
  const renovacion = new Date(hoy);
  if (planElegido.id === 'mensual')     renovacion.setMonth(hoy.getMonth() + 1);
  if (planElegido.id === 'trimestral')  renovacion.setMonth(hoy.getMonth() + 3);
  if (planElegido.id === 'anual')       renovacion.setFullYear(hoy.getFullYear() + 1);
  const fechaRenovacion = renovacion.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Overlay onClose={() => setPlanElegido(null)}>
      <div
        className="w-full max-w-md rounded-2xl p-8 space-y-6"
        style={{ background: 'var(--color-card)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        {/* Ícono */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <Crown size={28} className="text-yellow-300" />
          </div>
        </div>

        {/* Info del plan */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-extrabold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            {t(planElegido.labelKey)} — {planElegido.precio}
          </h2>
          <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
            {planElegido.periodo}
          </p>
        </div>

        {/* Beneficios */}
        <ul className="space-y-2">
          {planElegido.beneficios.map((b) => (
            <li key={b} className="flex items-center gap-3 text-sm"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
              <Check size={15} style={{ color: '#10b981' }} className="shrink-0" />
              {t(b)}
            </li>
          ))}
        </ul>

        {/* Renovación */}
        <div className="p-3 rounded-xl text-sm"
             style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontFamily: 'var(--font-body)' }}>
          <strong>{t('prem_renovacion')}</strong> {fechaRenovacion}
        </div>

        {/* Acciones */}
        <div className="flex gap-3">
          <button
            onClick={() => setPlanElegido(null)}
            className="flex-1 py-3 rounded-xl font-semibold text-sm"
            style={{ fontFamily: 'var(--font-display)', border: '1.5px solid var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            {t('prem_cancelar')}
          </button>
          <button
            onClick={confirmarPago}
            className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', fontFamily: 'var(--font-display)' }}
          >
            {t('prem_continuar')}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ── Modal: Demo de pago ── */
function ModalDemo() {
  const { t }                       = useIdioma();
  const { modalDemo, setModalDemo } = usePremium();
  if (!modalDemo) return null;

  return (
    <Overlay onClose={() => setModalDemo(false)}>
      <div
        className="w-full max-w-sm rounded-2xl p-8 space-y-5 text-center"
        style={{ background: 'var(--color-card)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        <div className="text-5xl">🎓</div>
        <p className="text-base font-semibold leading-relaxed"
           style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
          {t('prem_demo')}
        </p>
        <button
          onClick={() => setModalDemo(false)}
          className="w-full py-3 rounded-xl font-bold text-white"
          style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', fontFamily: 'var(--font-display)' }}
        >
          {t('prem_cerrar')}
        </button>
      </div>
    </Overlay>
  );
}

/* ── Exportación principal ── */
export default function PremiumModales() {
  return (
    <>
      <ModalLimite />
      <ModalPlanes />
      <ModalConfirmacionPlan />
      <ModalDemo />
    </>
  );
}
