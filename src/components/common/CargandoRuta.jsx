import React from 'react';

/**
 * CargandoRuta — Spinner sutil para transiciones de Suspense entre páginas
 */
export default function CargandoRuta() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 animate-[fadeIn_0.2s_ease]">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-sky-500/20 border-t-sky-500 animate-spin" />
        <div className="w-2 h-2 rounded-full bg-sky-500 absolute" />
      </div>
      <p className="text-xs font-semibold font-display tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
        Cargando sección...
      </p>
    </div>
  );
}
