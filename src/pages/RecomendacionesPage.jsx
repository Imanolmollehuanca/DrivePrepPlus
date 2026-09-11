/* ============================================================
   DrivePrep+ — Tu Asistente Educativo MTC (Max)
   Asistente especializado en el Examen de Reglas de Tránsito
   ============================================================ */

import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Brain, Target, TrendingUp, TrendingDown,
  BookOpen, CheckCircle2, Clock, Lock, ArrowRight,
  Send, Award, RefreshCw, Zap, Compass, HelpCircle
} from 'lucide-react';

import { useAuth }              from '../context/AuthContext';
import { useHistorial }         from '../hooks/useHistorial';
import { usePractica }          from '../hooks/usePractica';
import { responderTutorIA, SUGERENCIAS_TUTOR } from '../utils/tutorIA';
import MensajeChat              from '../components/chat/MensajeChat';
import maxInstructorImg         from '../assets/images/max-instructor.jpg';

export default function RecomendacionesPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { entradas, metricas } = useHistorial();
  const { progreso } = usePractica();

  const [inputMensaje, setInputMensaje] = useState('');
  const [chatMensajes, setChatMensajes] = useState([]);
  const [estaEscribiendo, setEstaEscribiendo] = useState(false);
  const [contextoConversacion, setContextoConversacion] = useState({ ultimoTema: null, preguntaActiva: null });
  const chatEndRef = useRef(null);

  const nombreUsuario = usuario?.nombre ? usuario.nombre.split(' ')[0] : 'Futuro Conductor';

  /* ── Análisis real de rendimiento ── */
  const analisis = useMemo(() => {
    const simulacros = entradas.filter((e) => e.tipo === 'simulacro_completo');
    
    // Mapear aciertos por categoría
    const mapaCat = {};
    simulacros.forEach((s) => {
      (s.porCategoria || []).forEach((cat) => {
        const key = cat.categoriaId || cat.label;
        if (!mapaCat[key]) {
          mapaCat[key] = { ...cat, totalCorr: 0, totalQ: 0 };
        }
        mapaCat[key].totalCorr += cat.correctas || 0;
        mapaCat[key].totalQ += cat.total || 0;
      });
    });

    const listaCats = Object.values(mapaCat).map((c) => ({
      ...c,
      pct: c.totalQ > 0 ? Math.round((c.totalCorr / c.totalQ) * 100) : 0,
      errores: c.totalQ - c.totalCorr
    })).sort((a, b) => a.pct - b.pct);

    const peorCat = listaCats[0];
    const catDebilNombre = peorCat?.label || 'Señales de Prioridad y Reglamento de Tránsito';
    const dominioPct = peorCat ? peorCat.pct : 58;
    const erroresTotal = peorCat ? peorCat.errores : 7;
    const tendencia = dominioPct >= 65 ? 'Mejorando' : 'Requiere atención';
    const nivel = dominioPct < 60 ? 'Básico' : dominioPct < 80 ? 'Intermedio' : 'Avanzado';

    return {
      catDebilNombre,
      dominioPct,
      erroresTotal,
      tendencia,
      nivel,
      promedioGeneral: metricas.promedioPuntaje || 62,
      tieneSimulacros: simulacros.length > 0,
    };
  }, [entradas, metricas]);

  /* ── Mensaje inicial del Asistente ── */
  useEffect(() => {
    let mensajeBienvenida = '';
    if (analisis.tieneSimulacros) {
      mensajeBienvenida = `¡Hola, ${nombreUsuario}! 👋 Soy **Max, tu Asistente de DrivePrepPlus especializado en el examen del MTC**.\n\nHe revisado tu rendimiento y podemos enfocar nuestro repaso en **${analisis.catDebilNombre}** (${analisis.dominioPct}% de dominio).\n\nPuedes hacerme cualquier consulta de normas, señales, óvalos, PARE vs CEDA o pedirme una pregunta tipo examen para ponerte a prueba.\n\n¿Qué quieres repasar hoy?`;
    } else {
      mensajeBienvenida = `¡Hola, ${nombreUsuario}! 👋 Soy **Max, tu Asistente de DrivePrepPlus especializado en el examen de reglas de tránsito del MTC del Perú**.\n\nEstoy aquí para acompañarte paso a paso en tu preparación para obtener tu licencia de conducir. Puedes consultarme sobre:\n• 🚦 Señales de tránsito (preventivas, reglamentarias, informativas)\n• 🛣️ Reglas de circulación y prioridad de paso\n• 🛑 PARE vs CEDA EL PASO y óvalos\n• ⚠️ Infracciones, sanciones y sistema de puntos\n• 🔧 Mecánica básica y primeros auxilios\n• 📝 Preguntas de práctica tipo examen\n\n¿Por cuál tema te gustaría empezar?`;
    }

    setChatMensajes([
      {
        id: 1,
        emisor: 'max',
        texto: mensajeBienvenida,
        preguntaData: null
      }
    ]);
  }, [nombreUsuario, analisis.tieneSimulacros, analisis.catDebilNombre, analisis.dominioPct]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMensajes, estaEscribiendo]);

  /* ── Enviar consulta al Asistente ── */
  const handleEnviarMensaje = (textoPersonalizado) => {
    const prompt = (textoPersonalizado || inputMensaje).trim();
    if (!prompt) return;

    const nuevoMensajeUsuario = {
      id: Date.now(),
      emisor: 'usuario',
      texto: prompt
    };

    setChatMensajes((prev) => [...prev, nuevoMensajeUsuario]);
    if (!textoPersonalizado) setInputMensaje('');
    setEstaEscribiendo(true);

    setTimeout(() => {
      const respuesta = responderTutorIA({
        mensajeUsuario: prompt,
        contextoConversacion,
        datosUsuario: usuario,
        historialSimulacros: entradas,
        progresoPractica: progreso,
        metricasHistorial: metricas
      });

      if (respuesta.nuevoContexto) {
        setContextoConversacion(respuesta.nuevoContexto);
      }

      setChatMensajes((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          emisor: 'max',
          texto: respuesta.texto,
          preguntaData: respuesta.preguntaData || null
        }
      ]);
      setEstaEscribiendo(false);
    }, 350);
  };

  const handleReiniciarChat = () => {
    setContextoConversacion({ ultimoTema: null, preguntaActiva: null });
    setChatMensajes([
      {
        id: Date.now(),
        emisor: 'max',
        texto: `¡Conversación reiniciada, ${nombreUsuario}! 👋 ¿En qué tema del balotario oficial del MTC te gustaría que nos enfoquemos ahora?`,
        preguntaData: null
      }
    ]);
  };

  return (
    <div className="page-enter space-y-6 max-w-7xl mx-auto pb-10">

      {/* ── Encabezado Principal ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
            <Brain size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-none">
                Tu Asistente MTC
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-display">
                Max · Balotario MTC
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-body mt-1">
              Asistente educativo especializado en el examen de reglas de tránsito del MTC del Perú.
            </p>
          </div>
        </div>
      </div>

      {/* ── Grid Principal: 2 Columnas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">

        {/* ════ COLUMNA IZQUIERDA: Diagnóstico + Plan ════ */}
        <div className="space-y-6">

          {/* 1. Tarjeta: Max ha analizado tu rendimiento */}
          <div className="card p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold font-display text-slate-900 dark:text-white leading-tight">
                    Max ha analizado tu rendimiento
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-body">
                    Diagnóstico basado en tus intentos y simulacros oficiales.
                  </p>
                </div>
              </div>
            </div>

            {/* Principal área de mejora Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-center">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
                    <Target size={16} />
                  </div>
                  <span className="text-xs font-bold text-rose-500 uppercase tracking-wider font-display">
                    Tu principal área de mejora
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display leading-snug">
                  {analisis.catDebilNombre}
                </h3>
              </div>

              {/* Dominio actual circular */}
              <div className="flex items-center gap-4 bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm shrink-0">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200 dark:text-slate-700"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-500"
                      strokeDasharray={`${analisis.dominioPct}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-black font-display text-slate-900 dark:text-white">
                    {analisis.dominioPct}%
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 font-display">
                    Dominio actual
                  </p>
                  <p className="text-[11px] font-semibold text-rose-500 font-display flex items-center gap-1 mt-0.5">
                    <TrendingDown size={12} /> -4% vs. último intento
                  </p>
                </div>
              </div>
            </div>

            {/* 3 mini stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-body">Errores recientes</p>
                <p className="text-lg font-extrabold text-rose-500 font-display mt-0.5">{analisis.erroresTotal}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-body">Tendencia</p>
                <p className="text-lg font-extrabold text-emerald-500 font-display mt-0.5">{analisis.tendencia}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-body">Nivel actual</p>
                <p className="text-lg font-extrabold text-amber-500 font-display mt-0.5">{analisis.nivel}</p>
              </div>
            </div>
          </div>

          {/* 2. Tarjeta: Plan de estudio personalizado */}
          <div className="card p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold font-display text-slate-900 dark:text-white leading-tight">
                    Plan de estudio personalizado
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-body">
                    Ruta guiada por Max para dominar tus temas difíciles.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-display">
                Tiempo total: 15 min
              </span>
            </div>

            {/* Stepper de 3 fases */}
            <div className="space-y-3">
              {/* Paso 1 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white font-display">
                      Repaso rápido
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-body">
                      Explicación clara y sencilla del tema clave.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-body flex items-center gap-1">
                    <Clock size={13} /> 5 min
                  </span>
                  <CheckCircle2 size={18} className="text-emerald-500" />
                </div>
              </div>

              {/* Paso 2 */}
              <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/[0.04] dark:bg-indigo-500/[0.08] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/30">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-display">
                      Práctica guiada
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-body">
                      Preguntas enfocadas en tu debilidad.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-indigo-500 font-body flex items-center gap-1">
                    <Clock size={13} /> 7 min
                  </span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                </div>
              </div>

              {/* Paso 3 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/20 opacity-75 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-extrabold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-display">
                      Mini evaluación
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-body">
                      Comprueba lo aprendido para fijar el conocimiento.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-slate-500 font-body flex items-center gap-1">
                    <Clock size={13} /> 3 min
                  </span>
                  <Lock size={16} className="text-slate-400" />
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/practica')}
              className="btn-primary w-full justify-center py-3.5 text-base font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 rounded-xl"
            >
              <span>Empezar entrenamiento personalizado</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>

        {/* ════ COLUMNA DERECHA: Chat con Max Asistente MTC + Tu Plan de Hoy ════ */}
        <div className="space-y-6">

          {/* Chat Interactivo con Max */}
          <div className="card border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden flex flex-col h-[580px]">
            
            {/* Header del Chat */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-400 shrink-0 shadow-sm">
                    <img src={maxInstructorImg} alt="Max" className="w-full h-full object-cover object-top" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold font-display text-slate-900 dark:text-white leading-tight">
                      Max · Asistente MTC
                    </p>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      Balotario
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-500 font-semibold font-body flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Tutor interactivo activo
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleReiniciarChat}
                className="p-2 text-slate-400 hover:text-indigo-500 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Reiniciar conversación"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Mensajes del Chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 sidebar-scroll bg-slate-50/40 dark:bg-slate-950/20">
              {chatMensajes.map((msg) => (
                <MensajeChat
                  key={msg.id}
                  mensaje={msg}
                  onSeleccionarOpcion={(opcion) => handleEnviarMensaje(opcion)}
                />
              ))}

              {estaEscribiendo && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/90 rounded-tl-none border border-slate-200 dark:border-slate-700/60 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Ideas rápidas / Quick chips expandidas */}
            <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/60 overflow-x-auto flex gap-1.5 sidebar-scroll">
              {SUGERENCIAS_TUTOR.map((sug) => (
                <button
                  key={sug.id}
                  onClick={() => handleEnviarMensaje(sug.prompt)}
                  className="px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-all shrink-0 shadow-2xs font-display whitespace-nowrap active:scale-95"
                >
                  {sug.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEnviarMensaje();
              }}
              className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputMensaje}
                  onChange={(e) => setInputMensaje(e.target.value)}
                  placeholder="Pregúntale a Max sobre el balotario MTC, señales o práctica..."
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-[13px] rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all font-body"
                />
                <Sparkles size={15} className="absolute left-3 top-3 text-indigo-500" />
              </div>
              <button
                type="submit"
                disabled={!inputMensaje.trim()}
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md shadow-indigo-500/20"
                title="Enviar mensaje"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

          {/* Tarjeta: Tu plan de hoy */}
          <div className="card p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Target size={16} />
              </div>
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">
                Tu plan de hoy
              </h3>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3">
              <div>
                <p className="text-sm font-extrabold font-display text-slate-900 dark:text-white leading-tight">
                  {analisis.catDebilNombre}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="badge badge-primary text-[10px]">Nivel: {analisis.nivel}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-body flex items-center gap-1">
                    <Clock size={12} /> 15 min
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-body leading-relaxed">
                <strong>Objetivo:</strong> Dominar las preguntas de alta frecuencia de error y asegurar tu aprobación en el balotario oficial.
              </p>

              <button
                onClick={() => navigate('/practica')}
                className="btn-primary w-full justify-center py-2.5 text-xs font-bold rounded-xl"
              >
                <span>Comenzar ahora</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Barra Inferior: 3 Pilares ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="card p-4 flex items-center gap-3.5 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Brain size={20} />
          </div>
          <div>
            <p className="text-xs font-bold font-display text-slate-900 dark:text-white">
              Aprende de tus errores
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-body">
              Cada respuesta cuenta para tu análisis personalizado.
            </p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3.5 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs font-bold font-display text-slate-900 dark:text-white">
              Evoluciona a tu ritmo
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-body">
              Sin presión, enfocado en tus debilidades.
            </p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3.5 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award size={20} />
          </div>
          <div>
            <p className="text-xs font-bold font-display text-slate-900 dark:text-white">
              Tu meta, nuestro objetivo
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-body">
              ¡Tu licencia MTC a la primera!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
