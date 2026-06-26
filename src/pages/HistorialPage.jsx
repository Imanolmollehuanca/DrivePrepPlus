/* ============================================================
   DrivePrep+ — HistorialPage
   Lista paginada de simulacros + práctica, filtros, panel lateral
   de detalle. Preparado para conectar con API en Fase 4.
   TODO Fase 4: GET /api/historial/:userId?tipo=&page=&limit=
   ============================================================ */
import { useState, useMemo } from 'react';
import { useNavigate }       from 'react-router-dom';
import {
  History, ClipboardList, BookOpen, ChevronLeft, ChevronRight,
  Clock, CheckCircle2, XCircle, Star, Filter, X, Download,
  BarChart2, Calendar,
} from 'lucide-react';
import { useHistorial, formatearTiempo } from '../hooks/useHistorial';
import { ProgressRing }                  from '../components/ui/UIComponents';

const ITEMS_POR_PAGINA = 8;

/* ── Badge de estado ── */
function BadgeEstado({ aprobado, puntaje }) {
  if (aprobado)          return <span className="badge badge-success">● Aprobado</span>;
  if (puntaje >= 50)     return <span className="badge badge-warning">● En progreso</span>;
  return                        <span className="badge badge-danger">● No aprobado</span>;
}

/* ── Panel de detalle lateral ── */
function PanelDetalle({ entrada, onCerrar }) {
  const navigate = useNavigate();
  if (!entrada) return null;

  const tiempoFormato = entrada.tiempoSegundos > 0
    ? formatearTiempo(entrada.tiempoSegundos)
    : '—';

  const colorAnillo = entrada.puntaje >= 70 ? '#10b981' : entrada.puntaje >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="card h-full flex flex-col" style={{ minHeight: 0 }}>
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide mb-1"
             style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-muted)' }}>
            {entrada.tipo === 'simulacro_completo' ? 'Simulador completo' : 'Práctica por temas'}
          </p>
          <p className="text-sm font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
            {entrada.tipoLabel}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <Calendar size={11} className="text-gray-400" />
            <p className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              {entrada.fecha} · {entrada.hora}
            </p>
          </div>
        </div>
        <button onClick={onCerrar} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
          <X size={16} />
        </button>
      </div>

      {/* Cuerpo con scroll */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Anillo + estado */}
        <div className="flex items-center justify-between">
          <ProgressRing porcentaje={entrada.puntaje} size={100} stroke={9} color={colorAnillo}>
            <div className="text-center">
              <p className="text-xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
                {entrada.puntaje}%
              </p>
              <p className="text-[9px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                puntaje
              </p>
            </div>
          </ProgressRing>
          <div className="space-y-2 text-right">
            <BadgeEstado aprobado={entrada.aprobado} puntaje={entrada.puntaje} />
            {entrada.tiempoSegundos > 0 && (
              <div className="flex items-center gap-1 justify-end">
                <Clock size={11} className="text-gray-400" />
                <span className="text-xs font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)' }}>
                  {tiempoFormato}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats C/I/T */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Correctas',   v: entrada.correctas,   color: '#10b981', bg: '#d1fae5' },
            { label: 'Incorrectas', v: entrada.incorrectas, color: '#ef4444', bg: '#fee2e2' },
            { label: 'Total',       v: entrada.total,        color: '#6366f1', bg: '#e0e7ff' },
          ].map(({ label, v, color, bg }) => (
            <div key={label} className="text-center py-2.5 rounded-xl"
                 style={{ background: bg }}>
              <p className="text-lg font-extrabold" style={{ fontFamily: 'var(--font-display)', color }}>{v}</p>
              <p className="text-[10px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Desempeño por categoría (solo simulacros completos) */}
        {entrada.porCategoria?.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Desempeño por categoría
            </p>
            {entrada.porCategoria.map((cat) => (
              <div key={cat.categoriaId || cat.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
                    <span className="text-xs" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
                      {cat.label}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold" style={{ fontFamily: 'var(--font-display)', color: cat.color }}>
                    {cat.porcentaje}%
                  </span>
                </div>
                <div className="progress-bar h-1.5">
                  <div className="progress-bar__fill"
                       style={{ width: `${cat.porcentaje}%`, background: cat.porcentaje >= 70 ? '#10b981' : cat.porcentaje >= 50 ? '#f59e0b' : '#ef4444' }} />
                </div>
                <p className="text-[10px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                  {cat.correctas}/{cat.total} correctas
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Sin detalle por categoría (práctica) */}
        {(!entrada.porCategoria || entrada.porCategoria.length === 0) && (
          <div className="text-center py-4">
            <p className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              El detalle por categoría está disponible en los simulacros completos.
            </p>
          </div>
        )}
      </div>

      {/* Footer acciones */}
      <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--color-border)' }}>
        {/* TODO Fase 4: implementar descarga real de reporte */}
        <button
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold
                     text-white transition-all"
          style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', fontFamily: 'var(--font-display)' }}
        >
          <Download size={14} /> Descargar reporte
        </button>
        <button onClick={onCerrar}
                className="w-full py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
                style={{ fontFamily: 'var(--font-display)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
          Volver al historial
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════ */
export default function HistorialPage() {
  const { entradas, metricas, filtrar } = useHistorial();
  const [filtroTipo, setFiltroTipo]     = useState('todos');
  const [pagina, setPagina]             = useState(1);
  const [entradaDetalle, setDetalle]    = useState(null);

  const lista = useMemo(() => filtrar(filtroTipo), [filtrar, filtroTipo]);
  const totalPaginas = Math.max(1, Math.ceil(lista.length / ITEMS_POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const itemsPagina  = lista.slice((paginaActual - 1) * ITEMS_POR_PAGINA, paginaActual * ITEMS_POR_PAGINA);

  const handleFiltro = (tipo) => { setFiltroTipo(tipo); setPagina(1); setDetalle(null); };

  const tiempoTotal = metricas.tiempoTotalSegundos > 0
    ? (() => { const m = Math.floor(metricas.tiempoTotalSegundos / 60); return m >= 60 ? `${Math.floor(m/60)}h ${m%60}m` : `${m} min`; })()
    : '—';

  return (
    <div className="page-enter space-y-6 max-w-7xl mx-auto">

      {/* ── Encabezado ── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
             style={{ background: '#f0f9ff' }}>
          <History size={24} style={{ color: '#0ea5e9' }} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
            Historial
          </h1>
          <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
            Revisa todos tus simulacros anteriores y analiza tu evolución.
          </p>
        </div>
      </div>

      {/* ── Filtros ── */}
      <div className="flex flex-wrap items-center gap-3">
        {[
          { val: 'todos',      label: 'Todos los tipos'    },
          { val: 'simulacros', label: 'Simulador completo' },
          { val: 'practica',   label: 'Práctica por temas' },
        ].map(({ val, label }) => (
          <button key={val} onClick={() => handleFiltro(val)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all
                              ${filtroTipo === val ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-[var(--color-border)] text-gray-500 hover:border-indigo-200 hover:bg-gray-50'}`}
                  style={{ fontFamily: 'var(--font-display)' }}>
            <Filter size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Grid principal ── */}
      <div className={`grid gap-6 ${entradaDetalle ? 'grid-cols-1 lg:grid-cols-[1fr_320px]' : 'grid-cols-1'}`}>

        {/* ── Columna izquierda: métricas + tabla ── */}
        <div className="space-y-5">

          {/* Métricas rápidas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icono: ClipboardList, label: 'Simulacros realizados', v: metricas.simulacrosRealizados, color: '#6366f1', bg: '#eef2ff' },
              { icono: CheckCircle2,  label: 'Promedio general',       v: `${metricas.promedioPuntaje}%`, color: '#10b981', bg: '#ecfdf5' },
              { icono: Star,          label: 'Mejor puntaje',          v: metricas.mejorPuntaje > 0 ? `${metricas.mejorPuntaje}%` : '—', color: '#f59e0b', bg: '#fef3c7' },
              { icono: Clock,         label: 'Tiempo promedio',        v: tiempoTotal,                    color: '#ef4444', bg: '#fef2f2' },
            ].map(({ icono: Ico, label, v, color, bg }) => (
              <div key={label} className="card p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                     style={{ background: bg }}>
                  <Ico size={19} style={{ color }} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide"
                     style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-muted)' }}>
                    {label}
                  </p>
                  <p className="text-xl font-extrabold mt-0.5"
                     style={{ fontFamily: 'var(--font-display)', color }}>
                    {v || '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabla */}
          <div className="card overflow-hidden">
            {lista.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <History size={40} className="text-gray-200" />
                <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
                  Aún no tienes sesiones registradas. ¡Realiza tu primer simulacro!
                </p>
              </div>
            ) : (
              <>
                {/* Cabecera de tabla */}
                <div className="hidden sm:grid grid-cols-[1.6fr_1.8fr_0.8fr_1fr_1fr] gap-4
                                px-5 py-3 border-b text-xs font-bold uppercase tracking-wide"
                     style={{ borderColor: 'var(--color-border)', fontFamily: 'var(--font-display)', color: 'var(--color-text-muted)', background: '#fafafa' }}>
                  <span>Fecha</span>
                  <span>Tipo</span>
                  <span>Puntaje</span>
                  <span>Estado</span>
                  <span className="text-right">Acciones</span>
                </div>

                {/* Filas */}
                {itemsPagina.map((entrada) => {
                  const esActiva = entradaDetalle?.id === entrada.id;
                  return (
                    <div key={entrada.id}
                         className={`grid grid-cols-1 sm:grid-cols-[1.6fr_1.8fr_0.8fr_1fr_1fr] gap-4
                                     px-5 py-4 border-b last:border-0 transition-colors cursor-pointer
                                     ${esActiva ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                         style={{ borderColor: 'var(--color-border)' }}
                         onClick={() => setDetalle(esActiva ? null : entrada)}
                    >
                      {/* Fecha */}
                      <div>
                        <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                          {entrada.fecha}
                        </p>
                        <p className="text-xs" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
                          {entrada.hora}
                        </p>
                      </div>

                      {/* Tipo */}
                      <div>
                        <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                          {entrada.tipoLabel}
                        </p>
                        <p className="text-xs" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
                          {entrada.tipoSub}
                        </p>
                      </div>

                      {/* Puntaje */}
                      <div className="flex items-center">
                        <span className="text-base font-extrabold"
                              style={{
                                fontFamily: 'var(--font-display)',
                                color: entrada.puntaje >= 70 ? '#10b981' : entrada.puntaje >= 50 ? '#f59e0b' : '#ef4444',
                              }}>
                          {entrada.puntaje}%
                        </span>
                      </div>

                      {/* Estado */}
                      <div className="flex items-center">
                        <BadgeEstado aprobado={entrada.aprobado} puntaje={entrada.puntaje} />
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center justify-end gap-2"
                           onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setDetalle(esActiva ? null : entrada)}
                          className="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:bg-gray-50"
                          style={{ fontFamily: 'var(--font-display)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                        >
                          Ver detalle
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Paginación */}
                {totalPaginas > 1 && (
                  <div className="flex items-center justify-between px-5 py-4 border-t"
                       style={{ borderColor: 'var(--color-border)' }}>
                    <p className="text-xs" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
                      Mostrando {(paginaActual - 1) * ITEMS_POR_PAGINA + 1}–{Math.min(paginaActual * ITEMS_POR_PAGINA, lista.length)} de {lista.length} resultados
                    </p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={paginaActual === 1}
                              className="w-8 h-8 rounded-lg border flex items-center justify-center text-sm
                                         disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                              style={{ borderColor: 'var(--color-border)' }}>
                        <ChevronLeft size={15} />
                      </button>
                      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                        <button key={n} onClick={() => setPagina(n)}
                                className={`w-8 h-8 rounded-lg border text-xs font-bold transition-all
                                            ${n === paginaActual ? 'bg-indigo-500 text-white border-indigo-500' : 'hover:bg-gray-50'}`}
                                style={{ fontFamily: 'var(--font-display)', borderColor: 'var(--color-border)', color: n === paginaActual ? '#fff' : 'var(--color-text-secondary)' }}>
                          {n}
                        </button>
                      ))}
                      <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas}
                              className="w-8 h-8 rounded-lg border flex items-center justify-center text-sm
                                         disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                              style={{ borderColor: 'var(--color-border)' }}>
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Panel de detalle ── */}
        {entradaDetalle && (
          <div className="lg:sticky lg:top-20 self-start">
            <PanelDetalle entrada={entradaDetalle} onCerrar={() => setDetalle(null)} />
          </div>
        )}
      </div>
    </div>
  );
}
