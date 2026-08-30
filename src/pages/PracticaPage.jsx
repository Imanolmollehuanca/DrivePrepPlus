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

        {/* Banner de motivación MTC */}
        <div className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[auto_1fr] gap-0 shadow-md border"
             style={{ borderColor:'var(--color-border)' }}>

          {/* Lado izquierdo */}
          <div className="relative p-7 flex flex-col justify-center overflow-hidden text-white"
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                minWidth: '260px',
              }}>

            {/* Punto de estado */}
            <div className="relative z-10 flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-100"
                    style={{ fontFamily: 'var(--font-display)' }}>
                DrivePrep+ MTC
              </span>
            </div>

            {/* Título */}
            <h2 className="relative z-10 text-xl font-extrabold leading-tight text-white"
                style={{ fontFamily: 'var(--font-display)' }}>
              ¡Sigue practicando!
            </h2>
            <p className="relative z-10 text-sm mt-1 max-w-[220px] text-sky-100/90"
              style={{ fontFamily: 'var(--font-body)' }}>
              La práctica constante es la clave para aprobar tu examen de manejo en el MTC.
            </p>

            {/* Botón */}
            <button onClick={() => navigate('/simuladores')}
                    className="relative z-10 mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-sky-900 bg-white hover:bg-sky-50 transition-all shadow-md self-start cursor-pointer"
                    style={{ fontFamily: 'var(--font-display)' }}>
              Iniciar simulador completo
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Resumen de actividad */}
          <div className="p-6" style={{ background: 'var(--color-card)' }}>
            <p className="text-sm font-bold mb-4" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
              Resumen de tu actividad
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label:'Preguntas practicadas', v: met.totalRespondidas,   color:'#0284c7', emoji:'📝' },
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
                    className="mt-4 text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    style={{ color:'#0284c7', fontFamily:'var(--font-display)' }}>
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