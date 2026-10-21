/* ============================================================
   DrivePrep+ — ResultadoSimulacro
   Pantalla de resultados: puntaje, análisis y revisión.
   ============================================================ */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, XCircle, Clock, BarChart2,
  RotateCcw, Home, ChevronDown, ChevronUp,
  Trophy, AlertTriangle,
} from 'lucide-react';
import { ProgressRing } from '../ui/UIComponents';
import ConfettiCanvas from '../ui/ConfettiCanvas';
import { CATEGORIAS } from '../../data/bancoPreguntasMTC';
import { sonidoAcierto, sonidoError } from '../../utils/audioFeedback';

/* ── Paleta de resultado compatible con Dark y Light Mode ── */
function usePaletaResultado(aprobado, puntaje) {
  if (aprobado) {
    return {
      bg: 'rgba(16, 185, 129, 0.15)',
      text: '#10b981',
      borde: 'rgba(16, 185, 129, 0.35)',
      icono: Trophy,
      label: '¡Aprobado para Licencia Clase A-I!',
      colorAnillo: '#10b981'
    };
  }
  if (puntaje >= 50) {
    return {
      bg: 'rgba(245, 158, 11, 0.15)',
      text: '#f59e0b',
      borde: 'rgba(245, 158, 11, 0.35)',
      icono: AlertTriangle,
      label: 'Por poco (requiere 35/40)',
      colorAnillo: '#f59e0b'
    };
  }
  return {
    bg: 'rgba(239, 68, 68, 0.15)',
    text: '#ef4444',
    borde: 'rgba(239, 68, 68, 0.35)',
    icono: XCircle,
    label: 'No aprobado (mínimo 35 aciertos)',
    colorAnillo: '#ef4444'
  };
}

