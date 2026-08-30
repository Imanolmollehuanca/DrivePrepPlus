/* ============================================================
   DrivePrep+ — DashboardPage
   100% datos dinámicos desde useHistorial + useAuth.
   Sin datos estáticos de ejemplo.
   ============================================================ */

import { useState }      from 'react';
import { useNavigate }   from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  ClipboardList, GraduationCap, Target, Brain,
  BookOpen, Gavel, Lightbulb, HelpCircle,
} from 'lucide-react';

import { useAuth     } from '../context/AuthContext';
import { useIdioma   } from '../context/IdiomaContext';
import { useHistorial } from '../hooks/useHistorial';
import {
  ProgressRing, ModuleCard, CategoryBar, QuickAccessCard, EmptyState,
} from '../components/ui/UIComponents';

/* ── Módulos del dashboard ── */
const MODULOS = [
  { id:'completo',     titulo:'Simulador completo', descripcion:'Examen tipo MTC (40 preguntas)', icono:ClipboardList, color:'#0284c7', ruta:'/simuladores'  },
  { id:'temas',        titulo:'Práctica por temas',  descripcion:'Práctica guiada por categoría', icono:GraduationCap, color:'#10b981', ruta:'/practica'     },
  { id:'historial',    titulo:'Historial',           descripcion:'Tus intentos y resultados',     icono:Target,        color:'#f59e0b', ruta:'/historial'    },
  { id:'estadisticas', titulo:'Mis estadísticas',    descripcion:'Seguimiento de tu rendimiento', icono:Brain,         color:'#0ea5e9', ruta:'/estadisticas' },
];

const ACCESOS_RAPIDOS = [
  { id:'recomendaciones', label:'Recomendaciones', icono:Lightbulb,  color:'#f59e0b', ruta:'/recomendaciones' },
  { id:'estadisticas',    label:'Estadísticas',    icono:Target,     color:'#0ea5e9', ruta:'/estadisticas'    },
  { id:'practica',        label:'Práctica',        icono:BookOpen,   color:'#10b981', ruta:'/practica'        },
  { id:'historial',       label:'Historial',       icono:HelpCircle, color:'#0284c7', ruta:'/historial'       },
];

/* ── Tooltip gráfico ── */
const TooltipGrafico = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 shadow-lg border text-sm"
         style={{ background:'var(--color-card)', borderColor:'var(--color-border)', fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
      <p className="text-xs mb-0.5" style={{ color:'var(--color-text-muted)' }}>{label}</p>
      <p className="font-bold">{payload[0].value}%</p>
    </div>
  );
};
//Comienza tu primer simulacro
/* ── Saludo según la hora ── */
function obtenerSaludo(t) {
  const h = new Date().getHours();
  if (h < 12) return t('dash_saludo_manana');
  if (h < 19) return t('dash_saludo_tarde');
  return t('dash_saludo_noche');
}

