/* ============================================================
   DrivePrep+ — TarjetaCategoria
   Card de categoría con progreso, porcentaje y botón.
   ============================================================ */
import { useState } from 'react';
import { ArrowRight, Zap } from 'lucide-react';

const META = {
  senales_preventivas:    { bg:'#fef3c7', emoji:'⚠️', color:'#f59e0b' },
  senales_reglamentarias: { bg:'#fee2e2', emoji:'🛑', color:'#ef4444' },
  senales_informativas:   { bg:'#eff6ff', emoji:'ℹ️', color:'#3b82f6' },
  normas_transito:        { bg:'#eef2ff', emoji:'📋', color:'#6366f1' },
  infracciones:           { bg:'#fdf2f8', emoji:'⚖️', color:'#ec4899' },
  primeros_auxilios:      { bg:'#ecfdf5', emoji:'🩺', color:'#10b981' },
  mecanica_basica:        { bg:'#f1f5f9', emoji:'🔧', color:'#64748b' },
  seguridad_vial:         { bg:'#f0f9ff', emoji:'🛡️', color:'#0ea5e9' },
};

const CAT_INDEX = {
  senales_preventivas:1, senales_reglamentarias:2, senales_informativas:3,
  normas_transito:4, infracciones:5, primeros_auxilios:6,
  mecanica_basica:7, seguridad_vial:8,
};

