/* ============================================================
   DrivePrep+ — PanelNavegacion (mejorado)
   Grid de preguntas con indicador de tipo y color de categoría.
   ============================================================ */
import { Bookmark } from 'lucide-react';
import { CATEGORIAS } from '../../data/bancoPreguntasMTC';

const TIPO_EMOJI = {
  opcion_multiple: '🔘',
  relacionar:      '🔗',
  ordenar:         '↕️',
  clasificar:      '📂',
  completar:       '✏️',
};

export default function PanelNavegacion({ preguntas, indicePregunta, respuestas, marcadas, onIrAPregunta }) {
  const respondidas   = Object.keys(respuestas).length;
  const marcadasCount = Object.values(marcadas).filter(Boolean).length;

  /* Agrupar preguntas por categoría para el resumen */
  const resPorCat = {};
  preguntas.forEach((p) => {
    const cat = CATEGORIAS[p.categoria];
    if (!resPorCat[p.categoria]) resPorCat[p.categoria] = { label: cat?.label, color: cat?.color, total: 0, resps: 0 };
    resPorCat[p.categoria].total++;
    if (respuestas[p.id] !== undefined) resPorCat[p.categoria].resps++;
  });

  return (
    <div className="card p-4 space-y-4 sticky top-20">

      {/* Leyenda */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>Navegación</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {[
            { color:'bg-indigo-500 text-white', label:'Actual'       },
            { color:'bg-green-100 border border-green-300', label:'Respondida' },
            { color:'bg-amber-400 text-white',  label:'Marcada'      },
            { color:'bg-gray-100',              label:'Sin responder' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-4 h-4 rounded-md shrink-0 ${color}`} />
              <span className="text-[10px]" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid de preguntas */}
      <div className="grid grid-cols-5 gap-1.5">
        {preguntas.map((pregunta, i) => {
          const respondida = respuestas[pregunta.id] !== undefined && respuestas[pregunta.id] !== null;
          const esMarcada  = !!marcadas[pregunta.id];
          const esActual   = i === indicePregunta;
          const cat        = CATEGORIAS[pregunta.categoria];

          let bg, text, border;
          if (esActual) { bg = '#4f46e5'; text = '#fff'; border = '#4f46e5'; }
          else if (esMarcada) { bg = '#f59e0b'; text = '#fff'; border = '#f59e0b'; }
          else if (respondida) { bg = '#f0fdf4'; text = '#15803d'; border = '#86efac'; }
          else { bg = '#f8fafc'; text = '#94a3b8'; border = '#e2e8f0'; }

          return (
            <button
              key={pregunta.id}
              onClick={() => onIrAPregunta(i)}
              title={`P${i+1} · ${cat?.label} · ${TIPO_EMOJI[pregunta.tipo] || '?'}`}
              className="relative w-full aspect-square flex flex-col items-center justify-center
                         rounded-lg text-[10px] font-extrabold transition-all duration-100 hover:scale-110"
              style={{ background: bg, color: text, border: `1.5px solid ${border}`, fontFamily:'var(--font-display)' }}
            >
              {i + 1}
              {/* Dot de tipo de pregunta */}
              <span className="text-[8px] leading-none opacity-70">{TIPO_EMOJI[pregunta.tipo]}</span>
              {esMarcada && !esActual && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full
                                 flex items-center justify-center">
                  <Bookmark size={7} className="text-white" fill="white" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Resumen numérico */}
      <div className="pt-3 border-t space-y-2" style={{ borderColor:'var(--color-border)' }}>
        {[
          { label:'Respondidas',   valor: respondidas,                  color:'#10b981' },
          { label:'Sin responder', valor: preguntas.length-respondidas, color:'#ef4444' },
          { label:'Marcadas',      valor: marcadasCount,                color:'#f59e0b' },
        ].map(({ label, valor, color }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-xs" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>{label}</span>
            <span className="text-sm font-extrabold" style={{ fontFamily:'var(--font-display)', color }}>{valor}</span>
          </div>
        ))}
      </div>

      {/* Resumen por categoría */}
      <div className="pt-3 border-t space-y-2" style={{ borderColor:'var(--color-border)' }}>
        <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-display)' }}>
          Por categoría
        </p>
        {Object.entries(resPorCat).map(([catId, datos]) => (
          <div key={catId} className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold truncate" style={{ fontFamily:'var(--font-display)', color: datos.color }}>
                {datos.label}
              </span>
              <span className="text-[10px]" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-muted)' }}>
                {datos.resps}/{datos.total}
              </span>
            </div>
            <div className="progress-bar h-1.5">
              <div className="progress-bar__fill"
                   style={{ width:`${(datos.resps/datos.total)*100}%`, background: datos.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
