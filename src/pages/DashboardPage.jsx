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
  { id:'completo',     titulo:'Simulador completo', descripcion:'Examen tipo MTC',     icono:ClipboardList, color:'#6366f1', ruta:'/simuladores'  },
  { id:'temas',        titulo:'Práctica por temas',  descripcion:'Elige una categoría', icono:GraduationCap, color:'#10b981', ruta:'/practica'     },
  { id:'historial',    titulo:'Historial',           descripcion:'Tus simulacros',      icono:Target,        color:'#f59e0b', ruta:'/historial'    },
  { id:'estadisticas', titulo:'Mis estadísticas',    descripcion:'Revisa tu progreso',  icono:Brain,         color:'#8b5cf6', ruta:'/estadisticas' },
];

const ACCESOS_RAPIDOS = [
  { id:'recomendaciones', label:'Recomendaciones', icono:Lightbulb,  color:'#f59e0b', ruta:'/recomendaciones' },
  { id:'estadisticas',    label:'Estadísticas',    icono:Target,     color:'#8b5cf6', ruta:'/estadisticas'    },
  { id:'practica',        label:'Práctica',        icono:BookOpen,   color:'#6366f1', ruta:'/practica'        },
  { id:'historial',       label:'Historial',       icono:HelpCircle, color:'#10b981', ruta:'/historial'       },
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
      if (!acc[c.nombre]) acc[c.nombre] = { nombre:c.nombre, errores:0 };
      acc[c.nombre].errores += (c.total - c.correctas);
      return acc;
    }, {});
  const peorCategoria = Object.values(categoriasMasErrores).sort((a, b) => b.errores - a.errores)[0];
  const recomendacion = peorCategoria ? { tema: peorCategoria.nombre, mensaje: 'Practica esta categoría para mejorar tu puntaje.' } : { tema: null, mensaje: null };

  /* ── Categorías con más errores (para la barra) ── */
  const todasPorCategoria = entradas
    .filter((e) => e.porCategoria?.length)
    .flatMap((e) => e.porCategoria)
    .reduce((acc, c) => {
      if (!acc[c.nombre]) acc[c.nombre] = { nombre:c.nombre, correctas:0, total:0 };
      acc[c.nombre].correctas += c.correctas;
      acc[c.nombre].total     += c.total;
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

          {/* Banner hero */}
          <div
            className="card card-animated p-0 overflow-hidden"
            style={{
              position: 'relative',
              borderRadius: '16px',
              background: 'linear-gradient(135deg,#050311 0%,#0f0c29 30%,#1a1640 60%,#0d0b1e 100%)',
              border: '1px solid rgba(99,102,241,.5)',
              animation: 'glowPulse 3s ease-in-out infinite',
              minHeight: '110px',
            }}
          >
            {/* Canvas partículas */}
            <canvas
              ref={el => {
                if (!el) return;
                const ctx = el.getContext('2d');
                el.width = el.offsetWidth;
                el.height = el.offsetHeight;
                const dots = Array.from({ length: 38 }, () => ({
                  x: Math.random() * el.width, y: Math.random() * el.height,
                  vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
                  r: Math.random() * 1.5 + .5,
                }));
                function draw() {
                  ctx.clearRect(0, 0, el.width, el.height);
                  dots.forEach(d => {
                    d.x += d.vx; d.y += d.vy;
                    if (d.x < 0) d.x = el.width; if (d.x > el.width) d.x = 0;
                    if (d.y < 0) d.y = el.height; if (d.y > el.height) d.y = 0;
                    ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(139,92,246,.8)'; ctx.fill();
                  });
                  dots.forEach((a, i) => dots.slice(i + 1).forEach(b => {
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < 80) {
                      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                      ctx.strokeStyle = `rgba(99,102,241,${.25 * (1 - dist / 80)})`;
                      ctx.lineWidth = .5; ctx.stroke();
                    }
                  }));
                  requestAnimationFrame(draw);
                }
                draw();
              }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .35 }}
            />

            {/* Grid SVG */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <defs>
                <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(99,102,241,.12)" strokeWidth=".5" />
                </pattern>
                <linearGradient id="gm" x1="0" x2="1">
                  <stop offset="0%" stopColor="black" />
                  <stop offset="20%" stopColor="white" />
                  <stop offset="80%" stopColor="white" />
                  <stop offset="100%" stopColor="black" />
                </linearGradient>
                <mask id="gridmask"><rect width="100%" height="100%" fill="url(#gm)" /></mask>
                <linearGradient id="scanGrad" x1="0" x2="1">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="rgba(99,102,241,.5)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridmask)" />
              <rect className="scan-line" x="0" y="-2" width="100%" height="2" fill="url(#scanGrad)" />
            </svg>

            {/* Glow orbs */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,.22) 0%,transparent 70%)', pointerEvents: 'none', transform: 'translate(-40px,-60px)' }} />
            <div style={{ position: 'absolute', bottom: 0, right: '80px', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,.18) 0%,transparent 70%)', pointerEvents: 'none', transform: 'translate(0,40px)' }} />

            {/* Corner brackets */}
            {[
              { top: '10px', left: '10px' },
              { top: '10px', right: '10px' },
              { bottom: '10px', left: '10px' },
              { bottom: '10px', right: '10px' },
            ].map((pos, i) => (
              <div key={i} style={{ position: 'absolute', ...pos, width: '14px', height: '14px', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: pos.bottom ? undefined : 0, bottom: pos.bottom ? 0 : undefined, left: pos.right ? undefined : 0, right: pos.right ? 0 : undefined, width: '8px', height: '2px', background: '#6366f1', animation: `cornerBlink 2s infinite ${i * .5}s` }} />
                <div style={{ position: 'absolute', top: pos.bottom ? undefined : 0, bottom: pos.bottom ? 0 : undefined, left: pos.right ? undefined : 0, right: pos.right ? 0 : undefined, width: '2px', height: '8px', background: '#6366f1', animation: `cornerBlink 2s infinite ${i * .5}s` }} />
              </div>
            ))}

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 2, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                {/* Badge vivo */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                  <div style={{ position: 'relative', width: '8px', height: '8px' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#22d3ee', animation: 'pulseDot 1.8s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', inset: '-3px', borderRadius: '50%', border: '1px solid rgba(34,211,238,.4)', animation: 'pulseDot 1.8s ease-in-out infinite .3s' }} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#22d3ee', fontFamily: 'monospace', animation: 'flicker 6s infinite' }}>
                    DrivePrep+
                  </span>
                  <span style={{ fontSize: '9px', color: 'rgba(99,102,241,.7)', fontFamily: 'monospace' }}>v2.4.1</span>
                </div>

                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', margin: '0 0 6px', textShadow: '0 0 20px rgba(139,92,246,.7),0 0 40px rgba(99,102,241,.4)', fontFamily: 'var(--font-display)', animation: 'flicker 8s infinite 2s' }}>
                  {simulacrosRealizados === 0 ? '¡Comienza tu primer simulacro!' : `${simulacrosRealizados} simulacros completados`}
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6366f1' }} />
                  <p style={{ fontSize: '.8rem', color: 'rgba(199,210,254,.75)', fontFamily: 'monospace', margin: 0 }}>
                    {simulacrosRealizados === 0 ? 'Practica con preguntas reales del MTC.' : `Promedio actual: ${promedio}%`}
                  </p>
                </div>

                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <div style={{ background: 'rgba(99,102,241,.12)', border: '1px solid rgba(99,102,241,.35)', borderRadius: '6px', padding: '3px 10px', fontSize: '10px', fontFamily: 'monospace', color: '#a5b4fc', letterSpacing: '.05em' }}>MTC CERT</div>
                  <div style={{ background: 'rgba(34,211,238,.08)', border: '1px solid rgba(34,211,238,.3)', borderRadius: '6px', padding: '3px 10px', fontSize: '10px', fontFamily: 'monospace', color: '#67e8f9', letterSpacing: '.05em' }}>LIVE</div>
                </div>
              </div>

              {/* Orb ícono */}
              <div style={{ flexShrink: 0, position: 'relative', width: '88px', height: '88px' }}>
                <div style={{ position: 'absolute', inset: '-14px', borderRadius: '50%', border: '1px solid rgba(99,102,241,.3)', animation: 'spinSlow 10s linear infinite' }} />
                <div style={{ position: 'absolute', inset: '-22px', borderRadius: '50%', border: '1px dashed rgba(139,92,246,.18)', animation: 'spinRev 16s linear infinite' }} />
                <div style={{ position: 'absolute', inset: '-30px', borderRadius: '50%', border: '1px solid rgba(99,102,241,.08)', animation: 'spinSlow 22s linear infinite' }} />
                <div style={{
                  width: '88px', height: '88px', borderRadius: '50%',
                  background: 'linear-gradient(135deg,rgba(99,102,241,.25),rgba(139,92,246,.15))',
                  border: '1px solid rgba(99,102,241,.6)',
                  boxShadow: '0 0 20px rgba(99,102,241,.4),0 0 40px rgba(139,92,246,.2),inset 0 1px 0 rgba(255,255,255,.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'floatIcon 3s ease-in-out infinite',
                }}>
                  <ClipboardList size={36} style={{ color: 'rgba(255,255,255,.92)', filter: 'drop-shadow(0 0 8px rgba(139,92,246,.9)) drop-shadow(0 0 16px rgba(99,102,241,.6))' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Keyframes — agregar en tu CSS global o <style> */}
          <style>{`
            @keyframes glowPulse {
              0%,100%{box-shadow:0 0 18px 4px rgba(99,102,241,.35),0 0 40px 8px rgba(139,92,246,.15)}
              50%{box-shadow:0 0 28px 8px rgba(99,102,241,.55),0 0 60px 16px rgba(139,92,246,.3)}
            }
            @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
            @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            @keyframes spinRev { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
            @keyframes floatIcon { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
            @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:.6} 94%{opacity:1} 97%{opacity:.8} 98%{opacity:1} }
            @keyframes cornerBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
            .scan-line { animation: scanAnim 3s linear infinite; }
            @keyframes scanAnim { 0%{transform:translateY(-4px)} 100%{transform:translateY(200px)} }
          `}</style>

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
