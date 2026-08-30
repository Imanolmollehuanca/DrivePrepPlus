/* ============================================================
   DrivePrep+ — TarjetaCategoria
   Card de categoría con progreso, porcentaje y botón.
   ============================================================ */
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const META = {
  senales_preventivas:    { bg:'#fef3c7', emoji:'⚠️', color:'#f59e0b' },
  senales_reglamentarias: { bg:'#fee2e2', emoji:'🛑', color:'#ef4444' },
  senales_informativas:   { bg:'#eff6ff', emoji:'ℹ️', color:'#3b82f6' },
  normas_transito:        { bg:'rgba(2,132,199,0.1)', emoji:'📋', color:'#0284c7' },
  infracciones:           { bg:'#fdf2f8', emoji:'⚖️', color:'#ec4899' },
  primeros_auxilios:      { bg:'#ecfdf5', emoji:'🩺', color:'#10b981' },
  mecanica_basica:        { bg:'#f1f5f9', emoji:'🔧', color:'#64748b' },
  seguridad_vial:         { bg:'#f0f9ff', emoji:'🛡️', color:'#0ea5e9' },
};

export default function TarjetaCategoria({ categoria, progresoCat, onPracticar }) {
  const [hover, setHover] = useState(false);

  const { porcentajeAvance = 0, porcentajeAciertos = 0,
          preguntasRespondidas = 0, totalPreguntas = 10 } = progresoCat;

  const meta     = META[categoria.id] || { bg:'#f8fafc', emoji:'📚', color:'#0284c7' };
  const color    = categoria.color || meta.color;
  const iniciada = preguntasRespondidas > 0;
  const pct      = Math.round(porcentajeAvance);

  const colorBarra = iniciada
    ? porcentajeAciertos >= 70 ? '#10b981'
    : porcentajeAciertos >= 50 ? '#f59e0b'
    : '#ef4444'
    : color;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="card p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover border cursor-pointer"
      style={{
        borderColor: hover ? color : 'var(--color-border)',
        background: 'var(--color-card)',
      }}
      onClick={() => onPracticar(categoria.id)}
    >
      <div className="space-y-3">
        {/* Header de la tarjeta */}
        <div className="flex items-center justify-between">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border"
            style={{ background: meta.bg, borderColor: `${color}30` }}
          >
            {meta.emoji}
          </div>

          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full border"
            style={{
              background: iniciada ? `${colorBarra}15` : 'var(--color-bg)',
              color: iniciada ? colorBarra : 'var(--color-text-muted)',
              borderColor: iniciada ? `${colorBarra}30` : 'var(--color-border)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {iniciada ? `${porcentajeAciertos}% aciertos` : 'Sin iniciar'}
          </span>
        </div>

        {/* Textos */}
        <div>
          <h3
            className="text-base font-bold leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            {categoria.label}
          </h3>
          <p
            className="text-xs mt-1 leading-relaxed line-clamp-2"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}
          >
            {categoria.descripcion}
          </p>
        </div>
      </div>

      {/* Footer y Barra de Progreso */}
      <div className="pt-4 mt-4 border-t space-y-3" style={{ borderColor: 'var(--color-border)' }}>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
              Preguntas completadas
            </span>
            <span className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              {preguntasRespondidas} / {totalPreguntas}
            </span>
          </div>

          <div className="progress-bar h-2">
            <div
              className="progress-bar__fill"
              style={{
                width: `${pct}%`,
                background: colorBarra,
              }}
            />
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onPracticar(categoria.id); }}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          style={{
            background: hover ? color : `${color}15`,
            color: hover ? '#ffffff' : color,
            fontFamily: 'var(--font-display)',
          }}
        >
          <span>Practicar tema</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}