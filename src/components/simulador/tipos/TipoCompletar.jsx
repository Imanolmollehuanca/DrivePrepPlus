/* ============================================================
   DrivePrep+ — TipoCompletar (rediseñado)
   Completar espacios: clic en palabra → clic en hueco.
   Con animación y opción de borrar palabras colocadas.
   ============================================================ */
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

/* ── Parsear texto con {{huecos}} ── */
function parsear(texto) {
  const partes = [];
  const regex  = /\{\{(\w+)\}\}/g;
  let ultimo   = 0, match;
  while ((match = regex.exec(texto)) !== null) {
    if (match.index > ultimo) partes.push({ tipo:'texto', valor: texto.slice(ultimo, match.index) });
    partes.push({ tipo:'hueco', id: match[1] });
    ultimo = match.index + match[0].length;
  }
  if (ultimo < texto.length) partes.push({ tipo:'texto', valor: texto.slice(ultimo) });
  return partes;
}

export default function TipoCompletar({ pregunta, respuesta = {}, onResponder }) {
  const [palabraSeleccionada, setPalabra] = useState(null);
  const relleno  = respuesta || {};
  const partes   = parsear(pregunta.textoConHuecos);

  /* Palabras ya usadas */
  const usadas = new Set(Object.values(relleno));

  /* ── Clic en palabra del banco ── */
  const handlePalabra = (p) => {
    if (usadas.has(p)) return;
    setPalabra(palabraSeleccionada === p ? null : p);
  };

  /* ── Clic en hueco ── */
  const handleHueco = (huecoId) => {
    if (relleno[huecoId]) {
      // Vaciar el hueco
      const nuevo = { ...relleno };
      delete nuevo[huecoId];
      onResponder(nuevo);
      return;
    }
    if (!palabraSeleccionada) return;
    onResponder({ ...relleno, [huecoId]: palabraSeleccionada });
    setPalabra(null);
  };

  /* ── Reiniciar ── */
  const reiniciar = () => { onResponder({}); setPalabra(null); };

  const totalHuecos  = Object.keys(pregunta.respuestasCorrectas).length;
  const rellenoCount = Object.keys(relleno).length;

  return (
    <div className="space-y-5">
      {/* Progreso */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="progress-bar w-28 h-2">
            <div className="progress-bar__fill" style={{ width:`${(rellenoCount/totalHuecos)*100}%`, background:'#8b5cf6' }} />
          </div>
          <span className="text-xs font-semibold" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-display)' }}>
            {rellenoCount}/{totalHuecos} espacios
          </span>
        </div>
        <button onClick={reiniciar}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                           bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                style={{ fontFamily:'var(--font-display)' }}>
          <RotateCcw size={11} /> Limpiar
        </button>
      </div>

      {/* Texto con huecos */}
      <div className="p-4 rounded-xl leading-loose text-sm"
           style={{ background:'#f8fafc', border:'1px solid var(--color-border)', fontFamily:'var(--font-body)', color:'var(--color-text-primary)', lineHeight:'2.4' }}>
        {partes.map((parte, i) => {
          if (parte.tipo === 'texto') return <span key={i}>{parte.valor}</span>;

          const valorActual  = relleno[parte.id];
          const estaLleno    = !!valorActual;
          const puedeLlenar  = !estaLleno && !!palabraSeleccionada;

          return (
            <button
              key={parte.id}
              onClick={() => handleHueco(parte.id)}
              className="inline-flex items-center justify-center px-3 py-0.5 mx-1
                         rounded-lg border-2 border-dashed font-semibold
                         transition-all duration-200 align-middle"
              style={{
                minWidth: '80px',
                borderColor: estaLleno   ? '#8b5cf6'         :
                             puedeLlenar ? '#6366f1'         : '#cbd5e1',
                background:  estaLleno   ? '#8b5cf610'       :
                             puedeLlenar ? '#6366f108'       : '#f1f5f9',
                color:       estaLleno   ? '#7c3aed'         :
                             puedeLlenar ? '#6366f1'         : '#94a3b8',
                transform:   puedeLlenar ? 'scale(1.05)' : 'scale(1)',
                boxShadow:   estaLleno ? '0 0 0 2px #8b5cf625' :
                             puedeLlenar ? '0 0 0 2px #6366f120' : 'none',
                cursor: estaLleno || puedeLlenar ? 'pointer' : 'default',
              }}
            >
              {estaLleno ? valorActual : '______'}
            </button>
          );
        })}
      </div>

      {/* Banco de palabras */}
      <div>
        <p className="text-xs font-bold mb-2" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-display)' }}>
          Banco de palabras — Selecciona una y luego el espacio:
        </p>
        <div className="flex flex-wrap gap-2">
          {pregunta.palabrasDisponibles.map((palabra) => {
            const usada      = usadas.has(palabra);
            const seleccion  = palabraSeleccionada === palabra;

            return (
              <button
                key={palabra}
                onClick={() => handlePalabra(palabra)}
                disabled={usada}
                className="px-3 py-1.5 rounded-lg border-2 text-sm font-semibold
                           transition-all duration-150 select-none"
                style={{
                  borderColor: usada      ? '#e2e8f0' :
                               seleccion  ? '#8b5cf6' : '#cbd5e1',
                  background:  usada      ? '#f8fafc'  :
                               seleccion  ? '#8b5cf610': '#fff',
                  color:       usada      ? '#94a3b8'  :
                               seleccion  ? '#7c3aed'  : 'var(--color-text-primary)',
                  opacity:     usada ? 0.5 : 1,
                  cursor:      usada ? 'default' : 'pointer',
                  transform:   seleccion ? 'scale(1.05)' : 'scale(1)',
                  boxShadow:   seleccion ? '0 0 0 3px #8b5cf625' : 'none',
                  fontFamily:  'var(--font-display)',
                }}
              >
                {palabra}
                {usada && <span className="ml-1 text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {palabraSeleccionada && (
        <p className="text-xs text-center animate-pulse"
           style={{ color:'#6366f1', fontFamily:'var(--font-body)' }}>
          ✨ Ahora haz clic en el espacio donde va "<strong>{palabraSeleccionada}</strong>"
        </p>
      )}
    </div>
  );
}
