/* ============================================================
   DrivePrep+ — Sidebar
   Con traducciones, contadores de uso Premium e icono Crown.
   ============================================================ */
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Monitor, BookOpen, History,
  BarChart2, Lightbulb, User, Settings, LogOut,
  Car, Crown, X,
} from 'lucide-react';
import { useAuth    } from '../../context/AuthContext';
import { useIdioma  } from '../../context/IdiomaContext';
import { usePremium } from '../../context/PremiumContext';

export default function Sidebar({ abierto, onCerrar }) {
  const { usuario, cerrarSesion, esPremium } = useAuth();
  const { t }    = useIdioma();
  const { stats } = usePremium();
  const navigate  = useNavigate();

  const NAV_ITEMS = [
    { ruta:'/dashboard',       icono:Home,      label: t('nav_inicio')          },
    { ruta:'/simuladores',     icono:Monitor,   label: t('nav_simuladores')     },
    { ruta:'/practica',        icono:BookOpen,  label: t('nav_practica')        },
    { ruta:'/historial',       icono:History,   label: t('nav_historial')       },
    { ruta:'/estadisticas',    icono:BarChart2, label: t('nav_estadisticas')    },
    { ruta:'/recomendaciones', icono:Lightbulb, label: t('nav_recomendaciones') },
  ];
  const NAV_BOTTOM = [
    { ruta:'/perfil',  icono:User,     label: t('nav_perfil')  },
    { ruta:'/ajustes', icono:Settings, label: t('nav_ajustes') },
  ];

  const inicialNombre = usuario?.nombre?.charAt(0)?.toUpperCase() || 'U';
  const handleCerrarSesion = () => { cerrarSesion(); navigate('/login'); };

  return (
    <>
      {abierto && (
        <div className="sidebar-overlay lg:hidden" onClick={onCerrar} aria-hidden="true" />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${abierto ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:z-30`}
        style={{ width:'var(--sidebar-width)', background:'var(--color-sidebar-bg)', boxShadow:'var(--shadow-sidebar)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Car size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-white font-extrabold text-base leading-tight" style={{ fontFamily:'var(--font-display)' }}>
                DrivePrep<span className="text-indigo-400">+</span>
              </p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily:'var(--font-body)' }}>
                Preparación MTC · Perú
              </p>
            </div>
          </div>
          <button className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={onCerrar}>
            <X size={18} />
          </button>
        </div>

        {/* Nav principal */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV_ITEMS.map(({ ruta, icono:Icono, label }) => (
            <NavLink key={ruta} to={ruta} onClick={onCerrar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                ${isActive ? 'bg-indigo-500/20 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`
              }
              style={{ fontFamily:'var(--font-display)' }}
            >
              {({ isActive }) => (
                <>
                  <Icono size={17} className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bloque Premium / contadores */}
        <div className="px-3 pb-2">
          {esPremium ? (
            <NavLink to="/premium" onClick={onCerrar}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-300 hover:bg-white/5 transition-all"
              style={{ fontFamily:'var(--font-display)' }}>
              <Crown size={17} className="text-amber-400" />
              <span>Plan Premium ✨</span>
            </NavLink>
          ) : (
            <div className="mx-0 mb-2 p-3 rounded-xl space-y-2"
                 style={{ background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.15)' }}>
              {/* Simulacros */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-slate-400" style={{ fontFamily:'var(--font-body)' }}>
                    Simulacros esta semana
                  </p>
                  <p className="text-[10px] font-bold text-slate-300" style={{ fontFamily:'var(--font-display)' }}>
                    {stats.simulacrosUsados}/{stats.limiteSimulacros}
                  </p>
                </div>
                <div className="h-1 rounded-full bg-white/10">
                  <div className="h-1 rounded-full transition-all"
                       style={{ width:`${(stats.simulacrosUsados/stats.limiteSimulacros)*100}%`, background:'#818cf8' }} />
                </div>
              </div>
              {/* Prácticas */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-slate-400" style={{ fontFamily:'var(--font-body)' }}>
                    Prácticas esta semana
                  </p>
                  <p className="text-[10px] font-bold text-slate-300" style={{ fontFamily:'var(--font-display)' }}>
                    {stats.practicasUsadas}/{stats.limitePracticas}
                  </p>
                </div>
                <div className="h-1 rounded-full bg-white/10">
                  <div className="h-1 rounded-full transition-all"
                       style={{ width:`${(stats.practicasUsadas/stats.limitePracticas)*100}%`, background:'#34d399' }} />
                </div>
              </div>
              <NavLink to="/premium" onClick={onCerrar}
                className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-amber-300 text-xs font-bold transition-colors hover:bg-amber-400/10"
                style={{ fontFamily:'var(--font-display)' }}>
                <Crown size={12} />Actualizar a Premium
              </NavLink>
            </div>
          )}
        </div>

        {/* Nav bottom */}
        <div className="px-3 pb-2 border-t border-white/10 pt-3 space-y-0.5">
          {NAV_BOTTOM.map(({ ruta, icono:Icono, label }) => (
            <NavLink key={ruta} to={ruta} onClick={onCerrar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                ${isActive ? 'bg-indigo-500/20 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`
              }
              style={{ fontFamily:'var(--font-display)' }}>
              {({ isActive }) => (
                <>
                  <Icono size={17} className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Usuario */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-sm"
                 style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', fontFamily:'var(--font-display)' }}>
              {inicialNombre}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate" style={{ fontFamily:'var(--font-display)' }}>
                {usuario?.nombre || 'Usuario'}
              </p>
              <p className="text-[10px] text-slate-500 truncate" style={{ fontFamily:'var(--font-body)' }}>
                {usuario?.email || ''}
              </p>
            </div>
            <button onClick={handleCerrarSesion}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
              title={t('nav_cerrar_sesion')}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
