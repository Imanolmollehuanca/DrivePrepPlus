/* ============================================================
   DrivePrep+ — TipoClasificar (rediseñado)
   Drag & drop hacia columnas con feedback visual rico.
   ============================================================ */
import { useState } from 'react';
import { RotateCcw, X } from 'lucide-react';

export default function TipoClasificar({ pregunta, respuesta = {}, onResponder }) {
  const clasificacion  = respuesta || {};
  const [dragging, setDragging]    = useState(null);
  const [dragOverCat, setDragOverCat] = useState(null);
  const [dragOverBanco, setDragOverBanco] = useState(false);

  const itemsPendientes = pregunta.items.filter((it) => !(it.id in clasificacion));
  const itemsEnCat      = (catId) => pregunta.items.filter((it) => clasificacion[it.id] === catId);
  const totalClasif     = Object.keys(clasificacion).length;
  const totalItems      = pregunta.items.length;

  /* ── Drag desde banco o categoría ── */
  const onDragStart = (e, itemId) => {
    setDragging(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  /* ── Drop en categoría ── */
  const onDropCat = (e, catId) => {
    e.preventDefault();
    if (!dragging) return;
    onResponder({ ...clasificacion, [dragging]: catId });
    setDragging(null);
    setDragOverCat(null);
  };

  /* ── Drop en banco (remover clasificación) ── */
  const onDropBanco = (e) => {
    e.preventDefault();
    if (!dragging) return;
    const nueva = { ...clasificacion };
    delete nueva[dragging];
    onResponder(nueva);
    setDragging(null);
    setDragOverBanco(false);
  };

  /* ── Quitar manualmente ── */
  const quitar = (itemId) => {
    const nueva = { ...clasificacion };
    delete nueva[itemId];
    onResponder(nueva);
  };

  /* ── Reiniciar ── */
  const reiniciar = () => onResponder({});

  return (
    <div className="space-y-4">
      {/* Header con progreso */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="progress-bar w-32 h-2">
            <div className="progress-bar__fill" style={{ width:`${(totalClasif/totalItems)*100}%`, background:'#10b981' }} />
          </div>
          <span className="text-xs font-semibold" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-display)' }}>
            {totalClasif}/{totalItems}
          </span>
        </div>
        <button onClick={reiniciar}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                           bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                style={{ fontFamily:'var(--font-display)' }}>
          <RotateCcw size={11} /> Reiniciar
        </button>
      </div>

      {/* Banco de ítems sin clasificar */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOverBanco(true); }}
        onDragLeave={() => setDragOverBanco(false)}
        onDrop={onDropBanco}
        className="p-3 rounded-xl border-2 border-dashed transition-all duration-200"
        style={{
          borderColor: dragOverBanco ? '#6366f1' : 'var(--color-border)',
          background:  dragOverBanco ? '#6366f105' : '#fafafa',
          minHeight: '60px',
        }}
      >
        <p className="text-xs font-bold mb-2" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-display)' }}>
          📦 Elementos sin clasificar {itemsPendientes.length > 0 ? `(${itemsPendientes.length})` : '— ¡Todos clasificados!'}
        </p>
        <div className="flex flex-wrap gap-2">
          {itemsPendientes.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => onDragStart(e, item.id)}
              onDragEnd={() => { setDragging(null); setDragOverCat(null); setDragOverBanco(false); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 cursor-grab
                         active:cursor-grabbing active:scale-95 transition-all duration-150 select-none"
              style={{
                borderColor: dragging === item.id ? '#6366f1' : 'var(--color-border)',
                background:  dragging === item.id ? '#6366f110' : '#fff',
                opacity:     dragging === item.id ? 0.6 : 1,
                boxShadow:   'var(--shadow-card)',
              }}
            >
              {item.emoji && <span className="text-base">{item.emoji}</span>}
              <span className="text-xs font-medium" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-primary)' }}>
                {item.texto}
              </span>
            </div>
          ))}
          {itemsPendientes.length === 0 && (
            <p className="text-xs italic" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
              Arrastra aquí para devolver un elemento
            </p>
          )}
        </div>
      </div>

      {/* Columnas de categorías */}
      <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${pregunta.categorias.length}, 1fr)` }}>
        {pregunta.categorias.map((cat) => {
          const esTarget   = dragOverCat === cat.id;
          const itemsDeCat = itemsEnCat(cat.id);

          return (
            <div
              key={cat.id}
              onDragOver={(e) => { e.preventDefault(); setDragOverCat(cat.id); }}
              onDragLeave={() => setDragOverCat(null)}
              onDrop={(e) => onDropCat(e, cat.id)}
              className="rounded-xl border-2 transition-all duration-200 overflow-hidden"
              style={{
                borderColor: esTarget ? cat.color : `${cat.color}40`,
                background:  esTarget ? `${cat.color}08` : `${cat.color}04`,
                transform:   esTarget ? 'scale(1.01)' : 'scale(1)',
                boxShadow:   esTarget ? `0 0 0 3px ${cat.color}25` : 'none',
                minHeight: '120px',
              }}
            >
              {/* Header de categoría */}
              <div className="px-3 py-2 flex items-center gap-2 border-b"
                   style={{ background:`${cat.color}15`, borderColor:`${cat.color}30` }}>
                <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                <p className="text-xs font-extrabold" style={{ color: cat.color, fontFamily:'var(--font-display)' }}>
                  {cat.label}
                </p>
                <span className="ml-auto text-xs font-bold" style={{ color: cat.color, fontFamily:'var(--font-display)' }}>
                  {itemsDeCat.length}
                </span>
              </div>

              {/* Ítems clasificados */}
              <div className="p-2 space-y-1.5 min-h-[60px]">
                {itemsDeCat.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, item.id)}
                    onDragEnd={() => { setDragging(null); setDragOverCat(null); setDragOverBanco(false); }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-grab
                               active:cursor-grabbing transition-all duration-150 select-none group"
                    style={{
                      background: '#fff',
                      borderColor:`${cat.color}40`,
                      boxShadow: `0 1px 3px ${cat.color}15`,
                    }}
                  >
                    {item.emoji && <span className="text-sm">{item.emoji}</span>}
                    <span className="text-[11px] font-medium flex-1" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-primary)' }}>
                      {item.texto}
                    </span>
                    <button
                      onClick={() => quitar(item.id)}
                      className="opacity-0 group-hover:opacity-100 w-4 h-4 rounded flex items-center justify-center
                                 hover:bg-red-100 transition-all"
                    >
                      <X size={9} className="text-red-400" />
                    </button>
                  </div>
                ))}
                {itemsDeCat.length === 0 && (
                  <p className="text-xs text-center py-3 italic"
                     style={{ color: esTarget ? cat.color : 'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                    {esTarget ? '¡Suelta aquí!' : 'Arrastra aquí'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