/* ════════════════════════════════════════════ */
export default function DashboardPage() {
  const { usuario } = useAuth();
  const { t }       = useIdioma();
  const navigate    = useNavigate();
  const [filtroTiempo, setFiltroTiempo] = useState('7d');

  const { entradas, metricas } = useHistorial();

  /* ── Métricas del historial ── */
  const simulacrosRealizados = metricas.simulacrosRealizados || 0;
  const promedio             = metricas.promedioPuntaje      || 0;
  const mejorPuntaje         = metricas.mejorPuntaje         || 0;

  /* ── Datos del gráfico de evolución ── */
  const FILTROS_MS = { '7d': 7*864e5, '30d': 30*864e5, '90d': 90*864e5 };
  const ahora = Date.now();
  const umbral = ahora - (FILTROS_MS[filtroTiempo] || FILTROS_MS['7d']);
  const entradasFiltradas = entradas.filter((e) => e.tipo === 'simulacro_completo' && e.fechaTs > umbral);
  const evolucion = entradasFiltradas.map((e) => ({ fecha: e.fecha, puntaje: e.puntaje })).slice(0, 15);

  /* ── Último simulacro ── */
  const ultimoSim = entradas.find((e) => e.tipo === 'simulacro_completo') || null;
  const badgeResultado = ultimoSim
    ? ultimoSim.aprobado
      ? { texto: t('hist_aprobado'),    clase:'badge-success' }
      : { texto: t('hist_desaprobado'), clase:'badge-danger'  }
    : null;

/* ── Recomendación ── */
  const categoriasMasErrores = entradas
    .filter((e) => e.porCategoria?.length)
    .flatMap((e) => e.porCategoria)
    .reduce((acc, c) => {
      if (!acc[c.label]) acc[c.label] = { nombre:c.label, errores:0 };
      acc[c.label].errores += (c.total - c.correctas);
      return acc;
    }, {});
  const peorCategoria = Object.values(categoriasMasErrores).sort((a, b) => b.errores - a.errores)[0];
  const recomendacion = peorCategoria ? { tema: peorCategoria.nombre, mensaje: 'Practica esta categoría para mejorar tu puntaje.' } : { tema: null, mensaje: null };

  /* ── Categorías con más errores (para la barra) ── */
  const todasPorCategoria = entradas
    .filter((e) => e.porCategoria?.length)
    .flatMap((e) => e.porCategoria)
    .reduce((acc, c) => {
      if (!acc[c.label]) acc[c.label] = { nombre:c.label, correctas:0, total:0 };
      acc[c.label].correctas += c.correctas;
      acc[c.label].total     += c.total;
      return acc;
    }, {});
  const categorias = Object.values(todasPorCategoria)
    .map((c) => ({ nombre: c.nombre, porcentajeAcierto: c.total ? Math.round((c.correctas/c.total)*100) : 0 }))
    .sort((a, b) => a.porcentajeAcierto - b.porcentajeAcierto)
    .slice(0, 4)
    .map((c) => ({
      ...c,
      color: c.porcentajeAcierto < 50 ? '#ef4444' : c.porcentajeAcierto < 70 ? '#f59e0b' : '#10b981',
    }));

  const FILTROS_TIEMPO_LOCAL = [
    { valor:'7d',  label:'Últimos 7 días'  },
    { valor:'30d', label:'Últimos 30 días' },
    { valor:'90d', label:'Últimos 3 meses' },
  ];

  return (
    <div className="page-enter space-y-6">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-extrabold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
          {obtenerSaludo(t)}, <span style={{ color:'var(--color-primary)' }}>{usuario?.nombre || 'Usuario'}</span> 👋
        </h1>
        <p className="text-sm mt-0.5" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
          {t('dash_subtitulo')}
        </p>
      </div>

      {/* Layout dos columnas */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* Columna izquierda */}
        <div className="space-y-5">

          {/* Banner hero MTC */}
          <div
            className="rounded-2xl p-6 sm:p-7 relative overflow-hidden text-white shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #0c4a6e 100%)',
            }}
          >
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-sky-100 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Balotario Oficial MTC Perú 2026</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold leading-tight" style={{ fontFamily:'var(--font-display)' }}>
                {simulacrosRealizados === 0
                  ? '¡Prepárate para aprobar tu examen del MTC en el primer intento!'
                  : `¡Llevas ${simulacrosRealizados} ${simulacrosRealizados === 1 ? 'simulacro completado' : 'simulacros completados'}!`}
              </h2>

              <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-medium">
                Evaluación oficial de 40 preguntas | Duración: 40 minutos | Mínimo 35 aciertos (87.5%) para aprobar la Licencia Clase A-I.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/simuladores')}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-white text-sky-900 hover:bg-sky-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                  style={{ fontFamily:'var(--font-display)' }}
                >
                  <span>🚀 Iniciar Simulacro Oficial</span>
                </button>
                <button
                  onClick={() => navigate('/practica')}
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm border border-white/20 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                  style={{ fontFamily:'var(--font-display)' }}
                >
                  <span>📖 Practicar por Temas</span>
                </button>
              </div>
            </div>

            {/* Ilustración de fondo sutil */}
            <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none hidden sm:block">
              <ClipboardList size={220} className="text-white" />
            </div>
          </div>

          {/* Módulos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MODULOS.map((mod) => (
              <ModuleCard key={mod.id} titulo={mod.titulo} descripcion={mod.descripcion}
                          icono={mod.icono} color={mod.color} onClick={() => navigate(mod.ruta)} />
            ))}
          </div>

          {/* Tu progreso */}
          <div className="card card-animated p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="section-title mb-0">{t('dash_progreso')}</h3>
              <button className="link-action" onClick={() => navigate('/estadisticas')}>
                {t('dash_ver_stats')}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <ProgressRing porcentaje={promedio} size={90} stroke={7} color="#6366f1">
                <div className="text-center">
                  <p className="text-lg font-extrabold leading-none"
                     style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                    {promedio > 0 ? `${promedio}%` : '—'}
                  </p>
                  <p className="text-[9px] mt-0.5" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                    {t('dash_rendimiento')}
                  </p>
                </div>
              </ProgressRing>
              <div className="flex flex-wrap gap-6">
                {[
                  { label: t('dash_sim_realizados'), valor: simulacrosRealizados },
                  { label: t('dash_promedio'),       valor: promedio > 0 ? `${promedio}%` : '—' },
                  { label: t('dash_mejor_puntaje'),  valor: mejorPuntaje > 0 ? `${mejorPuntaje}%` : '—' },
                ].map(({ label, valor }) => (
                  <div key={label}>
                    <p className="text-[11px] font-medium mb-1" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>{label}</p>
                    <p className="text-xl font-extrabold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>{valor}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-secondary)' }}>
                  {t('dash_evolucion')}
                </p>
                <select value={filtroTiempo} onChange={(e) => setFiltroTiempo(e.target.value)}
                        className="text-xs border rounded-lg px-2 py-1.5 outline-none"
                        style={{ borderColor:'var(--color-border)', color:'var(--color-text-secondary)', fontFamily:'var(--font-body)', background:'var(--color-card)' }}>
                  {FILTROS_TIEMPO_LOCAL.map((f) => <option key={f.valor} value={f.valor}>{f.label}</option>)}
                </select>
              </div>
              {evolucion.length === 0 ? (
                <EmptyState mensaje={t('dash_sin_evolucion')} />
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={evolucion} margin={{ top:5, right:8, left:-20, bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="fecha" tick={{ fontSize:11, fontFamily:'var(--font-body)', fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0,100]} tick={{ fontSize:11, fontFamily:'var(--font-body)', fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<TooltipGrafico />} />
                    <Line type="monotone" dataKey="puntaje" stroke="#6366f1" strokeWidth={2.5}
                          dot={{ fill:'#6366f1', r:3 }} activeDot={{ r:5 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Categorías con más errores */}
          <div className="card card-animated p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="section-title mb-0">{t('dash_categorias')}</h3>
              <button className="link-action" onClick={() => navigate('/estadisticas')}>{t('dash_ver_todas')}</button>
            </div>
            {categorias.length === 0 ? (
              <EmptyState mensaje={t('dash_sin_categorias')} icono={Target} />
            ) : (
              <div className="space-y-3">
                {categorias.map((cat) => <CategoryBar key={cat.nombre} {...cat} />)}
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-5">

          {/* Recomendación */}
          <div className="card card-animated p-5 space-y-4" style={{ borderTop:'3px solid #8b5cf6' }}>
            <div className="flex items-start justify-between gap-2">
              <h3 className="section-title mb-0 text-sm">{t('dash_recomendacion')}</h3>
              <Brain size={20} className="text-purple-400 shrink-0 mt-0.5" />
            </div>
            {recomendacion.tema ? (
              <>
                <div>
                  <p className="text-xs" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>{t('dash_reforzar')}</p>
                  <p className="font-bold text-base mt-0.5" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>{recomendacion.tema}</p>
                  {recomendacion.mensaje && (
                    <p className="text-xs mt-1" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>{recomendacion.mensaje}</p>
                  )}
                </div>
                <button className="btn-primary w-full justify-center text-sm py-2.5"
                        style={{ background:'linear-gradient(90deg,#7c3aed,#8b5cf6)' }}
                        onClick={() => navigate('/practica')}>
                  {t('dash_practicar')}
                </button>
              </>
            ) : (
              <EmptyState mensaje={t('dash_primer_sim')} icono={Brain} />
            )}
          </div>

          {/* Último simulacro */}
          <div className="card card-animated p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="section-title mb-0 text-sm">{t('dash_ultimo_sim')}</h3>
              {badgeResultado && <span className={`badge ${badgeResultado.clase}`}>{badgeResultado.texto}</span>}
            </div>
            {ultimoSim ? (
              <>
                <div className="flex justify-center py-2">
                  <ProgressRing porcentaje={ultimoSim.puntaje} size={110} stroke={9}
                                color={ultimoSim.aprobado ? '#10b981' : '#ef4444'}>
                    <div className="text-center">
                      <p className="text-2xl font-extrabold leading-none" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                        {ultimoSim.puntaje}%
                      </p>
                      <p className="text-[9px] mt-0.5" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>Puntaje</p>
                    </div>
                  </ProgressRing>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: t('hist_correctas'),   valor:ultimoSim.correctas,   color:'#10b981', bg:'#d1fae5' },
                    { label: t('hist_incorrectas'),  valor:ultimoSim.incorrectas, color:'#ef4444', bg:'#fee2e2' },
                    { label: t('hist_total'),         valor:ultimoSim.total,       color:'#6366f1', bg:'#e0e7ff' },
                  ].map(({ label, valor, color, bg }) => (
                    <div key={label} className="py-2 px-1 rounded-xl" style={{ background: bg }}>
                      <p className="text-xl font-extrabold" style={{ fontFamily:'var(--font-display)', color }}>{valor}</p>
                      <p className="text-[10px] mt-0.5" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>{label}</p>
                    </div>
                  ))}
                </div>
                {ultimoSim.fecha && (
                  <p className="text-xs text-center" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                    {ultimoSim.fecha} — {ultimoSim.hora}
                  </p>
                )}
                <button className="btn-secondary w-full justify-center text-sm py-2.5" onClick={() => navigate('/historial')}>
                  {t('dash_ver_resultado')}
                </button>
              </>
            ) : (
              <EmptyState mensaje={t('dash_sin_sim')} icono={ClipboardList} />
            )}
          </div>

          {/* Acceso rápido */}
          <div className="card card-animated p-5">
            <h3 className="section-title text-sm">{t('dash_acceso_rapido')}</h3>
            <div className="grid grid-cols-4 gap-1">
              {ACCESOS_RAPIDOS.map((item) => (
                <QuickAccessCard key={item.id} label={item.label} icono={item.icono}
                                 color={item.color} onClick={() => navigate(item.ruta)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
