/* ============================================================
   DrivePrep+ — TipoOrdenar (rediseñado)
   Drag & Drop nativo con animación y feedback visual.
   ============================================================ */
import { useState, useRef, useEffect, useCallback } from 'react';
import { GripVertical, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';

export default function TipoOrdenar({ pregunta, respuesta, onResponder }) {
  /* Inicializa mezclado UNA sola vez */
  const [items, setItems] = useState(() => {
    if (Array.isArray(respuesta) && respuesta.length === pregunta.items.length) {
      return respuesta.map((id) => pregunta.items.find((it) => it.id === id)).filter(Boolean);
    }
    return [...pregunta.items].sort(() => Math.random() - 0.5);
  });

  const dragIdx  = useRef(null);
  const [dragOver, setDragOver] = useState(null);
  const [animIdx, setAnimIdx]   = useState(null);

  /* Sincronizar hacia afuera */
  const emitir = useCallback((lista) => {
    onResponder(lista.map((i) => i.id));
  }, [onResponder]);

  /* ── Drag handlers ── */
  const onDragStart = (e, idx) => {
    dragIdx.current = idx;
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragOver  = (e, idx) => { e.preventDefault(); setDragOver(idx); };
  const onDragLeave = ()       => setDragOver(null);
  const onDrop      = (e, idx) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === idx) { setDragOver(null); return; }
    const lista = [...items];
    const [mov] = lista.splice(dragIdx.current, 1);
    lista.splice(idx, 0, mov);
    dragIdx.current = null;
    setDragOver(null);
    setItems(lista);
    emitir(lista);
  };
  const onDragEnd   = () => { dragIdx.current = null; setDragOver(null); };

  /* ── Botones arriba/abajo (accesibilidad / mobile) ── */
  const mover = (idx, dir) => {
    const nuevoIdx = idx + dir;
    if (nuevoIdx < 0 || nuevoIdx >= items.length) return;
    const lista = [...items];
    [lista[idx], lista[nuevoIdx]] = [lista[nuevoIdx], lista[idx]];
    setAnimIdx(nuevoIdx);
    setTimeout(() => setAnimIdx(null), 300);
    setItems(lista);
    emitir(lista);
  };

  /* ── Reiniciar ── */
  const reiniciar = () => {
    const mezclado = [...pregunta.items].sort(() => Math.random() - 0.5);
    setItems(mezclado);
    onResponder(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-display)' }}>
          Arrastra o usa las flechas para ordenar
        </p>
        <button onClick={reiniciar}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                           bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                style={{ fontFamily:'var(--font-display)' }}>
          <RotateCcw size={11} /> Mezclar
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => {
          const isDragTarget = dragOver === idx;
          const isAnimating  = animIdx  === idx;

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => onDragStart(e, idx)}
              onDragOver={(e)  => onDragOver(e, idx)}
              onDragLeave={onDragLeave}
              onDrop={(e)      => onDrop(e, idx)}
              onDragEnd={onDragEnd}
              className="flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-grab active:cursor-grabbing
                         transition-all duration-200 select-none"
              style={{
                borderColor: isDragTarget ? '#6366f1' : 'var(--color-border)',
                background:  isDragTarget ? '#6366f108' : 'var(--color-card)',
                transform:   isDragTarget ? 'scale(1.015)' : isAnimating ? 'scale(0.98)' : 'scale(1)',
                boxShadow:   isDragTarget ? '0 4px 16px rgba(99,102,241,0.15)' : 'var(--shadow-card)',
              }}
            >
              {/* Número de posición */}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0"
                   style={{ background:'var(--color-surface)', color:'#6366f1', fontFamily:'var(--font-display)' }}>
                {idx + 1}
              </div>

              {/* Grip */}
              <GripVertical size={16} className="text-gray-300 shrink-0" />

              {/* Emoji + texto */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {item.emoji && (
                  <span className="text-xl shrink-0">{item.emoji}</span>
                )}
                <span className="text-sm leading-snug" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-primary)' }}>
                  {item.texto}
                </span>
              </div>

              {/* Botones arriba/abajo */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => mover(idx, -1)} disabled={idx === 0}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-[var(--color-surface)]
                                   disabled:opacity-25 transition-colors">
                  <ArrowUp size={11} className="text-gray-500" />
                </button>
                <button onClick={() => mover(idx, 1)} disabled={idx === items.length - 1}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-[var(--color-surface)]
                                   disabled:opacity-25 transition-colors">
                  <ArrowDown size={11} className="text-gray-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-center" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
        💡 En móvil usa las flechas ↑↓ para reordenar
      </p>
    </div>
  );
}
