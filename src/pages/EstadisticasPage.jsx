/* ============================================================
   DrivePrep+ — EstadisticasPage
   Dashboard de estadísticas: rendimiento general, evolución,
   categorías, fortalezas/debilidades, resumen de actividad.
   TODO Fase 4: GET /api/estadisticas/:userId?periodo=
   ============================================================ */
import { useState, useMemo }           from 'react';
import { useNavigate }                  from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell,
} from 'recharts';
import {
  BarChart2, TrendingUp, TrendingDown, Trophy,
  AlertTriangle, CheckCircle2, Target, Clock,
  BookOpen, ClipboardList, ChevronDown,
} from 'lucide-react';
import { ProgressRing }                 from '../components/ui/UIComponents';
import { useHistorial, formatearTiempo } from '../hooks/useHistorial';
import { leerHistorialPractica }         from '../hooks/usePractica';
import { CATEGORIAS_PRACTICA }           from '../data/bancoPractica';

/* ── Tooltip personalizado del gráfico ── */
const TooltipGrafico = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2.5 shadow-lg border text-sm"
         style={{ background:'var(--color-card)', borderColor:'var(--color-border)', fontFamily:'var(--font-display)' }}>
      <p className="text-xs mb-0.5" style={{ color:'var(--color-text-muted)' }}>{label}</p>
      <p className="font-extrabold" style={{ color:'#6366f1' }}>{payload[0].value}%</p>
    </div>
  );
};

