/* ============================================================
   DrivePrep+ — ModalLimitePremium
   Modal reutilizable que se muestra cuando el usuario
   gratuito alcanza su límite semanal.
   ============================================================ */

import { Crown, X, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '../../context/PremiumContext';
import { useIdioma  } from '../../context/IdiomaContext';

export default function ModalLimitePremium() {
  const { modalLimite, cerrarModalLimite, stats } = usePremium();
  const { t }    = useIdioma();
  const navigate = useNavigate();

  if (!modalLimite) return null;

  const esSimulacro = modalLimite === 'simulacro';
  const mensaje = esSimulacro ? t('prem_limite_msg_sim') : t('prem_limite_msg_prac');

  const handleVerPlanes = () => {
    cerrarModalLimite();
    navigate('/premium');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 space-y-5"
           style={{ background:'var(--color-card)', boxShadow:'var(--shadow-card-hover)' }}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background:'#fef3c7' }}>
              <Crown size={20} style={{ color:'#f59e0b' }} />
            </div>
            <p className="font-extrabold text-base" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
              {t('prem_limite_titulo')}
            </p>
          </div>
          <button onClick={cerrarModalLimite} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X size={16} style={{ color:'var(--color-text-muted)' }} />
          </button>
        </div>

        {/* Mensaje */}
        <p className="text-sm leading-relaxed" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
          {mensaje}
        </p>

        {/* Renovación */}
        <div className="flex items-center gap-2 p-3 rounded-lg"
             style={{ background:'#f0f9ff', border:'1px solid #bae6fd' }}>
          <Clock size={14} style={{ color:'#0369a1' }} />
          <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'#0369a1' }}>
            Renovación gratuita el: <strong>{stats.proximaRenovacion}</strong>
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-3">
          <button onClick={handleVerPlanes}
            className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90"
            style={{ background:'linear-gradient(135deg,#f59e0b,#d97706)', fontFamily:'var(--font-display)' }}>
            <Crown size={15} className="inline mr-2" />
            {t('prem_ver_planes')}
          </button>
          <button onClick={cerrarModalLimite}
            className="w-full py-2.5 rounded-xl border text-sm font-semibold transition-colors hover:bg-gray-50"
            style={{ borderColor:'var(--color-border)', color:'var(--color-text-secondary)', fontFamily:'var(--font-display)' }}>
            {t('prem_esperar')}
          </button>
        </div>
      </div>
    </div>
  );
}
