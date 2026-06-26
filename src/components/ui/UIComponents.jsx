/* ============================================================
   DrivePrep+ — Componentes UI reutilizables
   Todos los componentes visuales están preparados para
   recibir props dinámicas desde la API.
   ============================================================ */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/* ── StatCard: tarjeta de métrica numérica ── */
export function StatCard({ titulo, valor, sufijo = '', icono: Icono, color = '#6366f1', tendencia }) {
  const TendenciaIcono =
    tendencia === 'sube' ? TrendingUp :
    tendencia === 'baja' ? TrendingDown : Minus;

  const colorTendencia =
    tendencia === 'sube' ? '#10b981' :
    tendencia === 'baja' ? '#ef4444' : '#94a3b8';

  return (
    <div className="card card-animated p-5 flex items-start gap-4">
      {/* Ícono */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}15` }}
      >
        {Icono && <Icono size={22} style={{ color }} />}
      </div>

      {/* Datos */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide mb-1"
           style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-muted)' }}>
          {titulo}
        </p>
        <div className="flex items-end gap-2">
          <span className="stat-number">
            {valor !== null && valor !== undefined ? valor : '—'}
          </span>
          {sufijo && (
            <span className="text-sm font-medium pb-0.5"
                  style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-display)' }}>
              {sufijo}
            </span>
          )}
        </div>
        {tendencia && (
          <div className="flex items-center gap-1 mt-1">
            <TendenciaIcono size={12} style={{ color: colorTendencia }} />
            <span className="text-[11px] font-medium"
                  style={{ color: colorTendencia, fontFamily: 'var(--font-body)' }}>
              {tendencia === 'sube' ? 'Mejorando' : tendencia === 'baja' ? 'En descenso' : 'Sin cambio'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── ProgressRing: círculo de progreso SVG ── */
export function ProgressRing({ porcentaje = 0, size = 100, stroke = 8, color = '#6366f1', children }) {
  const radio    = (size - stroke) / 2;
  const circunf  = 2 * Math.PI * radio;
  const dashoffset = circunf * (1 - (porcentaje || 0) / 100);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Pista */}
        <circle
          cx={size / 2} cy={size / 2} r={radio}
          fill="none" stroke="#e2e8f0" strokeWidth={stroke}
        />
        {/* Progreso */}
        <circle
          cx={size / 2} cy={size / 2} r={radio}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circunf}
          strokeDashoffset={dashoffset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      {/* Contenido central */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

/* ── ModuleCard: tarjeta de acceso a módulo ── */
export function ModuleCard({ titulo, descripcion, icono: Icono, color = '#6366f1', onClick }) {
  return (
    <button
      onClick={onClick}
      className="card card-animated p-4 flex flex-col items-start gap-3 text-left w-full cursor-pointer
                 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}15` }}
      >
        {Icono && <Icono size={20} style={{ color }} />}
      </div>
      <div>
        <p className="text-sm font-bold leading-tight"
           style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          {titulo}
        </p>
        <p className="text-xs mt-0.5"
           style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
          {descripcion}
        </p>
      </div>
    </button>
  );
}

/* ── CategoryBar: barra de progreso de categoría ── */
export function CategoryBar({ nombre, porcentajeAcierto, color }) {
  const porcentajeError = 100 - (porcentajeAcierto || 0);

  return (
    <div className="flex items-center gap-3">
      {/* Nombre */}
      <p className="text-sm w-40 shrink-0 truncate"
         style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
        {nombre}
      </p>

      {/* Barra */}
      <div className="flex-1 progress-bar">
        <div
          className="progress-bar__fill"
          style={{
            width: `${porcentajeError}%`,
            background: color || 'var(--color-primary)',
            '--progress-value': `${porcentajeError}%`,
          }}
        />
      </div>

      {/* Porcentaje de error */}
      <span className="text-sm font-bold w-10 text-right"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
        {porcentajeError}%
      </span>
    </div>
  );
}

/* ── QuickAccessCard: acceso rápido (pequeña tarjeta icónica) ── */
export function QuickAccessCard({ label, icono: Icono, color = '#6366f1', onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-center"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}15` }}
      >
        {Icono && <Icono size={18} style={{ color }} />}
      </div>
      <span className="text-[11px] font-semibold leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)' }}>
        {label}
      </span>
    </button>
  );
}

/* ── EmptyState: pantalla vacía genérica ── */
export function EmptyState({ mensaje = 'Aún no hay datos disponibles.', icono: Icono }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      {Icono && <Icono size={36} className="text-gray-300" />}
      <p className="text-sm text-center max-w-xs"
         style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
        {mensaje}
      </p>
    </div>
  );
}

/* ── LoadingCard: skeleton/placeholder ── */
export function LoadingCard({ altura = 'h-24' }) {
  return (
    <div className={`card ${altura} animate-pulse bg-gray-100`} />
  );
}
