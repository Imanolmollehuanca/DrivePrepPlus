/* ============================================================
   DrivePrep+ — Sidebar
   Diseño premium alineado al sistema de diseño en index.css
   ============================================================ */
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Monitor, BookOpen, History,
  BarChart2, Lightbulb, User, Settings, LogOut,
  Car, Crown, X, Sparkles,
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
    { ruta: '/dashboard',       icono: Home,      label: t('nav_inicio')          },
    { ruta: '/simuladores',     icono: Monitor,   label: t('nav_simuladores')     },
    { ruta: '/practica',        icono: BookOpen,  label: t('nav_practica')        },
    { ruta: '/historial',       icono: History,   label: t('nav_historial')       },
    { ruta: '/estadisticas',    icono: BarChart2, label: t('nav_estadisticas')    },
    { ruta: '/recomendaciones', icono: Sparkles,  label: t('nav_recomendaciones') },
  ];

  const NAV_BOTTOM = [
    { ruta: '/perfil',  icono: User,     label: t('nav_perfil')  },
    { ruta: '/ajustes', icono: Settings, label: t('nav_ajustes') },
  ];

  const inicialNombre = usuario?.nombre?.charAt(0)?.toUpperCase() || 'U';
  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay para pantallas móviles */}
      {abierto && (
        <div
          className="sidebar-overlay lg:hidden"
          onClick={onCerrar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar-container fixed top-0 left-0 h-full z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${abierto ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:z-30`}
      >
        {/* Header / Brand */}
        <div className="flex items-center justify-between p-4 lg:p-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="sidebar-brand-icon">
              <Car size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-white font-extrabold text-base tracking-tight leading-tight font-display">
                DrivePrep<span className="text-indigo-400">+</span>
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[11px] text-slate-400 font-body">
                  MTC · Perú
                </p>
              </div>
            </div>
          </div>

          <button
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            onClick={onCerrar}
            aria-label="Cerrar menú lateral"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navegación principal */}
        <div className="flex-1 overflow-y-auto sidebar-scroll py-3 px-3 space-y-4">
          <div>
            <p className="sidebar-section-title">
              Menú Principal
            </p>
            <nav className="space-y-1 mt-1">
              {NAV_ITEMS.map(({ ruta, icono: Icono, label }) => (
                <NavLink
                  key={ruta}
                  to={ruta}
                  onClick={onCerrar}
                  className={({ isActive }) =>
                    `sidebar-nav-item group ${isActive ? 'active' : ''}`
                  }
                >
                  <Icono size={18} className="sidebar-icon" />
                  <span className="truncate flex-1">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Bloque Premium / Límites de Uso */}
          <div className="pt-1">
            {esPremium ? (
              <NavLink
                to="/premium"
                onClick={onCerrar}
                className="sidebar-premium-active-card group"
              >
                <Crown size={18} className="text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold leading-tight">Plan Premium</p>
                  <p className="text-[10px] text-amber-200/80 font-normal truncate">Acceso Ilimitado ✨</p>
                </div>
              </NavLink>
            ) : (
              <div className="sidebar-premium-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200 font-display flex items-center gap-1.5">
                    <Sparkles size={12} className="text-indigo-400" />
                    Uso semanal
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium font-display">
                    Gratis
                  </span>
                </div>

                {/* Simulacros */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-body">Simulacros</span>
                    <span className="font-bold text-slate-300 font-display">
                      {stats.simulacrosUsados} / {stats.limiteSimulacros}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-indigo-400"
                      style={{
                        width: `${Math.min(100, (stats.simulacrosUsados / (stats.limiteSimulacros || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Prácticas */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-body">Prácticas</span>
                    <span className="font-bold text-slate-300 font-display">
                      {stats.practicasUsadas} / {stats.limitePracticas}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{
                        width: `${Math.min(100, (stats.practicasUsadas / (stats.limitePracticas || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Botón Upgrade */}
                <NavLink
                  to="/premium"
                  onClick={onCerrar}
                  className="sidebar-upgrade-btn"
                >
                  <Crown size={13} className="shrink-0" />
                  <span>Subir a Premium</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Navegación secundaria (Perfil, Ajustes) */}
          <div className="pt-2">
            <p className="sidebar-section-title">
              Cuenta y Soporte
            </p>
            <nav className="space-y-1 mt-1">
              {NAV_BOTTOM.map(({ ruta, icono: Icono, label }) => (
                <NavLink
                  key={ruta}
                  to={ruta}
                  onClick={onCerrar}
                  className={({ isActive }) =>
                    `sidebar-nav-item group ${isActive ? 'active' : ''}`
                  }
                >
                  <Icono size={18} className="sidebar-icon" />
                  <span className="truncate flex-1">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer del usuario */}
        <div className="sidebar-user-footer">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="sidebar-avatar">
                {inicialNombre}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate font-display leading-tight">
                {usuario?.nombre || 'Usuario'}
              </p>
              <p className="text-[11px] text-slate-400 truncate font-body">
                {usuario?.email || (esPremium ? 'Plan Premium' : 'Plan Gratuito')}
              </p>
            </div>

            <button
              onClick={handleCerrarSesion}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
              title={t('nav_cerrar_sesion')}
              aria-label={t('nav_cerrar_sesion')}
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

