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
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
               style={{ background:'rgba(2,132,199,0.1)', borderColor:'rgba(2,132,199,0.2)' }}>
            <BookOpen size={24} style={{ color:'#0284c7' }} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
              Práctica por temas
            </h1>
            <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
              Elige una categoría del Balotario MTC para practicar y reforzar tus conocimientos.
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

        {/* Banner de motivación y Resumen */}
        <div className="card overflow-hidden grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] border border-slate-200 dark:border-slate-800 shadow-lg rounded-2xl">

          {/* Lado izquierdo — Banner de motivación */}
          <div
            className="relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #1e3a8a 100%)',
            }}
          >
            {/* Grid pattern sutil de fondo */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Glows ambientales */}
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none opacity-40"
              style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full pointer-events-none opacity-30"
              style={{ background: 'radial-gradient(circle, #0284c7 0%, transparent 70%)' }}
            />

            <div className="relative z-10">
              {/* Badge superior */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold tracking-wider uppercase text-sky-100 font-display">
                  DrivePrep+ MTC
                </span>
              </div>

              {/* Título y descripción */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight font-display tracking-tight">
                ¡Sigue practicando!
              </h2>
              <p className="text-sm text-sky-100/90 font-body mt-2 leading-relaxed max-w-md">
                La práctica constante y el repaso por categorías son la clave para aprobar tu examen teórico del MTC a la primera.
              </p>
            </div>

            {/* Botón CTA */}
            <div className="relative z-10 mt-6 pt-2">
              <button
                onClick={() => navigate('/simuladores')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-sky-950 bg-white hover:bg-sky-50 active:scale-[0.98] transition-all shadow-md font-display"
              >
                <span>Iniciar simulador completo</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Lado derecho — Resumen de actividad compatible con Dark Mode */}
          <div
            className="p-6 sm:p-7 flex flex-col justify-between border-t lg:border-t-0 lg:border-l"
            style={{
              background: 'var(--color-card)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-sm font-bold font-display"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Resumen de tu actividad
                </p>
                <span className="badge badge-primary text-[10px]">
                  En tiempo real
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: 'Preguntas practicadas',
                    v: met.totalRespondidas,
                    icono: BookOpen,
                    numColor: 'text-sky-600 dark:text-sky-400',
                    iconBg: 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30',
                    tileBorder: 'border-sky-500/20 dark:border-sky-500/30 hover:border-sky-500/50',
                    tileBg: 'bg-sky-500/[0.03] dark:bg-sky-500/[0.08]',
                  },
                  {
                    label: 'Respuestas correctas',
                    v: met.totalCorrectas,
                    icono: CheckCircle2,
                    numColor: 'text-emerald-600 dark:text-emerald-400',
                    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
                    tileBorder: 'border-emerald-500/20 dark:border-emerald-500/30 hover:border-emerald-500/50',
                    tileBg: 'bg-emerald-500/[0.03] dark:bg-emerald-500/[0.08]',
                  },
                  {
                    label: 'Promedio de aciertos',
                    v: `${met.promedioAciertos}%`,
                    icono: Target,
                    numColor: 'text-amber-600 dark:text-amber-400',
                    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
                    tileBorder: 'border-amber-500/20 dark:border-amber-500/30 hover:border-amber-500/50',
                    tileBg: 'bg-amber-500/[0.03] dark:bg-amber-500/[0.08]',
                  },
                  {
                    label: 'Tiempo de práctica',
                    v: `${met.totalTiempoMin} min`,
                    icono: Clock,
                    numColor: 'text-cyan-600 dark:text-cyan-400',
                    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
                    tileBorder: 'border-cyan-500/20 dark:border-cyan-500/30 hover:border-cyan-500/50',
                    tileBg: 'bg-cyan-500/[0.03] dark:bg-cyan-500/[0.08]',
                  },
                ].map(({ label, v, icono: Icono, numColor, iconBg, tileBorder, tileBg }) => (
                  <div
                    key={label}
                    className={`p-3.5 rounded-xl border transition-all duration-200 ${tileBorder} ${tileBg} hover:-translate-y-0.5 hover:shadow-sm`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-sm ${iconBg}`}>
                        <Icono size={15} />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-body leading-tight truncate">
                        {label}
                      </span>
                    </div>
                    <p className={`text-xl sm:text-2xl font-extrabold font-display leading-none tracking-tight ${numColor}`}>
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => navigate('/estadisticas')}
                className="link-action text-xs font-bold inline-flex items-center gap-1.5 hover:gap-2 transition-all font-display text-sky-500 hover:text-sky-600"
              >
                <span>Ver estadísticas detalladas</span>
                <ArrowRight size={13} />
              </button>
            </div>
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
            <ProgressRing porcentaje={met.promedioAciertos} size={110} stroke={10} color="#0284c7">
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
              { label:'Preguntas respondidas', v: met.totalRespondidas, color:'#0284c7' },
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
              <button className="text-xs font-semibold text-sky-500 hover:underline"
                      style={{ fontFamily:'var(--font-display)' }}>
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
              className="btn-primary w-full justify-center py-2.5 text-xs text-white"
              style={{ background:'linear-gradient(90deg, #0284c7, #0369a1)' }}
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
              <button className="text-xs font-semibold text-sky-500 hover:underline"
                      style={{ fontFamily:'var(--font-display)' }}>
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