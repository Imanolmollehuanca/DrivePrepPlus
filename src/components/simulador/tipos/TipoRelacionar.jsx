/* ============================================================
   DrivePrep+ — TipoRelacionar (rediseñado)
   Conectar pares: clic izq → clic der con animación de línea.
   ============================================================ */
import { useState } from 'react';
import { Link2, X, CheckCircle2 } from 'lucide-react';

export default function TipoRelacionar({ pregunta, respuesta = {}, onResponder }) {
  const [selIzq, setSelIzq] = useState(null);
  const pares = respuesta || {};
  const conectados = Object.keys(pares).length;
  const total      = pregunta.columnaIzq.length;

  /* Ítem der que ya está usado */
  const derUsados = new Set(Object.values(pares));

  /* ── Clic izquierda ── */
  const handleIzq = (id) => {
    if (pares[id]) {
      // Desconectar
      const nuevo = { ...pares };
      delete nuevo[id];
      onResponder(nuevo);
      setSelIzq(null);
    } else {
      setSelIzq(selIzq === id ? null : id);
    }
  };

  /* ── Clic derecha ── */
  const handleDer = (id) => {
    if (!selIzq) return;
    if (derUsados.has(id)) return; // ya está conectado
    const nuevo = { ...pares, [selIzq]: id };
    onResponder(nuevo);
    setSelIzq(null);
  };

  /* ── Desconectar par ── */
  const desconectar = (izqId) => {
    const nuevo = { ...pares };
    delete nuevo[izqId];
    onResponder(nuevo);
  };

  return (
    <div className="space-y-4">
      {/* Progreso */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-display)' }}>
          {conectados} de {total} pares conectados
        </p>
        {selIzq && (
          <span className="text-xs px-2.5 py-1 rounded-full animate-pulse"
                style={{ background:'#6366f115', color:'#6366f1', fontFamily:'var(--font-display)' }}>
            Ahora selecciona la definición →
          </span>
        )}
      </div>

      {/* Grid de dos columnas */}
      <div className="grid grid-cols-2 gap-3">
        {/* Columna izquierda */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-center pb-1 border-b"
             style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-display)', borderColor:'var(--color-border)' }}>
            Señal / Concepto
          </p>
          {pregunta.columnaIzq.map((item) => {
            const conectado  = pares[item.id];
            const activo     = selIzq === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleIzq(item.id)}
                className="w-full p-3 rounded-xl border-2 text-sm text-left
                           transition-all duration-200 relative"
                style={{
                  borderColor: activo     ? '#6366f1' :
                               conectado  ? '#10b981' : 'var(--color-border)',
                  background:  activo     ? '#6366f108' :
                               conectado  ? '#10b98108' : 'var(--color-card)',
                  boxShadow:   activo ? '0 0 0 3px #6366f120' : 'none',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span style={{ fontFamily:'var(--font-body)', color: conectado ? '#059669' : 'var(--color-text-primary)', fontWeight: conectado ? 600 : 400 }}>
                    {item.texto}
                  </span>
                  {conectado
                    ? <button onClick={(e) => { e.stopPropagation(); desconectar(item.id); }}
                              className="shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center hover:bg-red-100 transition-colors group">
                        <X size={10} className="text-green-600 group-hover:text-red-500" />
                      </button>
                    : activo
                    ? <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                    : <Link2 size={13} className="text-gray-300 shrink-0" />
                  }
                </div>
              </button>
            );
          })}
        </div>

        {/* Columna derecha */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-center pb-1 border-b"
             style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-display)', borderColor:'var(--color-border)' }}>
            Significado
          </p>
          {pregunta.columnaDer.map((item) => {
            const usado     = derUsados.has(item.id);
            const disponible = !usado && !!selIzq;

            return (
              <button
                key={item.id}
                onClick={() => handleDer(item.id)}
                disabled={usado && !Object.values(pares).includes(item.id)}
                className="w-full p-3 rounded-xl border-2 text-sm text-left
                           transition-all duration-200"
                style={{
                  borderColor: usado      ? '#10b981' :
                               disponible ? '#6366f1' : 'var(--color-border)',
                  background:  usado      ? '#10b98108' :
                               disponible ? '#6366f105' : 'var(--color-card)',
                  opacity: usado && !disponible ? 0.7 : 1,
                  cursor: usado ? 'default' : disponible ? 'pointer' : 'default',
                  transform: disponible ? 'scale(1.01)' : 'scale(1)',
                  boxShadow: disponible ? '0 0 0 2px #6366f130' : 'none',
                }}
              >
                <div className="flex items-center gap-2">
                  {usado && <CheckCircle2 size={13} className="text-green-500 shrink-0" />}
                  <span style={{ fontFamily:'var(--font-body)', color: usado ? '#059669' : 'var(--color-text-primary)', fontWeight: usado ? 600 : 400 }}>
                    {item.texto}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pares conectados */}
      {conectados > 0 && (
        <div className="pt-3 border-t space-y-1.5" style={{ borderColor:'var(--color-border)' }}>
          <p className="text-xs font-bold" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-display)' }}>
            Pares conectados:
          </p>
          {Object.entries(pares).map(([izqId, derId]) => {
            const izq = pregunta.columnaIzq.find((i) => i.id === izqId);
            const der = pregunta.columnaDer.find((i) => i.id === derId);
            return (
              <div key={izqId} className="flex items-center gap-2 text-xs p-2 rounded-lg"
                   style={{ background:'var(--color-surface)', border:'1px solid #10b98130' }}>
                <span className="font-semibold text-green-700 truncate" style={{ fontFamily:'var(--font-body)' }}>{izq?.texto}</span>
                <span className="text-green-400 shrink-0">↔</span>
                <span className="text-green-700 truncate" style={{ fontFamily:'var(--font-body)' }}>{der?.texto}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
