/* ============================================================
   DrivePrep+ — RenderedorPregunta (mejorado)
   Despacha el tipo correcto + transición de entrada animada.
   ============================================================ */
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { CATEGORIAS } from '../../data/bancoPreguntasMTC';
import TipoOpcionMultiple from './tipos/TipoOpcionMultiple';
import TipoRelacionar     from './tipos/TipoRelacionar';
import TipoOrdenar        from './tipos/TipoOrdenar';
import TipoClasificar     from './tipos/TipoClasificar';
import TipoCompletar      from './tipos/TipoCompletar';

const TIPO_META = {
  opcion_multiple: { label:'Opción múltiple',  color:'#6366f1', bg:'#eef2ff',  emoji:'🔘' },
  relacionar:      { label:'Relacionar',        color:'#0ea5e9', bg:'#f0f9ff',  emoji:'🔗' },
  ordenar:         { label:'Ordenar pasos',     color:'#f59e0b', bg:'#fff7ed',  emoji:'↕️' },
  clasificar:      { label:'Clasificar',        color:'#10b981', bg:'#f0fdf4',  emoji:'📂' },
  completar:       { label:'Completar texto',   color:'#8b5cf6', bg:'#faf5ff',  emoji:'✏️' },
};

const COMPONENTES = {
  opcion_multiple: TipoOpcionMultiple,
  relacionar:      TipoRelacionar,
  ordenar:         TipoOrdenar,
  clasificar:      TipoClasificar,
  completar:       TipoCompletar,
};

export default function RenderedorPregunta({
  pregunta, indice, total, respuesta, marcada,
  onResponder, onToggleMarcada, onAnterior, onSiguiente,
}) {
  const [visible, setVisible] = useState(false);

  /* Animación de entrada al cambiar de pregunta */
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [pregunta?.id]);

  if (!pregunta) return null;

  const categoria  = CATEGORIAS[pregunta.categoria];
  const tipoMeta   = TIPO_META[pregunta.tipo] || TIPO_META.opcion_multiple;
  const Componente = COMPONENTES[pregunta.tipo] || TipoOpcionMultiple;

  const tieneRespuesta = respuesta !== undefined && respuesta !== null &&
    (Array.isArray(respuesta) ? respuesta.length > 0 :
     typeof respuesta === 'object' ? Object.keys(respuesta).length > 0 : true);

  return (
    <div
      className="card p-6 space-y-5 transition-all duration-300"
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
      }}
    >
      {/* ── Cabecera ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">

          {/* Categoría */}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background:`${categoria?.color}15`, color: categoria?.color, fontFamily:'var(--font-display)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: categoria?.color }} />
            {categoria?.label}
          </span>

          {/* Tipo de pregunta */}
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: tipoMeta.bg, color: tipoMeta.color, fontFamily:'var(--font-display)' }}>
            {tipoMeta.emoji} {tipoMeta.label}
          </span>

          {/* Dificultad */}
          <span className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: pregunta.dificultad==='dificil' ? '#fee2e2' : pregunta.dificultad==='media' ? '#fef3c7' : '#d1fae5',
                  color:      pregunta.dificultad==='dificil' ? '#dc2626' : pregunta.dificultad==='media' ? '#d97706' : '#059669',
                  fontFamily: 'var(--font-body)',
                }}>
            {pregunta.dificultad}
          </span>
        </div>

        {/* Marcar */}
        <button
          onClick={() => onToggleMarcada(pregunta.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                      transition-all duration-150 shrink-0
                      ${marcada ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-500'}`}
          style={{ fontFamily:'var(--font-display)' }}
        >
          {marcada ? <BookmarkCheck size={14}/> : <Bookmark size={14}/>}
          <span className="hidden sm:inline">{marcada ? 'Marcada' : 'Marcar'}</span>
        </button>
      </div>

      {/* ── Enunciado ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold px-2 py-0.5 rounded-md"
                style={{ background:'#f1f5f9', color:'var(--color-text-muted)', fontFamily:'var(--font-display)' }}>
            {indice + 1} / {total}
          </span>
          {/* Barra de progreso inline */}
          <div className="flex-1 progress-bar h-1.5">
            <div className="progress-bar__fill"
                 style={{ width:`${((indice+1)/total)*100}%`, background: categoria?.color || '#6366f1' }} />
          </div>
        </div>

        <h2 className="text-lg font-bold leading-snug"
            style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
          {pregunta.enunciado}
        </h2>
        {pregunta.instruccion && (
          <p className="text-sm italic" style={{ color:'var(--color-text-secondary)', fontFamily:'var(--font-body)' }}>
            💡 {pregunta.instruccion}
          </p>
        )}
      </div>

      {/* ── Componente interactivo ── */}
      <Componente
        pregunta={pregunta}
        respuesta={respuesta}
        onResponder={(val) => onResponder(pregunta.id, val)}
      />

      {/* ── Navegación ── */}
      <div className="flex items-center justify-between pt-3 border-t"
           style={{ borderColor:'var(--color-border)' }}>
        <button onClick={onAnterior} disabled={indice === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                           border border-[var(--color-border)] hover:bg-gray-50
                           disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ fontFamily:'var(--font-display)', color:'var(--color-text-secondary)' }}>
          ← Anterior
        </button>

        <div className="flex items-center gap-2">
          {tieneRespuesta ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600"
                  style={{ fontFamily:'var(--font-body)' }}>
              <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</span>
              Respondida
            </span>
          ) : (
            <span className="text-xs text-gray-400" style={{ fontFamily:'var(--font-body)' }}>Sin respuesta</span>
          )}
        </div>

        <button onClick={onSiguiente} disabled={indice === total-1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                           bg-indigo-50 text-indigo-600 border border-indigo-200
                           hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ fontFamily:'var(--font-display)' }}>
          Siguiente →
        </button>
      </div>
    </div>
  );
}
