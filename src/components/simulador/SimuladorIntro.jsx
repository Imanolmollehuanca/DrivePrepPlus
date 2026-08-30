/* ============================================================
   DrivePrep+ — SimuladorIntro
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

      {/* Hero MTC */}
      <div
        className="rounded-2xl p-8 text-center space-y-5 relative overflow-hidden text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #0c4a6e 100%)' }}
      >
        {/* Ícono orb */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
          <ClipboardList size={32} className="text-white" />
        </div>

        {/* Textos */}
        <div className="space-y-2 max-w-lg mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-sky-100 border border-white/20">
            Balotario Oficial MTC Perú 2026
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Simulador Completo MTC
          </h1>
          <p className="text-sm text-sky-100/90 leading-relaxed font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            Evaluación real de 40 preguntas seleccionadas aleatoriamente por categoría según la Licencia Clase A-I.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap pt-2">
          {[
            { Ico: ClipboardList, val: `${CONFIG_SIMULACRO.cantidadPreguntas}`, label: 'Preguntas' },
            { Ico: Clock,         val: `${CONFIG_SIMULACRO.tiempoLimiteMinutos} min`, label: 'Tiempo' },
            { Ico: CheckCircle2,  val: `${CONFIG_SIMULACRO.puntajeAprobacion}%`, label: 'Para aprobar' },
            { Ico: Shuffle,       val: 'Mixto', label: 'Tipos' },
          ].map(({ Ico, val, label }) => (
            <div key={label} className="text-center px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm min-w-[90px]">
              <Ico size={15} className="text-sky-200 mx-auto mb-1" />
              <p className="text-base font-extrabold text-white leading-none" style={{ fontFamily: 'var(--font-display)' }}>{val}</p>
              <p className="text-[10px] text-sky-200/80 mt-1 font-medium" style={{ fontFamily: 'var(--font-body)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Distribución de categorías */}
      <div className="card p-5 space-y-3">
        <h2 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
          📊 Distribución del examen
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {Object.entries(CONFIG_SIMULACRO.distribucionCategorias).map(([catId, cantidad]) => {
            const cat  = CATEGORIAS[catId];
            const Ico  = ICONOS_CAT[catId] || ClipboardList;
            const pct  = Math.round((cantidad / CONFIG_SIMULACRO.cantidadPreguntas) * 100);
            return (
              <div key={catId} className="flex items-center gap-3 p-3 rounded-xl border"
                   style={{ background:`${cat.color}08`, borderColor:`${cat.color}25` }}>
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
        <h2 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
          🎯 Tipos de actividad incluidos
        </h2>
        <div className="space-y-2">
          {TIPOS_PREGUNTA.map(({ emoji, label, desc }) => (
            <div key={label} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
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
      <div className="flex items-start gap-3 p-4 rounded-xl border bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800">
        <Shuffle size={18} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <p className="text-sm text-sky-900 dark:text-sky-200" style={{ fontFamily:'var(--font-body)' }}>
          <strong>Examen único:</strong> Cada intento genera un examen diferente con preguntas
          seleccionadas aleatoriamente de cada categoría y en orden distinto.
        </p>
      </div>

      {/* Botón iniciar */}
      <button
        onClick={onIniciar}
        className="w-full py-4 px-6 rounded-xl font-bold text-base bg-sky-600 hover:bg-sky-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <span>Comenzar Examen Oficial MTC</span>
        <ChevronRight size={20} />
      </button>

      <p className="text-center text-xs" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
        Una vez iniciado, el temporizador de 40 minutos comenzará a correr.
      </p>
    </div>
  );
}
