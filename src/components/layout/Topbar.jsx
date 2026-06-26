/* ============================================================
   DrivePrep+ — Topbar
   Con traducciones dinámicas y datos reales del usuario.
   ============================================================ */

import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, ChevronDown, User, Settings, LogOut, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth    } from '../../context/AuthContext';
import { useIdioma  } from '../../context/IdiomaContext';

export default function Topbar({ onToggleSidebar }) {
  const { usuario, cerrarSesion, esPremium } = useAuth();
  const { t } = useIdioma();
  const navigate = useNavigate();

  const [menuAbierto,   setMenuAbierto]   = useState(false);
  const [notifsAbierto, setNotifsAbierto] = useState(false);
  const menuRef   = useRef(null);
  const notifsRef = useRef(null);

  const inicialNombre = usuario?.nombre?.charAt(0)?.toUpperCase() || 'U';

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (menuRef.current   && !menuRef.current.contains(e.target))   setMenuAbierto(false);
      if (notifsRef.current && !notifsRef.current.contains(e.target)) setNotifsAbierto(false);
    };
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, []);

  const handleCerrarSesion = () => { cerrarSesion(); navigate('/login'); };

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-5 lg:px-7"
      style={{
        height: 'var(--topbar-height)',
        background: 'rgba(var(--color-bg-rgb, 248,250,252), 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {/* Hamburguesa mobile */}
      <button className="lg:hidden p-2 rounded-lg transition-colors"
        style={{ color:'var(--color-text-secondary)' }}
        onClick={onToggleSidebar}>
        <Menu size={22} />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Derecha */}
      <div className="flex items-center gap-3">

        {/* Badge Premium */}
        {esPremium && (
          <button onClick={() => navigate('/premium')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:opacity-90"
            style={{ background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#fff', fontFamily:'var(--font-display)' }}>
            <Crown size={11} />Premium
          </button>
        )}

        {/* Notificaciones */}
        <div ref={notifsRef} className="relative">
          <button
            onClick={() => setNotifsAbierto((v) => !v)}
            className="relative p-2 rounded-lg transition-colors hover:bg-gray-100"
            style={{ color:'var(--color-text-secondary)' }}>
            <Bell size={20} />
          </button>
          {notifsAbierto && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-xl border overflow-hidden z-50"
                 style={{ background:'var(--color-card)', borderColor:'var(--color-border)' }}>
              <div className="p-4 border-b" style={{ borderColor:'var(--color-border)' }}>
                <p className="font-bold text-sm" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                  Notificaciones
                </p>
              </div>
              <div className="p-4">
                <p className="text-sm text-center" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                  {t('top_sin_notifs')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Menú usuario */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuAbierto((v) => !v)}
            className="flex items-center gap-2 p-1.5 rounded-xl transition-colors hover:bg-gray-100">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
                 style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', fontFamily:'var(--font-display)' }}>
              {inicialNombre}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold leading-tight"
                 style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                {usuario?.nombre || 'Usuario'}
              </p>
              <p className="text-xs leading-tight"
                 style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                {esPremium ? '✨ Premium' : 'Plan gratuito'}
              </p>
            </div>
            <ChevronDown size={14} className={`hidden sm:block transition-transform ${menuAbierto ? 'rotate-180' : ''}`}
                         style={{ color:'var(--color-text-muted)' }} />
          </button>

          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl border overflow-hidden z-50"
                 style={{ background:'var(--color-card)', borderColor:'var(--color-border)' }}>
              {[
                { label: t('top_mi_perfil'),    icono:User,     ruta:'/perfil'  },
                { label: t('top_ajustes'),       icono:Settings, ruta:'/ajustes' },
                { label: t('nav_premium'),       icono:Crown,    ruta:'/premium' },
              ].map(({ label, icono:Ico, ruta }) => (
                <button key={ruta}
                  onClick={() => { setMenuAbierto(false); navigate(ruta); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left hover:bg-gray-50"
                  style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                  <Ico size={15} style={{ color:'var(--color-text-muted)' }} />
                  {label}
                </button>
              ))}
              <div className="border-t" style={{ borderColor:'var(--color-border)' }} />
              <button onClick={handleCerrarSesion}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left hover:bg-red-50"
                style={{ fontFamily:'var(--font-display)', color:'#ef4444' }}>
                <LogOut size={15} />
                {t('top_cerrar_sesion')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