/* ── Tarjeta de fortaleza/debilidad ── */
function TarjetaInsight({ tipo, label, descripcion, color }) {
  const esFortaleza = tipo === 'fortaleza';
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl"
         style={{ background: esFortaleza ? '#f0fdf4' : '#fff7ed', border: `1px solid ${esFortaleza ? '#bbf7d0' : '#fed7aa'}` }}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
           style={{ background: esFortaleza ? '#dcfce7' : '#ffedd5' }}>
        {esFortaleza
          ? <CheckCircle2 size={15} className="text-green-600" />
          : <AlertTriangle size={14} className="text-orange-500" />
        }
      </div>
      <div>
        <p className="text-sm font-bold" style={{ fontFamily:'var(--font-display)', color: esFortaleza ? '#15803d' : '#9a3412' }}>
          {label}
        </p>
        <p className="text-xs mt-0.5" style={{ fontFamily:'var(--font-body)', color: esFortaleza ? '#166534' : '#7c2d12' }}>
          {descripcion}
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════ */
export default function EstadisticasPage() {
  const navigate = useNavigate();
  const { entradas, metricas }  = useHistorial();
  const [periodo, setPeriodo]   = useState('30d');
  const [grafMetrica, setGrafMetrica] = useState('puntaje');

  /* ── Estadísticas de práctica por temas ── */
  const histPractica = useMemo(leerHistorialPractica, []);

  /* ── Evolución de rendimiento (línea temporal) ── */
  const evolucion = useMemo(() => {
    const simulacros = entradas
      .filter((e) => e.tipo === 'simulacro_completo')
      .slice(0, 10)
      .reverse();
    return simulacros.map((s, i) => ({
      label: `Simulacro ${i + 1}\n${s.fecha}`,
      puntaje: s.puntaje,
      correctas: s.correctas,
    }));
  }, [entradas]);

  /* ── Rendimiento por categoría (de simulacros completos) ── */
  const rendimientoCats = useMemo(() => {
    const simulacros = entradas.filter((e) => e.tipo === 'simulacro_completo' && e.porCategoria?.length > 0);
    if (simulacros.length === 0) return [];
    const mapa = {};
    simulacros.forEach((s) => {
      s.porCategoria.forEach((cat) => {
        if (!mapa[cat.label]) mapa[cat.label] = { label: cat.label, color: cat.color, totalCorr: 0, totalQ: 0 };
        mapa[cat.label].totalCorr += cat.correctas || 0;
        mapa[cat.label].totalQ   += cat.total     || 0;
      });
    });
    return Object.values(mapa).map((c) => ({
      ...c,
      porcentaje: c.totalQ > 0 ? Math.round((c.totalCorr / c.totalQ) * 100) : 0,
      fraccion: `${c.totalCorr}/${c.totalQ}`,
    })).sort((a, b) => b.porcentaje - a.porcentaje);
  }, [entradas]);

  /* ── Fortalezas y debilidades ── */
  const { fortalezas, debilidades } = useMemo(() => {
    const f = rendimientoCats.filter((c) => c.porcentaje >= 75).slice(0, 3);
    const d = [...rendimientoCats].sort((a, b) => a.porcentaje - b.porcentaje).filter((c) => c.porcentaje < 70).slice(0, 3);
    return { fortalezas: f, debilidades: d };
  }, [rendimientoCats]);

  /* ── Tiempo total formateado ── */
  const tiempoTotal = useMemo(() => {
    const seg = metricas.tiempoTotalSegundos || 0;
    const h   = Math.floor(seg / 3600);
    const m   = Math.floor((seg % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m} min`;
    return '—';
  }, [metricas]);

  /* ── Tendencia vs período anterior ── */
  const tendencia = useMemo(() => {
    if (evolucion.length < 2) return null;
    const primero = evolucion[0]?.puntaje || 0;
    const ultimo  = evolucion[evolucion.length - 1]?.puntaje || 0;
    const delta   = ultimo - primero;
    return { delta, sube: delta >= 0 };
  }, [evolucion]);

  const promAverage = metricas.promedioPuntaje;

  return (
    <div className="page-enter space-y-6 max-w-7xl mx-auto">

      {/* ── Encabezado ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background:'#eef2ff' }}>
            <BarChart2 size={24} style={{ color:'#6366f1' }} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold" style={{ fontFamily:'var(--font-display)' }}>
              Estadísticas
            </h1>
            <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
              Analiza tu rendimiento y mejora tus resultados.
            </p>
          </div>
        </div>

        {/* Selector de período */}
        <div className="relative">
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}
                  className="flex items-center gap-2 pl-4 pr-8 py-2 rounded-xl border text-sm font-semibold
                             outline-none appearance-none cursor-pointer"
                  style={{ fontFamily:'var(--font-display)', borderColor:'var(--color-border)', background:'var(--color-card)', color:'var(--color-text-primary)' }}>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 3 meses</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </div>

      {/* ── Fila superior: Rendimiento general + Gráfico ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">

        {/* Rendimiento general */}
        <div className="card p-6 flex flex-col gap-5">
          <h2 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
            Rendimiento general
          </h2>
          <div className="flex justify-center">
            <ProgressRing porcentaje={promAverage} size={130} stroke={11}
                          color={promAverage >= 70 ? '#6366f1' : promAverage >= 50 ? '#f59e0b' : '#ef4444'}>
              <div className="text-center">
                <p className="text-3xl font-black" style={{ fontFamily:'var(--font-display)' }}>
                  {promAverage > 0 ? `${promAverage}%` : '—'}
                </p>
                <p className="text-[11px]" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                  Promedio general
                </p>
              </div>
            </ProgressRing>
          </div>

          {/* Tendencia */}
          {tendencia && (
            <div className="flex items-center gap-2">
              {tendencia.sube
                ? <TrendingUp size={16} className="text-green-500" />
                : <TrendingDown size={16} className="text-red-500" />
              }
              <span className="text-sm font-semibold"
                    style={{ fontFamily:'var(--font-display)', color: tendencia.sube ? '#059669' : '#dc2626' }}>
                {tendencia.sube ? '+' : ''}{tendencia.delta}% vs inicio
              </span>
            </div>
          )}

          {/* Logro */}
          {promAverage >= 70 && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl"
                 style={{ background:'#fef3c7', border:'1px solid #fde68a' }}>
              <Trophy size={16} className="text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'#92400e' }}>
                <strong>¡Buen trabajo!</strong> Tu promedio supera el mínimo de aprobación.
              </p>
            </div>
          )}
          {promAverage > 0 && promAverage < 70 && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl"
                 style={{ background:'#eff6ff', border:'1px solid #bfdbfe' }}>
              <Target size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'#1e40af' }}>
                Sigue practicando. Necesitas llegar al <strong>70%</strong> para aprobar.
              </p>
            </div>
          )}
          {promAverage === 0 && (
            <p className="text-xs text-center" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
              Realiza tu primer simulacro para ver tu rendimiento.
            </p>
          )}
        </div>

        {/* Gráfico de evolución */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
              Evolución de tu rendimiento
            </h2>
            <div className="flex gap-2">
              {[
                { val:'puntaje',   label:'Simulacros realizados' },
              ].map(({ val, label }) => (
                <button key={val} onClick={() => setGrafMetrica(val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                                    ${grafMetrica===val ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-[var(--color-border)] text-gray-500'}`}
                        style={{ fontFamily:'var(--font-display)' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {evolucion.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <BarChart2 size={36} className="text-gray-200" />
              <p className="text-sm text-center" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                Realiza simulacros para ver tu evolución aquí.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={evolucion} margin={{ top:8, right:8, left:-20, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize:10, fontFamily:'var(--font-body)', fill:'#94a3b8' }}
                       axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{ fontSize:10, fontFamily:'var(--font-body)', fill:'#94a3b8' }}
                       axisLine={false} tickLine={false} />
                <Tooltip content={<TooltipGrafico />} />
                <ReferenceLine y={70} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5}
                               label={{ value:'70% mínimo', position:'right', fontSize:10, fill:'#10b981' }} />
                <Line type="monotone" dataKey="puntaje" stroke="#6366f1" strokeWidth={2.5}
                      dot={{ fill:'#6366f1', r:4, strokeWidth:2, stroke:'#fff' }}
                      activeDot={{ r:6 }}
                      label={{ position:'top', fontSize:11, fontFamily:'var(--font-display)', fill:'#6366f1', fontWeight:700 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Fila media: categorías + fortalezas/debilidades ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

        {/* Rendimiento por categorías */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
            Rendimiento por categorías
          </h2>

          {rendimientoCats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <ClipboardList size={36} className="text-gray-200" />
              <p className="text-sm text-center" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                Completa simulacros para ver tu rendimiento por categoría.
              </p>
              <button onClick={() => navigate('/simuladores')}
                      className="btn-primary text-sm py-2 px-5">
                Ir a simuladores
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {rendimientoCats.map((cat) => {
                const colorBarra = cat.porcentaje >= 75 ? '#10b981' : cat.porcentaje >= 60 ? '#f59e0b' : '#ef4444';
                const nivelLabel = cat.porcentaje >= 75 ? 'Muy bueno' : cat.porcentaje >= 60 ? 'Bueno' : 'Regular';
                const nivelColor = cat.porcentaje >= 75 ? '#059669' : cat.porcentaje >= 60 ? '#d97706' : '#dc2626';
                return (
                  <div key={cat.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                             style={{ background:`${cat.color || '#6366f1'}15` }}>
                          <div className="w-2 h-2 rounded-full" style={{ background: cat.color || '#6366f1' }} />
                        </div>
                        <span className="text-sm font-semibold"
                              style={{ fontFamily:'var(--font-body)', color:'var(--color-text-primary)' }}>
                          {cat.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{ background:`${nivelColor}15`, color: nivelColor, fontFamily:'var(--font-display)' }}>
                          {nivelLabel}
                        </span>
                        <span className="text-base font-extrabold"
                              style={{ fontFamily:'var(--font-display)', color: colorBarra }}>
                          {cat.porcentaje}%
                        </span>
                      </div>
                    </div>
                    <div className="progress-bar h-2">
                      <div className="progress-bar__fill transition-all duration-700"
                           style={{ width:`${cat.porcentaje}%`, background: colorBarra }} />
                    </div>
                    <p className="text-[11px]" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                      {cat.fraccion} correctas
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Fortalezas y debilidades */}
        <div className="space-y-5">
          {/* Fortalezas */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-yellow-500" />
              <h2 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>Fortalezas</h2>
            </div>
            {fortalezas.length > 0 ? (
              fortalezas.map((f) => (
                <TarjetaInsight key={f.label} tipo="fortaleza" label={f.label}
                                descripcion={`Tienes un excelente dominio en este tema (${f.porcentaje}%).`}
                                color={f.color} />
              ))
            ) : (
              <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                Tus fortalezas aparecerán aquí al completar simulacros.
              </p>
            )}
          </div>

          {/* Debilidades */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-500" />
              <h2 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>Debilidades</h2>
            </div>
            {debilidades.length > 0 ? (
              debilidades.map((d) => (
                <TarjetaInsight key={d.label} tipo="debilidad" label={d.label}
                                descripcion={`Requiere más práctica. Solo ${d.porcentaje}% de aciertos.`}
                                color={d.color} />
              ))
            ) : (
              <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                {rendimientoCats.length > 0
                  ? '¡Excelente! No tienes categorías con bajo rendimiento.'
                  : 'Completa simulacros para identificar tus áreas de mejora.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Resumen de actividad ── */}
      <div className="card p-6 space-y-4">
        <h2 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
          Resumen de actividad
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {[
            { icono:ClipboardList, label:'Simulacros realizados', v: metricas.simulacrosRealizados || 0, color:'#6366f1', bg:'#eef2ff' },
            { icono:CheckCircle2,  label:'Preguntas respondidas', v: metricas.totalRespondidas     || 0, color:'#10b981', bg:'#ecfdf5' },
            { icono:Target,        label:'Respuestas correctas',  v: metricas.totalCorrectas       || 0, color:'#f59e0b', bg:'#fef3c7' },
            { icono:Clock,         label:'Tiempo total de práctica', v: tiempoTotal,                    color:'#ef4444', bg:'#fef2f2' },
          ].map(({ icono:Ico, label, v, color, bg }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background:bg }}>
                <Ico size={22} style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold" style={{ fontFamily:'var(--font-display)', color }}>{v}</p>
                <p className="text-xs mt-0.5" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
