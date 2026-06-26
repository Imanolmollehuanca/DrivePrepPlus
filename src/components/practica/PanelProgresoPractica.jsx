/* ============================================================
   DrivePrep+ — PanelProgresoPractica
   Panel lateral derecho: progreso general y temas débiles.
   ============================================================ */
import { useNavigate } from 'react-router-dom';
import { BarChart2, Clock, CheckCircle2, BookOpen, Zap } from 'lucide-react';
import { ProgressRing } from '../ui/UIComponents';
import { CATEGORIAS_PRACTICA } from '../../data/bancoPractica';

export default function PanelProgresoPractica({
  totalSesiones,
  totalRespondidas,
  categoriasMasDebiles,
  progreso,
  onPracticarCategoria,
}) {
  const navigate = useNavigate();

  /* Promedio general de todas las categorías con sesiones */
  const categoriasConSesion = Object.entries(progreso).filter(([, v]) => v.sesiones?.length > 0);
  const promedioGeneral = categoriasConSesion.length > 0
    ? Math.round(categoriasConSesion.reduce((a, [, v]) => a + v.mejorPuntaje, 0) / categoriasConSesion.length)
    : 0;

  /* Correctas estimadas */
  const correctasEstimadas = Math.round(totalRespondidas * (promedioGeneral / 100));

  return (
    <div className="space-y-4">

      {/* ── Progreso general ── */}
      <div className="card p-5 space-y-4">
        <h3 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
          Tu progreso general
        </h3>

        <div className="flex items-center justify-center py-2">
          <ProgressRing porcentaje={promedioGeneral} size={110} stroke={10} color="#6366f1">
            <div className="text-center">
              <p className="text-2xl font-extrabold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                {promedioGeneral}%
              </p>
              <p className="text-[10px]" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                Completado
              </p>
            </div>
          </ProgressRing>
        </div>

        <div className="space-y-2">
          {[
            { label:'Preguntas respondidas', valor: totalRespondidas, color:'#6366f1',  icono: BookOpen     },
            { label:'Respuestas correctas',  valor: correctasEstimadas, color:'#10b981', icono: CheckCircle2 },
            { label:'Promedio de aciertos',  valor: `${promedioGeneral}%`, color:'#f59e0b', icono: BarChart2 },
          ].map(({ label, valor, color, icono: Ico }) => (
            <div key={label} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                     style={{ background:`${color}15` }}>
                  <Ico size={12} style={{ color }} />
                </div>
                <span className="text-xs" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
                  {label}
                </span>
              </div>
              <span className="text-sm font-extrabold" style={{ fontFamily:'var(--font-display)', color }}>
                {valor}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Temas más débiles ── */}
      {categoriasMasDebiles.length > 0 && (
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
              Tus temas más débiles
            </h3>
            <button className="text-xs font-semibold" style={{ color:'var(--color-primary)', fontFamily:'var(--font-display)' }}>
              Ver detalle
            </button>
          </div>

          <div className="space-y-3">
            {categoriasMasDebiles.map(({ catId, mejorPuntaje }) => {
              const cat = CATEGORIAS_PRACTICA[catId];
              if (!cat) return null;
              const colorBar = mejorPuntaje >= 70 ? '#10b981' : mejorPuntaje >= 50 ? '#f59e0b' : '#ef4444';
              const sesionesProgs = progreso[catId];

              return (
                <div key={catId} className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base shrink-0">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold truncate"
                           style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                          {cat.label}
                        </p>
                        <span className="text-xs font-extrabold ml-2 shrink-0"
                              style={{ fontFamily:'var(--font-display)', color: colorBar }}>
                          {mejorPuntaje}%
                        </span>
                      </div>
                      <p className="text-[10px]" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                        {sesionesProgs?.preguntasRespondidas || 0} correctas
                      </p>
                    </div>
                  </div>
                  <div className="progress-bar h-1.5 ml-8">
                    <div className="progress-bar__fill" style={{ width:`${mejorPuntaje}%`, background: colorBar }} />
                  </div>
                </div>
              );
            })}
          </div>

          {categoriasMasDebiles.length > 0 && (
            <button
              onClick={() => onPracticarCategoria(categoriasMasDebiles[0].catId)}
              className="btn-primary w-full justify-center py-2.5 text-xs"
              style={{ background:'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
            >
              <Zap size={14} /> Practicar temas débiles →
            </button>
          )}
        </div>
      )}

      {/* ── Actividad reciente ── */}
      {categoriasConSesion.length > 0 && (
        <div className="card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
              Actividad reciente
            </h3>
            <span className="text-xs font-semibold" style={{ color:'var(--color-primary)', fontFamily:'var(--font-display)' }}>
              Ver todo
            </span>
          </div>

          <div className="space-y-2">
            {categoriasConSesion.slice(0, 3).map(([catId, datos]) => {
              const cat     = CATEGORIAS_PRACTICA[catId];
              const sesion  = datos.sesiones?.[0];
              if (!cat || !sesion) return null;
              const color = sesion.puntaje >= 70 ? '#10b981' : '#f59e0b';

              return (
                <div key={catId}
                     className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                     onClick={() => onPracticarCategoria(catId)}>
                  <span className="text-xl shrink-0">{cat.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate"
                       style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                      {cat.label}
                    </p>
                    <p className="text-[10px]" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                      Hace {datos.sesiones?.length > 1 ? `${datos.sesiones.length} días` : 'poco'}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold shrink-0"
                        style={{ fontFamily:'var(--font-display)', color }}>
                    {sesion.puntaje}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Estado vacío ── */}
      {categoriasConSesion.length === 0 && (
        <div className="card p-5 text-center space-y-3">
          <div className="text-3xl">📚</div>
          <p className="text-sm font-semibold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
            Aún no has practicado
          </p>
          <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
            Selecciona un tema y comienza tu primera sesión de práctica.
          </p>
        </div>
      )}
    </div>
  );
}
