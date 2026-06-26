/* ============================================================
   DrivePrep+ — SimuladorIntro (mejorado)
   Pantalla previa al examen con distribución de categorías.
   ============================================================ */
import { ClipboardList, Clock, CheckCircle2, Shuffle, ChevronRight,
         AlertTriangle, BookOpen, Gavel, Shield } from 'lucide-react';
import { CONFIG_SIMULACRO, CATEGORIAS } from '../../data/bancoPreguntasMTC';

const ICONOS_CAT = { senales: AlertTriangle, normas: BookOpen, infracciones: Gavel, seguridad: Shield };

const TIPOS_PREGUNTA = [
  { emoji:'🔘', label:'Opción múltiple',   desc:'Elige la respuesta correcta entre 4 opciones' },
  { emoji:'🔗', label:'Relacionar',        desc:'Conecta conceptos con sus definiciones'       },
  { emoji:'↕️', label:'Ordenar pasos',     desc:'Arrastra para poner en el orden correcto'      },
  { emoji:'📂', label:'Clasificar',        desc:'Arrastra elementos a su categoría'             },
  { emoji:'✏️', label:'Completar texto',   desc:'Rellena los espacios con las palabras correctas' },
];

export default function SimuladorIntro({ onIniciar }) {
  return (
    <div className="page-enter max-w-2xl mx-auto space-y-6">

      {/* Hero */}
      <div
        className="card p-8 text-center space-y-4 overflow-hidden relative"
        style={{ border: 'none', borderRadius: '20px', background: 'linear-gradient(135deg,#050311 0%,#0f0c29 30%,#1a1640 60%,#0d0b1e 100%)', animation: 'glowPulse 3s ease-in-out infinite' }}
      >
        {/* Canvas partículas */}
        <canvas
          ref={el => {
            if (!el) return;
            const ctx = el.getContext('2d');
            const resize = () => { el.width = el.offsetWidth; el.height = el.offsetHeight; };
            resize();
            const dots = Array.from({ length: 40 }, () => ({
              x: Math.random() * el.width, y: Math.random() * el.height,
              vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
              r: Math.random() * 1.4 + .4,
            }));
            function draw() {
              ctx.clearRect(0, 0, el.width, el.height);
              dots.forEach(d => {
                d.x += d.vx; d.y += d.vy;
                if (d.x < 0) d.x = el.width; if (d.x > el.width) d.x = 0;
                if (d.y < 0) d.y = el.height; if (d.y > el.height) d.y = 0;
                ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(139,92,246,.85)'; ctx.fill();
              });
              dots.forEach((a, i) => dots.slice(i + 1).forEach(b => {
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < 90) {
                  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                  ctx.strokeStyle = `rgba(99,102,241,${.3 * (1 - dist / 90)})`;
                  ctx.lineWidth = .5; ctx.stroke();
                }
              }));
              requestAnimationFrame(draw);
            }
            draw();
          }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .4, pointerEvents: 'none' }}
        />

        {/* Grid SVG + scanline */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            <pattern id="hgrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(99,102,241,.1)" strokeWidth=".5" />
            </pattern>
            <linearGradient id="hgm" x1="0" x2="1">
              <stop offset="0%" stopColor="black" /><stop offset="25%" stopColor="white" />
              <stop offset="75%" stopColor="white" /><stop offset="100%" stopColor="black" />
            </linearGradient>
            <mask id="hgridmask"><rect width="100%" height="100%" fill="url(#hgm)" /></mask>
            <linearGradient id="hscan" x1="0" x2="1">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="rgba(99,102,241,.45)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#hgrid)" mask="url(#hgridmask)" />
          <rect className="hero-scan" x="0" y="-2" width="100%" height="2" fill="url(#hscan)" />
        </svg>

        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,.2) 0%,transparent 70%)', pointerEvents: 'none', transform: 'translate(-60px,-80px)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,.18) 0%,transparent 70%)', pointerEvents: 'none', transform: 'translate(40px,60px)' }} />

        {/* Corner brackets */}
        {[{ t: '12px', l: '12px' }, { t: '12px', r: '12px' }, { b: '12px', l: '12px' }, { b: '12px', r: '12px' }].map((pos, i) => (
          <div key={i} style={{ position: 'absolute', top: pos.t, bottom: pos.b, left: pos.l, right: pos.r, width: '14px', height: '14px', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', [pos.b ? 'bottom' : 'top']: 0, [pos.r ? 'right' : 'left']: 0, width: '8px', height: '2px', background: '#6366f1', animation: `cornerBlink 2s infinite ${i * .5}s` }} />
            <div style={{ position: 'absolute', [pos.b ? 'bottom' : 'top']: 0, [pos.r ? 'right' : 'left']: 0, width: '2px', height: '8px', background: '#6366f1', animation: `cornerBlink 2s infinite ${i * .5}s` }} />
          </div>
        ))}

        {/* Ícono orb */}
        <div className="relative z-10 mx-auto" style={{ width: '72px', height: '72px', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: '-12px', borderRadius: '50%', border: '1px solid rgba(99,102,241,.35)', animation: 'spinSlow 10s linear infinite' }} />
          <div style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', border: '1px dashed rgba(139,92,246,.2)', animation: 'spinRev 16s linear infinite' }} />
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg,rgba(99,102,241,.3),rgba(139,92,246,.2))',
            border: '1px solid rgba(99,102,241,.6)',
            boxShadow: '0 0 24px rgba(99,102,241,.5),0 0 48px rgba(139,92,246,.25),inset 0 1px 0 rgba(255,255,255,.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'floatIcon 3s ease-in-out infinite',
          }}>
            <ClipboardList size={32} style={{ color: 'rgba(255,255,255,.95)', filter: 'drop-shadow(0 0 10px rgba(139,92,246,.9))' }} />
          </div>
        </div>

        {/* Textos */}
        <div className="relative z-10">
          <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)', textShadow: '0 0 24px rgba(139,92,246,.6)', animation: 'flicker 8s infinite 2s' }}>
            Simulador completo MTC
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22d3ee', display: 'inline-block', animation: 'pulseDot 1.8s infinite', boxShadow: '0 0 6px #22d3ee' }} />
            <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'rgba(199,210,254,.8)', margin: 0 }}>
              Examen inteligente · Preguntas únicas en cada intento
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex items-center justify-center gap-6 flex-wrap">
          {[
            { Ico: ClipboardList, val: `${CONFIG_SIMULACRO.cantidadPreguntas}`, label: 'Preguntas' },
            { Ico: Clock,         val: `${CONFIG_SIMULACRO.tiempoLimiteMinutos} min`, label: 'Tiempo' },
            { Ico: CheckCircle2,  val: `${CONFIG_SIMULACRO.puntajeAprobacion}%`, label: 'Para aprobar' },
            { Ico: Shuffle,       val: 'Mixto', label: 'Tipos de actividad' },
          ].map(({ Ico, val, label }) => (
            <div key={label} style={{ textAlign: 'center', padding: '8px 14px', borderRadius: '12px', background: 'rgba(99,102,241,.12)', border: '1px solid rgba(99,102,241,.25)', backdropFilter: 'blur(4px)' }}>
              <Ico size={13} style={{ color: '#a5b4fc', display: 'block', margin: '0 auto 4px' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 900, color: '#fff', margin: 0, textShadow: '0 0 12px rgba(139,92,246,.5)' }}>{val}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(165,180,252,.75)', margin: 0, letterSpacing: '.03em' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Distribución de categorías */}
      <div className="card p-5 space-y-3">
        <h2 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
          📊 Distribución del examen
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(CONFIG_SIMULACRO.distribucionCategorias).map(([catId, cantidad]) => {
            const cat  = CATEGORIAS[catId];
            const Ico  = ICONOS_CAT[catId] || ClipboardList;
            const pct  = Math.round((cantidad / CONFIG_SIMULACRO.cantidadPreguntas) * 100);
            return (
              <div key={catId} className="flex items-center gap-3 p-3 rounded-xl"
                   style={{ background:`${cat.color}08`, border:`1px solid ${cat.color}25` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                     style={{ background:`${cat.color}15` }}>
                  <Ico size={16} style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate" style={{ fontFamily:'var(--font-display)', color: cat.color }}>
                    {cat.label}
                  </p>
                  <p className="text-[11px]" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                    {cantidad} preguntas ({pct}%)
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tipos de actividad */}
      <div className="card p-5 space-y-3">
        <h2 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
          🎯 Tipos de actividad incluidos
        </h2>
        <div className="space-y-2">
          {TIPOS_PREGUNTA.map(({ emoji, label, desc }) => (
            <div key={label} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-lg shrink-0">{emoji}</span>
              <div>
                <p className="text-sm font-semibold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                  {label}
                </p>
                <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aviso de aleatoriedad */}
      <div className="flex items-start gap-3 p-4 rounded-xl"
           style={{ background:'#f0f9ff', border:'1px solid #bae6fd' }}>
        <Shuffle size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'#0c4a6e' }}>
          <strong>Examen único:</strong> Cada intento genera un examen diferente con preguntas
          seleccionadas aleatoriamente de cada categoría y en orden distinto.
        </p>
      </div>

      {/* Botón iniciar */}
      <button
        onClick={onIniciar}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', padding: '16px', fontSize: '1.05rem', fontWeight: 800,
          fontFamily: 'var(--font-display)', color: '#fff', border: 'none',
          borderRadius: '14px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg,#0f0c29 0%,#312e81 40%,#4338ca 70%,#6366f1 100%)',
          boxShadow: '0 0 24px rgba(99,102,241,.5),0 0 48px rgba(139,92,246,.25)',
          animation: 'glowPulse 3s ease-in-out infinite',
          letterSpacing: '.03em',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.015)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {/* scanline interna */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: '14px' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(165,180,252,.5),transparent)', animation: 'btnScan 2.5s linear infinite' }} />
        </div>
        {/* grid sutil */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '14px',
          backgroundImage: 'linear-gradient(rgba(99,102,241,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.07) 1px,transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
        {/* punto live */}
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px #22d3ee', animation: 'pulseDot 1.8s infinite', flexShrink: 0 }} />
        <span style={{ position: 'relative', zIndex: 1, textShadow: '0 0 16px rgba(139,92,246,.7)' }}>Comenzar examen</span>
        <ChevronRight size={20} style={{ position: 'relative', zIndex: 1 }} />
      </button>

      {/* Keyframes — en tu CSS global */}
      <style>{`
        @keyframes glowPulse {
          0%,100%{box-shadow:0 0 18px 4px rgba(99,102,241,.4),0 0 40px 8px rgba(139,92,246,.18)}
          50%{box-shadow:0 0 32px 8px rgba(99,102,241,.65),0 0 64px 18px rgba(139,92,246,.35)}
        }
        @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
        @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes spinRev{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
        @keyframes floatIcon{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:.6}94%{opacity:1}97%{opacity:.8}98%{opacity:1}}
        @keyframes cornerBlink{0%,100%{opacity:1}50%{opacity:.3}}
        .hero-scan{animation:heroScanAnim 3.5s linear infinite}
        @keyframes heroScanAnim{0%{transform:translateY(-4px)}100%{transform:translateY(300px)}}
        @keyframes btnScan{0%{top:-2px}100%{top:110%}}
      `}</style>
      <p className="text-center text-xs" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
        Una vez iniciado, el temporizador no se puede pausar.
      </p>
    </div>
  );
}