/* ── Componente de revisión de pregunta ── */
function ItemRevision({ pregunta, respuestaUsuario, numero }) {
  const [expandida, setExpandida] = useState(false);
  const correcta   = respuestaUsuario === pregunta.correcta;
  const omitida    = !respuestaUsuario;

  const LETRAS = { a: 'A', b: 'B', c: 'C', d: 'D' };

  return (
    <div
      className="border rounded-xl overflow-hidden transition-all"
      style={{ borderColor: correcta ? 'rgba(16, 185, 129, 0.3)' : omitida ? 'var(--color-border)' : 'rgba(239, 68, 68, 0.3)' }}
    >
      {/* Encabezado de la pregunta */}
      <button
        onClick={() => setExpandida((v) => !v)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        {/* Indicador */}
        <div className="mt-0.5 shrink-0">
          {correcta ? (
            <CheckCircle2 size={18} className="text-emerald-500" />
          ) : omitida ? (
            <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300 dark:border-slate-600" />
          ) : (
            <XCircle size={18} className="text-rose-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}>
            Pregunta {numero} — {CATEGORIAS[pregunta.categoria]?.label}
          </p>
          <p className="text-sm font-medium leading-snug" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
            {pregunta.enunciado}
          </p>
        </div>

        <div className="shrink-0 mt-0.5 text-slate-400">
          {expandida ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Detalle expandido */}
      {expandida && (
        <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="pt-3 space-y-2">
            {pregunta.opciones.map((opcion) => {
              const esCorrecta    = opcion.id === pregunta.correcta;
              const esUsuario     = opcion.id === respuestaUsuario;
              const esIncorrecta  = esUsuario && !esCorrecta;

              let estilo = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
              if (esCorrecta)   estilo = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 font-medium';
              if (esIncorrecta) estilo = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200';

              return (
                <div
                  key={opcion.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${estilo}`}
                >
                  <span className="font-bold shrink-0 w-5" style={{ fontFamily: 'var(--font-display)' }}>
                    {LETRAS[opcion.id]}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)' }}>{opcion.texto}</span>
                  {esCorrecta && <CheckCircle2 size={15} className="ml-auto shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />}
                  {esIncorrecta && <XCircle size={15} className="ml-auto shrink-0 text-rose-500 mt-0.5" />}
                </div>
              );
            })}
          </div>

          {/* Explicación */}
          <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60">
            <p className="text-xs font-bold mb-1 text-sky-700 dark:text-sky-300" style={{ fontFamily: 'var(--font-display)' }}>
              💡 Explicación
            </p>
            <p className="text-xs leading-relaxed text-sky-900 dark:text-sky-200" style={{ fontFamily: 'var(--font-body)' }}>
              {pregunta.explicacion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════ */
export default function ResultadoSimulacro({ resultado, preguntas, respuestas, onReintentar }) {
  const navigate   = useNavigate();
  const [tabActiva, setTabActiva] = useState('resumen'); // 'resumen' | 'categorias' | 'revision'

  useEffect(() => {
    if (resultado.aprobado) {
      sonidoAcierto();
    } else {
      sonidoError();
    }
  }, [resultado.aprobado]);

  const paleta = usePaletaResultado(resultado.aprobado, resultado.puntaje);
  const IconoResultado = paleta.icono;

  const minutosUsados = Math.floor(resultado.tiempoUsadoSegundos / 60);
  const segundosUsados = resultado.tiempoUsadoSegundos % 60;
  const tiempoFormato = `${String(minutosUsados).padStart(2,'0')}:${String(segundosUsados).padStart(2,'0')}`;

  return (
    <div className="page-enter max-w-3xl mx-auto space-y-6 relative">
      {/* Confeti de celebración si aprobó el examen */}
      {resultado.aprobado && <ConfettiCanvas />}

      {/* ── Tarjeta de resultado principal ── */}
      <div
        className="card p-8 text-center space-y-5"
        style={{ borderTop: `4px solid ${paleta.colorAnillo}` }}
      >
        {/* Ícono de resultado */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: paleta.bg, border: `2px solid ${paleta.borde}` }}
        >
          <IconoResultado size={30} style={{ color: paleta.text }} />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold uppercase tracking-widest"
             style={{ fontFamily: 'var(--font-display)', color: paleta.text }}>
            {paleta.label}
          </p>
          <h1 className="text-4xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
            {resultado.puntaje}%
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
            {resultado.fecha} — {resultado.hora}
          </p>
        </div>

        {/* Anillo + stats */}
        <div className="flex flex-wrap items-center justify-center gap-8">
          <ProgressRing porcentaje={resultado.puntaje} size={120} stroke={10} color={paleta.colorAnillo}>
            <div className="text-center">
              <p className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
                {resultado.puntaje}%
              </p>
              <p className="text-[10px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                puntaje
              </p>
            </div>
          </ProgressRing>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Correctas',     valor: resultado.correctas,   color: '#10b981', icono: CheckCircle2 },
              { label: 'Incorrectas',   valor: resultado.incorrectas, color: '#ef4444', icono: XCircle },
              { label: 'Omitidas',      valor: resultado.omitidas,    color: '#94a3b8', icono: null },
              { label: 'Tiempo usado',  valor: tiempoFormato,         color: '#6366f1', icono: Clock },
            ].map(({ label, valor, color, icono: Icono }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-extrabold" style={{ fontFamily: 'var(--font-display)', color }}>
                  {valor}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Nota de aprobación */}
        <p className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Puntaje mínimo de aprobación: <strong>70%</strong>
          {resultado.porTiempo && ' · El examen finalizó por tiempo.'}
        </p>
      </div>

      {/* ── Tabs de análisis ── */}
      <div className="card overflow-hidden">

        {/* Tab bar */}
        <div className="flex border-b" style={{ borderColor: 'var(--color-border)' }}>
          {[
            { id: 'resumen',    label: 'Resumen',       icono: BarChart2     },
            { id: 'categorias', label: 'Por categoría', icono: AlertTriangle },
            { id: 'revision',   label: 'Revisar todo',  icono: CheckCircle2  },
          ].map(({ id, label, icono: Icono }) => (
            <button
              key={id}
              onClick={() => setTabActiva(id)}
              className={`
                flex items-center gap-2 flex-1 py-3.5 text-sm font-semibold
                border-b-2 transition-all duration-150
                ${tabActiva === id
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Icono size={15} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Contenido de tabs */}
        <div className="p-5">

          {/* ── Tab Resumen ── */}
          {tabActiva === 'resumen' && (
            <div className="space-y-4">
              <h3 className="section-title">Tu rendimiento general</h3>
              <div className="space-y-3">
                {[
                  { label: 'Respuestas correctas',   valor: resultado.correctas,   total: resultado.total, color: '#10b981' },
                  { label: 'Respuestas incorrectas',  valor: resultado.incorrectas, total: resultado.total, color: '#ef4444' },
                  { label: 'Preguntas omitidas',      valor: resultado.omitidas,    total: resultado.total, color: '#94a3b8' },
                ].map(({ label, valor, total, color }) => {
                  const pct = total > 0 ? Math.round((valor / total) * 100) : 0;
                  return (
                    <div key={label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>{label}</span>
                        <span className="font-bold" style={{ fontFamily: 'var(--font-display)', color }}>
                          {valor} <span className="text-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>({pct}%)</span>
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar__fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Tab Categorías ── */}
          {tabActiva === 'categorias' && (
            <div className="space-y-4">
              <h3 className="section-title">Rendimiento por categoría</h3>
              {resultado.porCategoria.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
                  No hay datos de categorías.
                </p>
              ) : (
                <div className="space-y-3">
                  {resultado.porCategoria.map((cat) => (
                    <div key={cat.categoriaId} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                          <span className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                            {cat.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs" style={{ fontFamily: 'var(--font-display)' }}>
                          <span className="text-green-600 font-bold">{cat.correctas}✓</span>
                          <span className="text-red-500 font-bold">{cat.incorrectas}✗</span>
                          <span className="font-extrabold" style={{ color: cat.porcentaje >= 70 ? '#10b981' : '#ef4444' }}>
                            {cat.porcentaje}%
                          </span>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-bar__fill"
                          style={{
                            width: `${cat.porcentaje}%`,
                            background: cat.porcentaje >= 70 ? '#10b981' : cat.porcentaje >= 50 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recomendación */}
              {resultado.porCategoria.length > 0 && (
                <div
                  className="mt-4 p-4 rounded-xl"
                  style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}
                >
                  <p className="text-xs font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: '#0369a1' }}>
                    💡 Recomendación
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: '#0c4a6e' }}>
                    Concéntrate en practicar{' '}
                    <strong>{resultado.porCategoria[0]?.label}</strong>
                    {' '}({resultado.porCategoria[0]?.porcentaje}% de aciertos), que es donde más necesitas mejorar.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Tab Revisión ── */}
          {tabActiva === 'revision' && (
            <div className="space-y-3">
              <h3 className="section-title">Revisión de respuestas</h3>
              {preguntas.map((pregunta, i) => (
                <ItemRevision
                  key={pregunta.id}
                  pregunta={pregunta}
                  respuestaUsuario={respuestas[pregunta.id]}
                  numero={i + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Acciones ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-secondary flex-1 justify-center py-3"
        >
          <Home size={17} /> Ir al inicio
        </button>
        <button
          onClick={onReintentar}
          className="btn-primary flex-1 justify-center py-3"
        >
          <RotateCcw size={17} /> Nuevo simulacro
        </button>
      </div>
    </div>
  );
}
