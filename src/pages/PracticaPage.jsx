/* ============================================================
   DrivePrep+ — PracticaPage (Fase 3 completa)
   Módulo "Práctica por temas":
   · Listado de categorías con progreso real
   · Panel lateral: progreso general + temas débiles + historial
   · Sesión de práctica activa con tipos interactivos
   · Pantalla de resultados con revisión
   ============================================================ */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, BarChart2, CheckCircle2, Clock,
  ChevronRight, ArrowRight, AlertTriangle,
  Target, TrendingUp,
} from 'lucide-react';

import { CATEGORIAS_PRACTICA }                   from '../data/bancoPractica';
import { usePractica, leerHistorialPractica }     from '../hooks/usePractica';
import { usePremium }                             from '../context/PremiumContext';
import { ProgressRing }                           from '../components/ui/UIComponents';
import TarjetaCategoria                           from '../components/practica/TarjetaCategoria';
import SesionPractica                             from '../components/practica/SesionPractica';
import ResultadoPractica                          from '../components/practica/ResultadoPractica';

/* ── Vista: Listado principal de categorías ── */
function VistaCategorias({ progresoCat, metricas, historial, onPracticar }) {
  const navigate   = useNavigate();
  const met        = metricas();
  const cats       = Object.values(CATEGORIAS_PRACTICA);
  const totalCats  = cats.length;
  const catsIniciadas = cats.filter((c) => (progresoCat(c.id).preguntasRespondidas > 0)).length;
  const pctGeneral    = totalCats > 0 ? Math.round((catsIniciadas / totalCats) * 100) : 0;

  return (
    <div className="page-enter grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

      {/* ── Columna principal ── */}
      <div className="space-y-6">

        {/* Encabezado */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
               style={{ background:'#6366f115' }}>
            <BookOpen size={24} style={{ color:'#6366f1' }} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold" style={{ fontFamily:'var(--font-display)' }}>
              Práctica por temas
            </h1>
            <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
              Elige una categoría para practicar y reforzar tus conocimientos.
            </p>
          </div>
        </div>

        {/* Grid de categorías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          {cats.map((cat) => (
            <TarjetaCategoria
              key={cat.id}
              categoria={cat}
              progresoCat={progresoCat(cat.id)}
              onPracticar={onPracticar}
            />
          ))}
        </div>

        {/* Banner de motivación */}
        <div className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[auto_1fr] gap-0"
            style={{ boxShadow: '0 10px 40px rgba(99,102,241,0.25)' }}>

          {/* Lado izquierdo — tech/futurista (versión robusta) */}
          <div className="relative p-8 flex flex-col justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
                minWidth: '260px',
              }}>

            {/* Grid pattern de fondo */}
            <div className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }} />

            {/* Glow superior derecho — usando box-shadow en vez de blur para máxima compatibilidad */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
                  opacity: 0.6,
                }} />

            {/* Glow inferior izquierdo */}
            <div className="absolute -bottom-20 -left-16 w-52 h-52 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
                  opacity: 0.4,
                }} />

            {/* Línea de "scan" — bien visible, color brillante, animación CSS pura */}
            <div className="absolute top-0 left-0 w-full h-[3px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, #22d3ee 20%, #c084fc 50%, #22d3ee 80%, transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'scanline 2.5s linear infinite',
                }} />

            {/* Punto pulsante de estado "online" */}
            <div className="relative z-10 flex items-center gap-2 mb-3">
              <span className="relative flex items-center justify-center w-2 h-2">
                <span className="absolute w-2 h-2 rounded-full bg-emerald-400" />
                <span className="absolute w-2 h-2 rounded-full bg-emerald-400" style={{ animation: 'ping-slow 2s cubic-bezier(0,0,0.2,1) infinite' }} />
              </span>
              <span className="text-[10px] font-bold uppercase"
                    style={{ color: '#a5b4fc', fontFamily: 'var(--font-display)', letterSpacing: '0.15em' }}>
                DrivePrep+
              </span>
            </div>

            {/* Ícono con borde brillante */}
            <div className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border-2"
                style={{
                  background: 'rgba(129,140,248,0.2)',
                  borderColor: '#a78bfa',
                  boxShadow: '0 0 20px rgba(167,139,250,0.6)',
                }}>
              <Target size={22} color="#e0e7ff" />
            </div>

            {/* Título con degradado de texto */}
            <h2 className="relative z-10 text-xl font-extrabold leading-tight"
                style={{
                  fontFamily: 'var(--font-display)',
                  background: 'linear-gradient(90deg, #ffffff, #a5b4fc)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}>
              ¡Sigue practicando!
            </h2>
            <p className="relative z-10 text-sm mt-1 max-w-[220px]"
              style={{ color: '#c7d2fe', fontFamily: 'var(--font-body)' }}>
              La práctica constante es la clave para aprobar tu examen teórico del MTC.
            </p>

            {/* Botón con gradiente animado */}
            <button onClick={() => navigate('/simuladores')}
                    className="relative z-10 mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white self-start transition-transform hover:scale-105"
                    style={{
                      fontFamily: 'var(--font-display)',
                      background: 'linear-gradient(90deg, #6366f1, #a855f7, #06b6d4)',
                      boxShadow: '0 4px 20px rgba(168,85,247,0.5)',
                    }}>
              Iniciar simulador completo
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Resumen de actividad */}
          <div className="p-6" style={{ background: '#ffffff' }}>
            <p className="text-sm font-bold mb-4" style={{ fontFamily:'var(--font-display)' }}>
              Resumen de tu actividad
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label:'Preguntas practicadas', v: met.totalRespondidas,   color:'#6366f1', emoji:'📝' },
                { label:'Respuestas correctas',  v: met.totalCorrectas,     color:'#10b981', emoji:'✅' },
                { label:'Promedio de aciertos',  v: `${met.promedioAciertos}%`, color:'#f59e0b', emoji:'🎯' },
                { label:'Tiempo de práctica',    v: `${met.totalTiempoMin} min`, color:'#0ea5e9', emoji:'⏱️' },
              ].map(({ label, v, color, emoji }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl mb-1">{emoji}</div>
                  <p className="text-xl font-extrabold" style={{ fontFamily:'var(--font-display)', color }}>{v}</p>
                  <p className="text-[11px]" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>{label}</p>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/estadisticas')}
                    className="mt-4 text-xs font-semibold flex items-center gap-1"
                    style={{ color:'#6366f1', fontFamily:'var(--font-display)' }}>
              Ver estadísticas detalladas <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Panel lateral ── */}
      <div className="space-y-5">

        {/* Progreso general */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
            Tu progreso general
          </h3>

          {/* Anillo */}
          <div className="flex justify-center">
            <ProgressRing porcentaje={met.promedioAciertos} size={110} stroke={10} color="#6366f1">
              <div className="text-center">
                <p className="text-2xl font-extrabold" style={{ fontFamily:'var(--font-display)' }}>
                  {met.promedioAciertos}%
                </p>
                <p className="text-[10px]" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                  Completado
                </p>
              </div>
            </ProgressRing>
          </div>

          {/* Mini stats */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor:'var(--color-border)' }}>
            {[
              { label:'Preguntas respondidas', v: met.totalRespondidas, color:'#6366f1' },
              { label:'Respuestas correctas',  v: met.totalCorrectas,   color:'#10b981' },
              { label:'Promedio de aciertos',  v:`${met.promedioAciertos}%`, color:'#f59e0b' },
            ].map(({ label, v, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-xs" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
                    {label}
                  </span>
                </div>
                <span className="text-sm font-extrabold" style={{ fontFamily:'var(--font-display)', color }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Temas más débiles */}
        {met.temasDebiles.length > 0 && (
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
                Tus temas más débiles
              </h3>
              <button className="text-xs font-semibold"
                      style={{ color:'#6366f1', fontFamily:'var(--font-display)' }}>
                Ver detalle
              </button>
            </div>

            <div className="space-y-3">
              {met.temasDebiles.map((tema) => (
                <div key={tema.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm"
                           style={{ background:`${tema.color}15` }}>
                        {tema.emoji}
                      </div>
                      <span className="text-xs font-semibold truncate max-w-[120px]"
                            style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                        {tema.label}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold ml-2 shrink-0"
                          style={{ fontFamily:'var(--font-display)', color: tema.color }}>
                      {tema.porcentaje}%
                    </span>
                  </div>
                  <div className="progress-bar h-1.5">
                    <div className="progress-bar__fill"
                         style={{ width:`${tema.porcentaje}%`, background: tema.color }} />
                  </div>
                  <p className="text-[10px]" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                    {tema.correctas}/{tema.respondidas} correctas
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onPracticar(met.temasDebiles[0]?.id)}
              className="btn-primary w-full justify-center py-2.5 text-xs"
              style={{ background:'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
            >
              Practicar temas débiles →
            </button>
          </div>
        )}

        {/* Actividad reciente */}
        {historial.length > 0 && (
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
                Actividad reciente
              </h3>
              <button className="text-xs font-semibold"
                      style={{ color:'#6366f1', fontFamily:'var(--font-display)' }}>
                Ver todo
              </button>
            </div>

            <div className="space-y-3">
              {historial.slice(0, 4).map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                       style={{ background:`${h.categoriaColor}15` }}>
                    {h.categoriaEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate"
                       style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                      {h.categoriaLabel}
                    </p>
                    <p className="text-[10px]"
                       style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                      {h.fecha}
                    </p>
                  </div>
                  <span className="text-sm font-extrabold shrink-0"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: h.puntaje >= 70 ? '#10b981' : h.puntaje >= 50 ? '#f59e0b' : '#ef4444',
                        }}>
                    {h.puntaje}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sin historial: CTA vacío */}
        {historial.length === 0 && met.totalRespondidas === 0 && (
          <div className="card p-5 text-center space-y-3">
            <Target size={32} className="mx-auto text-gray-300" />
            <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
              Aquí verás tu progreso después de completar tu primera sesión de práctica.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════ */
export default function PracticaPage() {
  const {
    sesion, progresoCat, metricas,
    preguntaActual, totalPreguntas, respondidas, porcentajeAvanceSesion,
    iniciarPractica: _iniciarPractica, responder, irA, siguiente, anterior,
    finalizarPractica, reiniciar, cerrarSesion,
  } = usePractica();

  const { registrarPractica } = usePremium();

  const iniciarPractica = (catId) => {
    const permitido = registrarPractica();
    if (permitido) _iniciarPractica(catId);
  };

  const historial = useMemo(leerHistorialPractica, [sesion]);

  /* ── Vista: Resultado ── */
  if (sesion?.finalizada && sesion?.resultado) {
    return (
      <div className="max-w-2xl mx-auto">
        <ResultadoPractica
          resultado={sesion.resultado}
          onReintentar={reiniciar}
          onVolver={cerrarSesion}
        />
      </div>
    );
  }

  /* ── Vista: Sesión activa ── */
  if (sesion && !sesion.finalizada) {
    return (
      <SesionPractica
        sesion={sesion}
        preguntaActual={preguntaActual}
        totalPreguntas={totalPreguntas}
        respondidas={respondidas}
        porcentajeAvanceSesion={porcentajeAvanceSesion}
        onResponder={responder}
        onAnterior={anterior}
        onSiguiente={siguiente}
        onIrA={irA}
        onFinalizar={finalizarPractica}
        onCerrar={cerrarSesion}
      />
    );
  }

  /* ── Vista: Listado de categorías scroll── */
  return (
    <VistaCategorias
      progresoCat={progresoCat}
      metricas={metricas}
      historial={historial}
      onPracticar={iniciarPractica}
    />
  );
}