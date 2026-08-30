/* ============================================================
   DrivePrep+ — Topbar
   Con traducciones dinámicas y datos reales del usuario.
   ============================================================ */

import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, ChevronDown, User, Settings, LogOut, Crown, Sun, Moon, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth }    from '../../context/AuthContext';
import { useIdioma }  from '../../context/IdiomaContext';
import { useTema }    from '../../context/TemaContext';

export default function Topbar({ onToggleSidebar }) {
  const { usuario, cerrarSesion, esPremium } = useAuth();
  const { t } = useIdioma();
  const { tema, cambiarTema } = useTema();
  const navigate = useNavigate();

  const [menuAbierto,   setMenuAbierto]   = useState(false);
  const [notifsAbierto, setNotifsAbierto] = useState(false);
  const menuRef   = useRef(null);
  const notifsRef = useRef(null);

  const inicialNombre = usuario?.nombre?.charAt(0)?.toUpperCase() || 'U';
  const esOscuro = document.documentElement.classList.contains('dark') || tema === 'oscuro';

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (menuRef.current   && !menuRef.current.contains(e.target))   setMenuAbierto(false);
      if (notifsRef.current && !notifsRef.current.contains(e.target)) setNotifsAbierto(false);
    };
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, []);

  const handleCerrarSesion = () => { cerrarSesion(); navigate('/login'); };

  const toggleTema = () => {
    cambiarTema(esOscuro ? 'claro' : 'oscuro');
  };

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-5 lg:px-7"
      style={{
        height: 'var(--topbar-height)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {/* Izquierda: Hamburguesa + Badge de Licencia */}
      <div className="flex items-center gap-3">
        <button className="lg:hidden p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          style={{ color:'var(--color-text-secondary)' }}
          onClick={onToggleSidebar}>
          <Menu size={22} />
        </button>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
             style={{ borderColor:'var(--color-border)', background:'var(--color-card)', color:'var(--color-text-secondary)', fontFamily:'var(--font-display)' }}>
          <ShieldCheck size={14} className="text-sky-500" />
          <span>MTC Perú · Licencia Clase A-I</span>
        </div>
      </div>

      {/* Derecha */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Alternador de Tema Claro / Oscuro */}
        <button
          onClick={toggleTema}
          title={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="p-2 rounded-xl border transition-all duration-200 hover:scale-105"
          style={{
            borderColor: 'var(--color-border)',
            background: 'var(--color-card)',
            color: esOscuro ? '#fbbf24' : '#0284c7',
          }}
        >
          {esOscuro ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Badge Premium */}
        {esPremium && (
          <button onClick={() => navigate('/premium')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:opacity-90 shadow-sm"
            style={{ background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#fff', fontFamily:'var(--font-display)' }}>
            <Crown size={11} />Premium
          </button>
        )}

        {/* Notificaciones */}
        <div ref={notifsRef} className="relative">
          <button
            onClick={() => setNotifsAbierto((v) => !v)}
            className="relative p-2 rounded-xl border transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)', color:'var(--color-text-secondary)' }}>
            <Bell size={18} />
          </button>
          {notifsAbierto && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl shadow-xl border overflow-hidden z-50"
                 style={{ background:'var(--color-card)', borderColor:'var(--color-border)' }}>
              <div className="p-4 border-b flex justify-between items-center" style={{ borderColor:'var(--color-border)' }}>
                <p className="font-bold text-sm" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                  Avisos de Estudio MTC
                </p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold">Oficial</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-sky-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">Revisión de Señales Preventivas</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Recuerda que las señales amarillas en forma de rombo son advertencias de peligro en la vía.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">Simulacro Oficial MTC</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Aprobarás con al menos 35 correctas de 40 preguntas en 40 minutos.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menú usuario */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuAbierto((v) => !v)}
            className="flex items-center gap-2 p-1 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 border"
            style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm"
                 style={{ background:'linear-gradient(135deg,#0284c7,#0369a1)', fontFamily:'var(--font-display)' }}>
              {inicialNombre}
            </div>
            <div className="hidden sm:block text-left pr-1">
              <p className="text-xs font-bold leading-tight truncate max-w-[120px]"
                 style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                {usuario?.nombre || 'Usuario'}
              </p>
              <p className="text-[10px] leading-tight"
                 style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                {esPremium ? '✨ Premium' : 'Gratuito'}
              </p>
            </div>
            <ChevronDown size={14} className={`hidden sm:block transition-transform pr-1 ${menuAbierto ? 'rotate-180' : ''}`}
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
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                  style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                  <Ico size={15} style={{ color:'var(--color-text-muted)' }} />
                  {label}
                </button>
              ))}
              <div className="border-t" style={{ borderColor:'var(--color-border)' }} />
              <button onClick={handleCerrarSesion}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left hover:bg-red-50 dark:hover:bg-red-950/30"
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
