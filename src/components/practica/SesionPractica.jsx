/* ============================================================
   DrivePrep+ — SesionPractica
   Interfaz de práctica activa: pregunta + controles + mini-mapa.
   Reutiliza los tipos interactivos del simulador.
   ============================================================ */
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Flag, Bookmark, BookmarkCheck } from 'lucide-react';
import { CATEGORIAS_PRACTICA } from '../../data/bancoPractica';
import TipoOpcionMultiple from '../simulador/tipos/TipoOpcionMultiple';
import TipoRelacionar     from '../simulador/tipos/TipoRelacionar';
import TipoOrdenar        from '../simulador/tipos/TipoOrdenar';
import TipoClasificar     from '../simulador/tipos/TipoClasificar';
import TipoCompletar      from '../simulador/tipos/TipoCompletar';

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

export default function SesionPractica({
  sesion, preguntaActual, totalPreguntas, respondidas, porcentajeAvanceSesion,
  onResponder, onAnterior, onSiguiente, onIrA, onFinalizar, onCerrar,
}) {
  const [marcadas,     setMarcadas]     = useState({});
  const [confirmar,    setConfirmar]    = useState(false);
  const [visible,      setVisible]      = useState(true);

  const { categoriaId, indicePregunta, respuestas } = sesion;
  const cat      = CATEGORIAS_PRACTICA[categoriaId];
  const tipoMeta = TIPO_META[preguntaActual?.tipo] || TIPO_META.opcion_multiple;
  const Comp     = COMPONENTES[preguntaActual?.tipo] || TipoOpcionMultiple;

  const toggleMarcada = (id) => setMarcadas((p) => ({ ...p, [id]: !p[id] }));

  const handleSiguiente = () => {
    setVisible(false);
    setTimeout(() => { onSiguiente(); setVisible(true); }, 100);
  };
  const handleAnterior = () => {
    setVisible(false);
    setTimeout(() => { onAnterior(); setVisible(true); }, 100);
  };
  const handleIrA = (i) => {
    setVisible(false);
    setTimeout(() => { onIrA(i); setVisible(true); }, 100);
  };

  const respActual = preguntaActual ? respuestas[preguntaActual.id] : undefined;
  const tieneResp  = respActual !== undefined && respActual !== null &&
    (Array.isArray(respActual) ? respActual.length > 0 :
     typeof respActual === 'object' ? Object.keys(respActual).length > 0 : true);

  const sinResponder = totalPreguntas - respondidas;

  return (
    <div className="page-enter space-y-0">

      {/* ── Topbar de práctica ── */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-5 py-3 -mx-5 lg:-mx-7 -mt-5 lg:-mt-7 mb-6"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {/* Categoría */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
               style={{ background: `${cat?.color}15` }}>
            {cat?.emoji}
          </div>
          <div>
            <p className="text-xs font-extrabold leading-none"
               style={{ fontFamily:'var(--font-display)', color: cat?.color }}>
              {cat?.label}
            </p>
            <p className="text-[10px]" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
              Práctica por temas
            </p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="flex-1 space-y-0.5 hidden sm:block">
          <div className="flex justify-between text-[10px]" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-muted)' }}>
            <span>{respondidas} de {totalPreguntas} respondidas</span>
            <span style={{ color: cat?.color, fontWeight:700 }}>{porcentajeAvanceSesion}%</span>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-bar__fill" style={{ width:`${porcentajeAvanceSesion}%`, background: cat?.color }} />
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setConfirmar(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold
                       border-2 transition-all duration-150"
            style={{ fontFamily:'var(--font-display)', borderColor: cat?.color, color: cat?.color }}
          >
            <Flag size={13} />
            <span className="hidden sm:inline">Finalizar</span>
          </button>
          <button onClick={onCerrar}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ── Grid principal: pregunta + mini-mapa ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-5 max-w-5xl mx-auto">

        {/* ── Tarjeta de pregunta ── */}
        <div
          className="card p-6 space-y-5 transition-all duration-200"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)' }}
        >
          {/* Cabecera */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background:`${cat?.color}15`, color: cat?.color, fontFamily:'var(--font-display)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat?.color }} />
                {cat?.label}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: tipoMeta.bg, color: tipoMeta.color, fontFamily:'var(--font-display)' }}>
                {tipoMeta.emoji} {tipoMeta.label}
              </span>
              {preguntaActual && (
                <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: preguntaActual.dificultad==='dificil'?'#fee2e2':preguntaActual.dificultad==='media'?'#fef3c7':'#d1fae5',
                        color:      preguntaActual.dificultad==='dificil'?'#dc2626':preguntaActual.dificultad==='media'?'#d97706':'#059669',
                        fontFamily: 'var(--font-body)',
                      }}>
                  {preguntaActual.dificultad}
                </span>
              )}
            </div>
            {preguntaActual && (
              <button
                onClick={() => toggleMarcada(preguntaActual.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                            transition-all duration-150 shrink-0
                            ${marcadas[preguntaActual.id] ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-500'}`}
                style={{ fontFamily:'var(--font-display)' }}
              >
                {marcadas[preguntaActual.id] ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                <span className="hidden sm:inline">{marcadas[preguntaActual.id] ? 'Marcada' : 'Marcar'}</span>
              </button>
            )}
          </div>

          {/* Número + barra inline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-md"
                    style={{ background:'#f1f5f9', color:'var(--color-text-muted)', fontFamily:'var(--font-display)' }}>
                {indicePregunta + 1} / {totalPreguntas}
              </span>
              <div className="flex-1 progress-bar h-1.5">
                <div className="progress-bar__fill"
                     style={{ width:`${((indicePregunta+1)/totalPreguntas)*100}%`, background: cat?.color }} />
              </div>
            </div>
            {preguntaActual && (
              <>
                <h2 className="text-lg font-bold leading-snug"
                    style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                  {preguntaActual.enunciado}
                </h2>
                {preguntaActual.instruccion && (
                  <p className="text-sm italic" style={{ color:'var(--color-text-secondary)', fontFamily:'var(--font-body)' }}>
                    💡 {preguntaActual.instruccion}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Componente interactivo */}
          {preguntaActual && (
            <Comp
              pregunta={preguntaActual}
              respuesta={respActual}
              onResponder={(val) => onResponder(preguntaActual.id, val)}
            />
          )}

          {/* Navegación */}
          <div className="flex items-center justify-between pt-3 border-t"
               style={{ borderColor:'var(--color-border)' }}>
            <button onClick={handleAnterior} disabled={indicePregunta === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                               border border-[var(--color-border)] hover:bg-gray-50
                               disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    style={{ fontFamily:'var(--font-display)', color:'var(--color-text-secondary)' }}>
              <ChevronLeft size={15} /> Anterior
            </button>

            <span className={`text-xs font-medium ${tieneResp ? 'text-green-600' : 'text-gray-400'}`}
                  style={{ fontFamily:'var(--font-body)' }}>
              {tieneResp ? '✓ Respondida' : 'Sin respuesta'}
            </span>

            {indicePregunta < totalPreguntas - 1 ? (
              <button onClick={handleSiguiente}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                                 bg-indigo-50 text-indigo-600 border border-indigo-200
                                 hover:bg-indigo-100 transition-all"
                      style={{ fontFamily:'var(--font-display)' }}>
                Siguiente <ChevronRight size={15} />
              </button>
            ) : (
              <button onClick={() => setConfirmar(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                                 text-white transition-all"
                      style={{ background: cat?.color, fontFamily:'var(--font-display)' }}>
                <Flag size={14} /> Finalizar
              </button>
            )}
          </div>
        </div>

        {/* ── Mini-mapa ── */}
        <div className="card p-4 space-y-3 lg:sticky lg:top-24 self-start">
          <h3 className="text-xs font-bold" style={{ fontFamily:'var(--font-display)' }}>Preguntas</h3>
          <div className="grid grid-cols-5 lg:grid-cols-4 gap-1.5">
            {sesion.preguntas.map((p, i) => {
              const resp   = respuestas[p.id];
              const tieneR = resp !== undefined && resp !== null &&
                (Array.isArray(resp) ? resp.length > 0 : typeof resp === 'object' ? Object.keys(resp).length > 0 : true);
              const esMarcada = !!marcadas[p.id];
              const esActual  = i === indicePregunta;

              let bg = '#f8fafc', color = '#94a3b8', border = '#e2e8f0';
              if (esActual)  { bg = cat?.color; color = '#fff'; border = cat?.color; }
              else if (esMarcada) { bg = '#fef3c7'; color = '#d97706'; border = '#fde68a'; }
              else if (tieneR)    { bg = '#f0fdf4'; color = '#15803d'; border = '#86efac'; }

              return (
                <button key={p.id} onClick={() => handleIrA(i)}
                        className="w-full aspect-square rounded-lg text-[10px] font-extrabold
                                   hover:scale-110 transition-transform duration-100"
                        style={{ background:bg, color, border:`1.5px solid ${border}`, fontFamily:'var(--font-display)' }}>
                  {i+1}
                </button>
              );
            })}
          </div>

          {/* Resumen */}
          <div className="pt-2 border-t space-y-1.5" style={{ borderColor:'var(--color-border)' }}>
            {[
              { label:'Respondidas',  v: respondidas,              color: cat?.color },
              { label:'Pendientes',   v: sinResponder,             color: '#94a3b8'  },
            ].map(({ label, v, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[10px]" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>{label}</span>
                <span className="text-xs font-extrabold" style={{ fontFamily:'var(--font-display)', color }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modal de confirmación ── */}
      {confirmar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background:'rgba(15,23,42,0.55)', backdropFilter:'blur(4px)' }}>
          <div className="card w-full max-w-sm p-6 space-y-5" style={{ animation:'fadeInUp 0.25s ease' }}>
            <div>
              <h2 className="text-base font-bold mb-1" style={{ fontFamily:'var(--font-display)' }}>
                ¿Terminar práctica?
              </h2>
              <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
                Has respondido <strong>{respondidas}</strong> de <strong>{totalPreguntas}</strong> preguntas.
                {sinResponder > 0 && ` ${sinResponder} quedará${sinResponder>1?'n':''} sin responder.`}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmar(false)}
                      className="btn-secondary flex-1 justify-center py-2.5">
                Continuar
              </button>
              <button onClick={() => { setConfirmar(false); onFinalizar(); }}
                      className="btn-primary flex-1 justify-center py-2.5"
                      style={{ background: cat?.color }}>
                <Flag size={14} /> Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
