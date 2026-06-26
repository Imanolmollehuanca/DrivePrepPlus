/* ============================================================
   DrivePrep+ — PreguntaCard
   Tarjeta que muestra una pregunta y sus opciones de respuesta.
   ============================================================ */

import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIAS } from '../../data/bancoPreguntasMTC';

const LETRAS = { a: 'A', b: 'B', c: 'C', d: 'D' };

export default function PreguntaCard({
  pregunta,
  indice,
  total,
  respuestaSeleccionada,
  marcada,
  onSeleccionar,
  onToggleMarcada,
  onAnterior,
  onSiguiente,
}) {
  if (!pregunta) return null;

  const categoria = CATEGORIAS[pregunta.categoria];

  return (
    <div className="card card-animated p-6 space-y-6">

      {/* ── Encabezado: categoría + marcador ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: categoria?.color || '#6366f1' }}
          />
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              fontFamily: 'var(--font-display)',
              background: `${categoria?.color || '#6366f1'}15`,
              color: categoria?.color || '#6366f1',
            }}
          >
            {categoria?.label || pregunta.categoria}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              fontFamily: 'var(--font-body)',
              background: pregunta.dificultad === 'dificil' ? '#fee2e2' : pregunta.dificultad === 'media' ? '#fef3c7' : '#d1fae5',
              color:      pregunta.dificultad === 'dificil' ? '#dc2626' : pregunta.dificultad === 'media' ? '#d97706' : '#059669',
            }}
          >
            {pregunta.dificultad}
          </span>
        </div>

        {/* Botón marcar para revisión */}
        <button
          onClick={() => onToggleMarcada(pregunta.id)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
            transition-all duration-150
            ${marcada
              ? 'bg-amber-100 text-amber-600'
              : 'bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-500'
            }
          `}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {marcada ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          <span className="hidden sm:inline">{marcada ? 'Marcada' : 'Marcar'}</span>
        </button>
      </div>

      {/* ── Número y enunciado ── */}
      <div className="space-y-3">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
        >
          Pregunta {indice + 1} de {total}
        </p>
        <h2
          className="text-lg font-bold leading-snug"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          {pregunta.enunciado}
        </h2>
      </div>

      {/* ── Opciones ── */}
      <div className="space-y-3">
        {pregunta.opciones.map((opcion) => {
          const seleccionada = respuestaSeleccionada === opcion.id;
          return (
            <button
              key={opcion.id}
              onClick={() => onSeleccionar(pregunta.id, opcion.id)}
              className={`
                w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left
                transition-all duration-150 group
                ${seleccionada
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-[var(--color-border)] bg-white hover:border-indigo-200 hover:bg-indigo-50/40'
                }
              `}
            >
              {/* Letra de opción */}
              <div
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold
                  shrink-0 transition-all duration-150
                  ${seleccionada
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                  }
                `}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {LETRAS[opcion.id]}
              </div>

              {/* Texto de la opción */}
              <span
                className={`text-sm leading-relaxed pt-0.5 ${seleccionada ? 'font-semibold' : ''}`}
                style={{
                  fontFamily: 'var(--font-body)',
                  color: seleccionada ? '#3730a3' : 'var(--color-text-primary)',
                }}
              >
                {opcion.texto}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Navegación anterior / siguiente ── */}
      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={onAnterior}
          disabled={indice === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                     border border-[var(--color-border)] hover:bg-gray-50
                     disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)' }}
        >
          <ChevronLeft size={16} /> Anterior
        </button>

        <span className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          {respuestaSeleccionada ? '✓ Respondida' : 'Sin respuesta'}
        </span>

        <button
          onClick={onSiguiente}
          disabled={indice === total - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                     bg-indigo-50 text-indigo-600 border border-indigo-200
                     hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Siguiente <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