export default function TarjetaCategoria({ categoria, progresoCat, onPracticar }) {
  const [hover, setHover]       = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const { porcentajeAvance = 0, porcentajeAciertos = 0,
          preguntasRespondidas = 0, totalPreguntas = 10 } = progresoCat;

  const meta     = META[categoria.id] || { bg:'#f8fafc', emoji:'📚', color:'#6366f1' };
  const color    = categoria.color || meta.color;
  const iniciada = preguntasRespondidas > 0;
  const pct      = Math.round(porcentajeAvance);
  const idx      = CAT_INDEX[categoria.id] || 1;

  const colorBarra = iniciada
    ? porcentajeAciertos >= 70 ? '#10b981'
    : porcentajeAciertos >= 50 ? '#f59e0b'
    : '#ef4444'
    : color;

  return (
    <>
      <style>{`
        @keyframes shimmerBar {
          0%   { left:-10%; }
          100% { left:110%; }
        }
        @keyframes scanDown {
          0%   { top:-2px; }
          100% { top:102%; }
        }
        @keyframes pulseBracket {
          0%,100% { opacity:1; }
          50%      { opacity:.4; }
        }
        @keyframes glowPop {
          0%,100% { opacity:.7; }
          50%      { opacity:1; }
        }
      `}</style>

      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position:'relative', borderRadius:'18px', overflow:'hidden',
          minHeight:'230px', display:'flex', flexDirection:'column',
          background: hover
            ? `linear-gradient(145deg, ${color}10 0%, var(--color-background-primary) 60%)`
            : 'var(--color-background-primary)',
          border:`2px solid ${hover ? color : color+'45'}`,
          boxShadow: hover
            ? `0 0 0 1px ${color}30, 0 0 32px ${color}40, 0 8px 32px rgba(0,0,0,.1)`
            : `0 0 0 0 transparent, inset 0 0 0 0 transparent`,
          transform: hover ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
          transition:'all .3s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {/* ── Scan line animada (siempre activa) ── */}
        <div style={{
          position:'absolute', left:0, right:0, height:'2px', zIndex:3, pointerEvents:'none',
          background:`linear-gradient(90deg,transparent,${color},transparent)`,
          animation:'scanDown 3s linear infinite',
          opacity: hover ? .6 : .25,
        }}/>

        {/* ── Fondo grid HUD ── */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none', zIndex:0,
          backgroundImage:`linear-gradient(${color}12 1px,transparent 1px),linear-gradient(90deg,${color}12 1px,transparent 1px)`,
          backgroundSize:'24px 24px',
          opacity: hover ? 1 : 0,
          transition:'opacity .3s ease',
        }}/>

        {/* ── Glow blob esquina sup-der ── */}
        <div style={{
          position:'absolute', top:'-30px', right:'-30px', zIndex:0, pointerEvents:'none',
          width:'120px', height:'120px', borderRadius:'50%',
          background:`radial-gradient(circle,${color}35 0%,transparent 70%)`,
          animation:'glowPop 2.5s ease-in-out infinite',
          opacity: hover ? 1 : .5,
          transition:'opacity .3s',
        }}/>

        {/* ── Corner brackets grandes y visibles ── */}
        {[
          { top:'10px',    left:'10px',  borderTop:`2.5px solid ${color}`, borderLeft:`2.5px solid ${color}` },
          { top:'10px',    right:'10px', borderTop:`2.5px solid ${color}`, borderRight:`2.5px solid ${color}` },
          { bottom:'10px', left:'10px',  borderBottom:`2.5px solid ${color}`, borderLeft:`2.5px solid ${color}` },
          { bottom:'10px', right:'10px', borderBottom:`2.5px solid ${color}`, borderRight:`2.5px solid ${color}` },
        ].map((s, i) => (
          <div key={i} style={{
            position:'absolute', width:'14px', height:'14px', borderRadius:'2px', zIndex:2,
            animation:'pulseBracket 2s infinite',
            animationDelay:`${i * .3}s`,
            ...s,
          }}/>
        ))}

        {/* ── Contenido ── */}
        <div style={{ position:'relative', zIndex:1, padding:'20px 20px 12px', flex:1, display:'flex', flexDirection:'column' }}>

          {/* Row: emoji + chips */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'14px' }}>
            <div style={{
              width:'54px', height:'54px', borderRadius:'14px',
              background: meta.bg,
              border:`2px solid ${color}40`,
              boxShadow:`0 0 20px ${color}45, inset 0 1px 0 rgba(255,255,255,.6)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'26px',
              transition:'box-shadow .3s, transform .3s',
              transform: hover ? 'scale(1.08) rotate(-3deg)' : 'scale(1) rotate(0deg)',
            }}>
              {meta.emoji}
            </div>

            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'5px' }}>
              {/* CAT chip */}
              <span style={{
                fontSize:'9px', fontWeight:800, letterSpacing:'.18em', textTransform:'uppercase',
                color:'white', fontFamily:'monospace',
                background:`linear-gradient(90deg,${color},${color}cc)`,
                borderRadius:'5px', padding:'2px 8px',
                boxShadow:`0 2px 8px ${color}50`,
              }}>
                CAT-0{idx}
              </span>
              {/* % badge */}
              <span style={{
                fontSize:'12px', fontWeight:900, fontFamily:'monospace',
                color: pct > 0 ? 'white' : 'var(--color-text-muted)',
                background: pct > 0
                  ? `linear-gradient(135deg,${colorBarra},${colorBarra}bb)`
                  : 'rgba(156,163,175,.15)',
                border:`1px solid ${pct > 0 ? colorBarra+'60' : 'rgba(156,163,175,.3)'}`,
                borderRadius:'6px', padding:'2px 8px',
                boxShadow: pct > 0 ? `0 0 10px ${colorBarra}40` : 'none',
              }}>
                {pct}%
              </span>
            </div>
          </div>

          {/* Título */}
          <h3 style={{
            fontFamily:'var(--font-display)', fontWeight:800, fontSize:'14.5px',
            color:'var(--color-text-primary)', margin:'0 0 5px', lineHeight:1.3,
          }}>
            {categoria.label}
          </h3>

          {/* Descripción */}
          <p style={{
            fontFamily:'var(--font-body)', fontSize:'11.5px', lineHeight:1.55,
            color:'var(--color-text-secondary)', margin:0,
            display:'-webkit-box', WebkitLineClamp:2,
            WebkitBoxOrient:'vertical', overflow:'hidden',
          }}>
            {categoria.descripcion}
          </p>

          {/* ── Barra HUD ── */}
          <div style={{ marginTop:'auto', paddingTop:'14px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
              <span style={{
                fontFamily:'monospace', fontSize:'9px', fontWeight:700,
                letterSpacing:'.1em', textTransform:'uppercase',
                color: iniciada ? colorBarra : 'var(--color-text-muted)',
              }}>
                {iniciada ? `⚡ ${porcentajeAciertos}% aciertos` : '◦ sin iniciar'}
              </span>
              <span style={{ fontFamily:'monospace', fontSize:'9px', color, fontWeight:700 }}>
                {preguntasRespondidas}/{totalPreguntas}
              </span>
            </div>

            {/* Track */}
            <div style={{
              height:'6px', borderRadius:'4px', position:'relative',
              background:`${color}18`,
              border:`1px solid ${color}30`,
              overflow:'hidden',
            }}>
              {/* Fill */}
              <div style={{
                position:'absolute', top:0, left:0, bottom:0,
                width:`${pct}%`, minWidth: pct > 0 ? '10px' : '0',
                background:`linear-gradient(90deg,${colorBarra}80,${colorBarra})`,
                borderRadius:'4px',
                boxShadow:`0 0 10px ${colorBarra}80`,
                transition:'width .8s cubic-bezier(.4,0,.2,1)',
              }}/>
              {/* Shimmer */}
              {pct > 0 && (
                <div style={{
                  position:'absolute', top:0, bottom:0, width:'24px',
                  background:'linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent)',
                  animation:'shimmerBar 1.8s linear infinite',
                }}/>
              )}
            </div>
          </div>
        </div>

        {/* ── Botón ── */}
        <div style={{ position:'relative', zIndex:1, padding:'0 18px 18px' }}>
          <button
            onClick={() => onPracticar(categoria.id)}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              width:'100%', display:'flex', alignItems:'center', justifyContent:'center',
              gap:'8px', padding:'11px', borderRadius:'11px',
              background: btnHover
                ? `linear-gradient(90deg,${color},${color}cc)`
                : `${color}10`,
              border:`1.5px solid ${btnHover ? color : color+'60'}`,
              color: btnHover ? '#fff' : color,
              fontFamily:'var(--font-display)', fontSize:'13px', fontWeight:800,
              cursor:'pointer', position:'relative', overflow:'hidden',
              boxShadow: btnHover ? `0 0 24px ${color}50, 0 4px 12px ${color}30` : 'none',
              transition:'all .2s ease',
              letterSpacing:'.02em',
            }}
          >
            {/* scan top */}
            <div style={{
              position:'absolute', top:0, left:0, right:0, height:'1px',
              background:`linear-gradient(90deg,transparent,${btnHover ? '#fff' : color}70,transparent)`,
            }}/>
            <span style={{ fontFamily:'monospace', fontSize:'10px', opacity:.6 }}>{'[ '}</span>
            Practicar ahora
            <ArrowRight size={14}/>
            <span style={{ fontFamily:'monospace', fontSize:'10px', opacity:.6 }}>{' ]'}</span>
          </button>
        </div>
      </div>
    </>
  );
}