/* ============================================================
   DrivePrep+ — TipoOpcionMultiple (mejorado)
   Selección A/B/C/D con feedback visual animado.
   ============================================================ */
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const LETRAS = { a: 'A', b: 'B', c: 'C', d: 'D' };
const COLORES_LETRA = ['#6366f1','#10b981','#f59e0b','#ef4444'];

export default function TipoOpcionMultiple({ pregunta, respuesta, onResponder }) {
  const [pulsando, setPulsando] = useState(null);

  const handleClick = (opcionId) => {
    if (respuesta === opcionId) return; // deseleccionar no permitido aquí
    setPulsando(opcionId);
    setTimeout(() => {
      onResponder(opcionId);
      setPulsando(null);
    }, 120);
  };

  return (
    <div className="space-y-3">
      {pregunta.opciones.map((opcion, i) => {
        const seleccionada = respuesta === opcion.id;
        const esPulsando   = pulsando === opcion.id;
        const colorLetra   = COLORES_LETRA[i % COLORES_LETRA.length];

        return (
          <button
            key={opcion.id}
            onClick={() => handleClick(opcion.id)}
            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left
                       transition-all duration-200 group relative overflow-hidden"
            style={{
              borderColor: seleccionada ? colorLetra : 'var(--color-border)',
              background:  seleccionada ? `${colorLetra}0d` : 'var(--color-card)',
              transform:   esPulsando ? 'scale(0.985)' : 'scale(1)',
              boxShadow:   seleccionada ? `0 0 0 3px ${colorLetra}20` : 'none',
            }}
          >
            {/* Fondo animado al hover */}
            {!seleccionada && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-xl" style={{ background: 'var(--color-hover)' }}/>
            )}

            {/* Letra de opción */}
            <div
              className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center
                         text-sm font-extrabold shrink-0 transition-all duration-200"
              style={{
                background: seleccionada ? colorLetra : '#f1f5f9',
                color:      seleccionada ? '#fff'      : '#64748b',
                fontFamily: 'var(--font-display)',
              }}
            >
              {seleccionada ? <CheckCircle2 size={16} /> : LETRAS[opcion.id]}
            </div>

            {/* Texto */}
            <span
              className="relative z-10 text-sm leading-relaxed transition-colors duration-200"
              style={{
                fontFamily: 'var(--font-body)',
                color:      seleccionada ? colorLetra : 'var(--color-text-primary)',
                fontWeight: seleccionada ? 600 : 400,
              }}
            >
              {opcion.texto}
            </span>

            {/* Indicador derecho */}
            {seleccionada && (
              <div className="ml-auto relative z-10 shrink-0">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: colorLetra }}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
