/* ============================================================
   DrivePrep+ — ResultadoPractica
   Pantalla de resultados de una sesión de práctica por tema.
   ============================================================ */
import { useState } from 'react';
import { RotateCcw, Home, ChevronDown, ChevronUp, CheckCircle2, XCircle, Minus } from 'lucide-react';
import { ProgressRing } from '../ui/UIComponents';
import { CATEGORIAS_PRACTICA } from '../../data/bancoPractica';

const LETRAS = { a:'A', b:'B', c:'C', d:'D' };

function ItemRevision({ item, numero }) {
  const [abierto, setAbierto] = useState(false);

  const esCorrectaTotal = item.correcta;
  const omitida         = item.respuestaUsuario === undefined || item.respuestaUsuario === null;

  const iconoEstado = esCorrectaTotal
    ? <CheckCircle2 size={16} className="text-green-500 shrink-0" />
    : omitida
    ? <Minus size={16} className="text-gray-400 shrink-0" />
    : <XCircle size={16} className="text-red-500 shrink-0" />;

  return (
    <div className="border rounded-xl overflow-hidden"
         style={{ borderColor: esCorrectaTotal ? '#6ee7b7' : omitida ? '#e2e8f0' : '#fca5a5' }}>
      <button onClick={() => setAbierto((v) => !v)}
              className="w-full flex items-start gap-3 p-3.5 text-left hover:bg-gray-50 transition-colors">
        {iconoEstado}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold mb-0.5"
             style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-display)' }}>
            Pregunta {numero}
          </p>
          <p className="text-sm leading-snug"
             style={{ fontFamily:'var(--font-body)', color:'var(--color-text-primary)' }}>
            {item.enunciado}
          </p>
        </div>
        {abierto ? <ChevronUp size={15} className="text-gray-400 shrink-0 mt-0.5" />
                 : <ChevronDown size={15} className="text-gray-400 shrink-0 mt-0.5" />}
      </button>

      {abierto && (
        <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor:'var(--color-border)' }}>
          {/* Solo para opción múltiple mostramos opciones */}
          {item.tipo === 'opcion_multiple' && Array.isArray(item.opciones) && (
            <div className="pt-3 space-y-1.5">
              {item.opciones.map((op) => {
                const esCorrecta   = op.id === item.correcta;
                const esUsuario    = op.id === item.respuestaUsuario;
                const esIncorrecta = esUsuario && !esCorrecta;
                let estilo = 'bg-gray-50 border-gray-200 text-gray-600';
                if (esCorrecta)   estilo = 'bg-green-50 border-green-300 text-green-800';
                if (esIncorrecta) estilo = 'bg-red-50 border-red-300 text-red-800';
                return (
                  <div key={op.id} className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs ${estilo}`}>
                    <span className="font-extrabold shrink-0 w-4" style={{ fontFamily:'var(--font-display)' }}>
                      {LETRAS[op.id]}
                    </span>
                    <span style={{ fontFamily:'var(--font-body)' }}>{op.texto}</span>
                    {esCorrecta   && <CheckCircle2 size={13} className="ml-auto text-green-600 shrink-0 mt-0.5" />}
                    {esIncorrecta && <XCircle      size={13} className="ml-auto text-red-500 shrink-0 mt-0.5" />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Otros tipos: indicar si fue correcta */}
          {item.tipo !== 'opcion_multiple' && (
            <div className="pt-2">
              <p className="text-xs" style={{ fontFamily:'var(--font-body)', color: esCorrectaTotal ? '#059669' : '#dc2626' }}>
                {esCorrectaTotal ? '✓ Respuesta correcta' : omitida ? '— Sin responder' : '✗ Respuesta incorrecta o incompleta'}
              </p>
            </div>
          )}

          {/* Explicación */}
          {item.explicacion && (
            <div className="p-3 rounded-lg" style={{ background:'#f0f9ff', border:'1px solid #bae6fd' }}>
              <p className="text-[10px] font-bold mb-0.5" style={{ fontFamily:'var(--font-display)', color:'#0369a1' }}>
                💡 Explicación
              </p>
              <p className="text-xs leading-relaxed" style={{ fontFamily:'var(--font-body)', color:'#0c4a6e' }}>
                {item.explicacion}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════ */
export default function ResultadoPractica({ resultado, onReintentar, onVolver }) {
  const [tab, setTab] = useState('resumen'); // 'resumen' | 'revision'
  const cat = CATEGORIAS_PRACTICA[resultado.categoriaId];

  const colorAnillo = resultado.puntaje >= 70 ? '#10b981' : resultado.puntaje >= 50 ? '#f59e0b' : '#ef4444';
  const labelResult = resultado.puntaje >= 70 ? '¡Bien hecho!' : resultado.puntaje >= 50 ? 'Casi...' : 'Sigue practicando';
  const omitidas    = resultado.total - resultado.correctas - resultado.detalle.filter((d) => !d.correcta && d.respuestaUsuario !== undefined && d.respuestaUsuario !== null).length;

  return (
    <div className="page-enter max-w-2xl mx-auto space-y-5">

      {/* ── Resultado principal ── */}
      <div className="card p-7 text-center space-y-5"
           style={{ borderTop:`4px solid ${colorAnillo}` }}>

        <div className="text-3xl">{cat?.emoji}</div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1"
             style={{ fontFamily:'var(--font-display)', color: colorAnillo }}>
            {labelResult}
          </p>
          <h1 className="text-4xl font-black" style={{ fontFamily:'var(--font-display)' }}>
            {resultado.puntaje}%
          </h1>
          <p className="text-sm mt-1" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
            {cat?.label} · {resultado.fecha} {resultado.hora}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
          <ProgressRing porcentaje={resultado.puntaje} size={120} stroke={10} color={colorAnillo}>
            <div className="text-center">
              <p className="text-2xl font-extrabold" style={{ fontFamily:'var(--font-display)' }}>
                {resultado.puntaje}%
              </p>
              <p className="text-[10px]" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                aciertos
              </p>
            </div>
          </ProgressRing>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label:'Correctas',   v: resultado.correctas,                             color:'#10b981' },
              { label:'Incorrectas', v: resultado.detalle.filter((d) => !d.correcta && d.respuestaUsuario !== undefined).length, color:'#ef4444' },
              { label:'Omitidas',    v: resultado.detalle.filter((d) => d.respuestaUsuario === undefined || d.respuestaUsuario === null).length, color:'#94a3b8' },
              { label:'Total',       v: resultado.total,                                 color:'#6366f1' },
            ].map(({ label, v, color }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-extrabold" style={{ fontFamily:'var(--font-display)', color }}>{v}</p>
                <p className="text-[11px]" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="card overflow-hidden">
        <div className="flex border-b" style={{ borderColor:'var(--color-border)' }}>
          {[
            { id:'resumen', label:'Resumen' },
            { id:'revision', label:'Revisar respuestas' },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)}
                    className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all
                                ${tab===id ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    style={{ fontFamily:'var(--font-display)' }}>
              {label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'resumen' && (
            <div className="space-y-4">
              <h3 className="section-title">Tu rendimiento en esta sesión</h3>
              {[
                { label:'Respuestas correctas',   v: resultado.correctas, total: resultado.total, color:'#10b981' },
                { label:'Respuestas incorrectas', v: resultado.detalle.filter((d) => !d.correcta && d.respuestaUsuario !== undefined && d.respuestaUsuario !== null).length, total: resultado.total, color:'#ef4444' },
              ].map(({ label, v, total, color }) => {
                const pct = total > 0 ? Math.round((v/total)*100) : 0;
                return (
                  <div key={label} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span style={{ fontFamily:'var(--font-body)', color:'var(--color-text-primary)' }}>{label}</span>
                      <span className="font-bold" style={{ fontFamily:'var(--font-display)', color }}>
                        {v} <span className="text-xs font-normal text-gray-400">({pct}%)</span>
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar__fill" style={{ width:`${pct}%`, background: color }} />
                    </div>
                  </div>
                );
              })}

              {resultado.puntaje < 70 && (
                <div className="p-4 rounded-xl mt-2"
                     style={{ background:'#f0f9ff', border:'1px solid #bae6fd' }}>
                  <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'#0c4a6e' }}>
                    💡 <strong>Consejo:</strong> Revisa tus respuestas incorrectas en la pestaña de revisión y practica nuevamente esta categoría para mejorar.
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === 'revision' && (
            <div className="space-y-3">
              <h3 className="section-title">Revisión pregunta por pregunta</h3>
              {resultado.detalle.map((item, i) => (
                <ItemRevision key={item.id} item={item} numero={i+1} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Acciones ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onVolver}
                className="btn-secondary flex-1 justify-center py-3">
          <Home size={16} /> Volver a categorías
        </button>
        <button onClick={onReintentar}
                className="btn-primary flex-1 justify-center py-3"
                style={{ background: cat?.color }}>
          <RotateCcw size={16} /> Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
