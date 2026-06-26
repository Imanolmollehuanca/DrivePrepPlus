/* ============================================================
   DrivePrep+ — SimuladorTopbar
   Barra superior durante el examen: tiempo, progreso, salir.
   ============================================================ */

import { Clock, Flag, X } from 'lucide-react';

export default function SimuladorTopbar({
  tiempoRestanteFormato,
  tiempoEsCritico,
  respondidas,
  totalPreguntas,
  porcentajeAvance,
  onFinalizar,
}) {
  return (
    <div
      className="sticky top-0 z-30 flex items-center gap-4 px-5 py-3 border-b"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Temporizador */}
      <div
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg
          transition-all duration-300
          ${tiempoEsCritico
            ? 'bg-red-50 text-red-600 animate-pulse'
            : 'bg-indigo-50 text-indigo-700'
          }
        `}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <Clock size={18} className={tiempoEsCritico ? 'text-red-500' : 'text-indigo-500'} />
        {tiempoRestanteFormato}
      </div>

      {/* Barra de progreso central */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)' }}>
            {respondidas} de {totalPreguntas} respondidas
          </span>
          <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
            {porcentajeAvance}%
          </span>
        </div>
        <div className="progress-bar h-2">
          <div
            className="progress-bar__fill"
            style={{ width: `${porcentajeAvance}%`, background: 'var(--color-primary)' }}
          />
        </div>
      </div>

      {/* Botón finalizar */}
      <button
        onClick={onFinalizar}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                   border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50
                   transition-colors"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <Flag size={15} />
        <span className="hidden sm:inline">Finalizar</span>
      </button>
    </div>
  );
}
