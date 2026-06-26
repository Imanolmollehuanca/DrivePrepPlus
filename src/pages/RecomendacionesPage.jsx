/* ============================================================
   DrivePrep+ — RecomendacionesPage
   Recomendaciones personalizadas basadas en el historial real.
   TODO Fase 4: GET /api/recomendaciones/:userId (IA backend)
   ============================================================ */
import { useMemo }       from 'react';
import { useNavigate }   from 'react-router-dom';
import {
  Lightbulb, Target, TrendingUp, BookOpen, ArrowRight,
  CheckCircle2, Clock, Zap, Brain, BarChart2, AlertTriangle,
} from 'lucide-react';
import { useHistorial }         from '../hooks/useHistorial';
import { leerHistorialPractica } from '../hooks/usePractica';
import { CATEGORIAS_PRACTICA }   from '../data/bancoPractica';

/* ── Tarjeta de recomendación ── */
function TarjetaRecomendacion({ icono: Ico, titulo, descripcion, accion, onAccion, color, prioridad }) {
  const colorPrioridad = prioridad === 'alta' ? '#ef4444' : prioridad === 'media' ? '#f59e0b' : '#6366f1';
  const bgPrioridad    = prioridad === 'alta' ? '#fee2e2' : prioridad === 'media' ? '#fef3c7' : '#eef2ff';
  const labelPrioridad = prioridad === 'alta' ? 'Prioritario' : prioridad === 'media' ? 'Recomendado' : 'Opcional';

  return (
    <div className="card p-5 flex gap-4 hover:-translate-y-0.5 transition-all duration-200">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
           style={{ background: `${color}15` }}>
        <Ico size={22} style={{ color }} />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <p className="text-sm font-extrabold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
            {titulo}
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: bgPrioridad, color: colorPrioridad, fontFamily:'var(--font-display)' }}>
            {labelPrioridad}
          </span>
        </div>
        <p className="text-xs leading-relaxed" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
          {descripcion}
        </p>
        {accion && (
          <button onClick={onAccion}
                  className="inline-flex items-center gap-1.5 text-xs font-bold mt-1 transition-colors"
                  style={{ color, fontFamily:'var(--font-display)' }}>
            {accion} <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Tarjeta de tema a reforzar ── */
function TarjetaTema({ cat, pct, onClick }) {
  const colorBarra = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="card p-4 flex items-center gap-4 cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
         onClick={onClick}>
      <div className="text-2xl shrink-0">{cat?.emoji || '📚'}</div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="text-sm font-bold truncate" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
          {cat?.label}
        </p>
        <div className="progress-bar h-1.5">
          <div className="progress-bar__fill" style={{ width:`${pct}%`, background: colorBarra }} />
        </div>
        <p className="text-[11px]" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
          {pct}% de aciertos
        </p>
      </div>
      <div className="shrink-0">
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg"
              style={{ background:`${cat?.color}15`, color: cat?.color, fontFamily:'var(--font-display)' }}>
          Practicar
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════ */
export default function RecomendacionesPage() {
  const navigate = useNavigate();
  const { entradas, metricas }  = useHistorial();
  const histPractica = useMemo(leerHistorialPractica, []);

  /* ── Calcular estadísticas para generar recomendaciones ── */
  const analisis = useMemo(() => {
    const simulacros = entradas.filter((e) => e.tipo === 'simulacro_completo');
    const practica   = entradas.filter((e) => e.tipo === 'practica');

    /* Rendimiento por categoría de los simulacros */
    const mapaCat = {};
    simulacros.forEach((s) => {
      (s.porCategoria || []).forEach((cat) => {
        if (!mapaCat[cat.categoriaId || cat.label]) {
          mapaCat[cat.categoriaId || cat.label] = { ...cat, totalCorr:0, totalQ:0 };
        }
        mapaCat[cat.categoriaId || cat.label].totalCorr += cat.correctas || 0;
        mapaCat[cat.categoriaId || cat.label].totalQ   += cat.total     || 0;
      });
    });

    const catsConDatos = Object.values(mapaCat).map((c) => ({
      ...c,
      pct: c.totalQ > 0 ? Math.round((c.totalCorr / c.totalQ) * 100) : 0,
    })).sort((a, b) => a.pct - b.pct);

    const temasDebiles  = catsConDatos.filter((c) => c.pct < 70);
    const temasOk       = catsConDatos.filter((c) => c.pct >= 70);
    const promedio      = metricas.promedioPuntaje;
    const nSimulacros   = simulacros.length;
    const nPractica     = practica.length;
    const sinActividad  = entradas.length === 0;

    return { temasDebiles, temasOk, promedio, nSimulacros, nPractica, sinActividad, catsConDatos };
  }, [entradas, metricas]);

  /* ── Generar recomendaciones dinámicas ── */
  const recomendaciones = useMemo(() => {
    const r = [];
    const { temasDebiles, promedio, nSimulacros, nPractica, sinActividad } = analisis;

    if (sinActividad) {
      r.push({
        id:'inicio', icono:Zap, color:'#6366f1', prioridad:'alta',
        titulo:'Comienza tu primer simulacro',
        descripcion:'Realiza tu primer simulacro completo para que el sistema pueda analizar tu rendimiento y darte recomendaciones personalizadas.',
        accion:'Ir al simulador',
        onAccion: () => navigate('/simuladores'),
      });
      r.push({
        id:'practica', icono:BookOpen, color:'#10b981', prioridad:'media',
        titulo:'Explora la práctica por temas',
        descripcion:'Practica categoría por categoría para reforzar tus conocimientos antes del examen completo.',
        accion:'Ver categorías',
        onAccion: () => navigate('/practica'),
      });
    } else {
      if (promedio < 70) {
        r.push({
          id:'mejorar', icono:TrendingUp, color:'#ef4444', prioridad:'alta',
          titulo:'Necesitas mejorar tu promedio',
          descripcion:`Tu promedio actual es ${promedio}%. El mínimo para aprobar el examen MTC es 70%. Concéntrate en las categorías con menor rendimiento.`,
          accion:'Ver estadísticas',
          onAccion: () => navigate('/estadisticas'),
        });
      } else if (promedio >= 70 && promedio < 85) {
        r.push({
          id:'mantener', icono:Target, color:'#f59e0b', prioridad:'media',
          titulo:'¡Vas bien! Consolida tu rendimiento',
          descripcion:`Tienes un promedio de ${promedio}%. Sigue practicando para asegurar un resultado excelente en el examen real.`,
          accion:'Nuevo simulacro',
          onAccion: () => navigate('/simuladores'),
        });
      } else {
        r.push({
          id:'excelente', icono:CheckCircle2, color:'#10b981', prioridad:'media',
          titulo:'Rendimiento excelente',
          descripcion:`Tu promedio es ${promedio}%. Estás listo para el examen. Mantente activo con prácticas periódicas para no perder el ritmo.`,
          accion: null,
        });
      }

      if (temasDebiles.length > 0) {
        r.push({
          id:'debiles', icono:Brain, color:'#8b5cf6', prioridad:'alta',
          titulo:`Refuerza: ${temasDebiles[0]?.label || 'categorías débiles'}`,
          descripcion:`Tu menor rendimiento está en "${temasDebiles[0]?.label}" con ${temasDebiles[0]?.pct}% de aciertos. Practica este tema específico para mejorar tu puntaje general.`,
          accion:'Practicar ahora',
          onAccion: () => navigate('/practica'),
        });
      }

      if (nSimulacros < 3) {
        r.push({
          id:'frecuencia', icono:Clock, color:'#0ea5e9', prioridad: nSimulacros === 0 ? 'alta' : 'media',
          titulo:'Aumenta la frecuencia de práctica',
          descripcion:`Has realizado ${nSimulacros} simulacro${nSimulacros !== 1 ? 's' : ''}. Los conductores que realizan más de 5 simulacros tienen una tasa de aprobación significativamente mayor.`,
          accion:'Iniciar simulacro',
          onAccion: () => navigate('/simuladores'),
        });
      }

      if (nPractica < 5) {
        r.push({
          id:'practica', icono:BookOpen, color:'#10b981', prioridad:'media',
          titulo:'Practica por temas específicos',
          descripcion:'La práctica por temas te permite reforzar áreas concretas donde tienes más errores, complementando perfectamente los simulacros completos.',
          accion:'Ir a práctica',
          onAccion: () => navigate('/practica'),
        });
      }

      r.push({
        id:'estadisticas', icono:BarChart2, color:'#6366f1', prioridad:'baja',
        titulo:'Revisa tu evolución en estadísticas',
        descripcion:'Analiza tus gráficos de progreso para identificar patrones y ver cómo ha mejorado tu rendimiento en el tiempo.',
        accion:'Ver estadísticas',
        onAccion: () => navigate('/estadisticas'),
      });
    }

    return r;
  }, [analisis, navigate]);

  return (
    <div className="page-enter space-y-6 max-w-6xl mx-auto">

      {/* ── Encabezado ── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background:'#fef3c7' }}>
          <Lightbulb size={24} style={{ color:'#f59e0b' }} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold" style={{ fontFamily:'var(--font-display)' }}>
            Recomendaciones
          </h1>
          <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
            Sugerencias personalizadas basadas en tu rendimiento.
          </p>
        </div>
      </div>

      {/* ── Grid: Recomendaciones + Temas a reforzar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

        {/* Columna principal */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-indigo-500" />
            <h2 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
              Recomendaciones para ti
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-semibold"
                  style={{ fontFamily:'var(--font-display)' }}>
              {recomendaciones.length} sugerencias
            </span>
          </div>

          {recomendaciones.map((rec) => (
            <TarjetaRecomendacion key={rec.id} {...rec} />
          ))}

          {/* Aviso de IA */}
          <div className="flex items-start gap-3 p-4 rounded-xl"
               style={{ background:'#f0f9ff', border:'1px solid #bae6fd' }}>
            <Brain size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'#0c4a6e' }}>
              <strong>Próximamente:</strong> Las recomendaciones serán generadas con inteligencia artificial
              en base a tu historial completo, identificando patrones de errores y sugiriendo el plan de
              estudio óptimo para tu perfil.
            </p>
          </div>
        </div>

        {/* Panel lateral: temas a reforzar */}
        <div className="space-y-5">
          {/* Temas débiles */}
          {analisis.temasDebiles.length > 0 && (
            <div className="card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-orange-500" />
                <h3 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
                  Temas a reforzar
                </h3>
              </div>
              <div className="space-y-3">
                {analisis.temasDebiles.slice(0, 4).map((cat) => {
                  const catInfo = Object.values(CATEGORIAS_PRACTICA).find((c) => c.label === cat.label);
                  return (
                    <TarjetaTema key={cat.label}
                                 cat={{ ...catInfo, label: cat.label, color: cat.color }}
                                 pct={cat.pct}
                                 onClick={() => navigate('/practica')} />
                  );
                })}
              </div>
            </div>
          )}

          {/* Temas dominados */}
          {analisis.temasOk.length > 0 && (
            <div className="card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-green-500" />
                <h3 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
                  Temas dominados
                </h3>
              </div>
              <div className="space-y-2">
                {analisis.temasOk.map((cat) => (
                  <div key={cat.label} className="flex items-center gap-2.5 py-2 px-3 rounded-lg"
                       style={{ background:'#f0fdf4', border:'1px solid #bbf7d0' }}>
                    <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                    <span className="text-xs font-semibold truncate"
                          style={{ fontFamily:'var(--font-display)', color:'#15803d' }}>
                      {cat.label}
                    </span>
                    <span className="ml-auto text-xs font-extrabold"
                          style={{ fontFamily:'var(--font-display)', color:'#059669' }}>
                      {cat.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sin datos */}
          {analisis.sinActividad && (
            <div className="card p-5 text-center space-y-3">
              <Lightbulb size={32} className="mx-auto text-gray-200" />
              <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                Tus temas a reforzar aparecerán aquí después de tu primer simulacro.
              </p>
            </div>
          )}

          {/* Tip del día */}
          <div className="card p-5 space-y-3"
               style={{ borderLeft: '4px solid #f59e0b' }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              <h3 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
                Consejo del día
              </h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
              Dedica al menos <strong>15 minutos diarios</strong> a la práctica por temas. La constancia
              es más efectiva que sesiones largas y esporádicas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
