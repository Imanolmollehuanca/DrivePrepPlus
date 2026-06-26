/* ============================================================
   DrivePrep+ — Páginas placeholder (Fase 1)
   Cada página mostrará su nombre e icono.
   En Fase 2 se implementarán con contenido real.
   ============================================================ */

import { Monitor, BookOpen, AlertTriangle, History, BarChart2, Lightbulb, User, Settings } from 'lucide-react';

/* ── Factory de página placeholder ── */
function PlaceholderPage({ titulo, descripcion, icono: Icono, color = '#6366f1' }) {
  return (
    <div className="page-enter flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{ background: `${color}15` }}
      >
        <Icono size={36} style={{ color }} />
      </div>
      <div className="space-y-2">
        <h2
          className="text-2xl font-extrabold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          {titulo}
        </h2>
        <p
          className="text-sm max-w-sm"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}
        >
          {descripcion}
        </p>
      </div>
      <span
        className="badge badge-primary text-xs"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Próximamente — Fase 2
      </span>
    </div>
  );
}

/* ── Páginas exportadas ── */

export function SimuladoresPage() {
  return (
    <PlaceholderPage
      titulo="Simuladores"
      descripcion="Aquí encontrarás simulacros completos tipo MTC y prácticas por tema."
      icono={Monitor}
      color="#6366f1"
    />
  );
}

export function PracticaPage() {
  return (
    <PlaceholderPage
      titulo="Práctica por temas"
      descripcion="Selecciona una categoría específica para practicar y reforzar tus conocimientos."
      icono={BookOpen}
      color="#10b981"
    />
  );
}

export function SeñalesPage() {
  return (
    <PlaceholderPage
      titulo="Señales de tránsito"
      descripcion="Aprende y memoriza todas las señales de tránsito del reglamento peruano."
      icono={AlertTriangle}
      color="#f59e0b"
    />
  );
}

export function HistorialPage() {
  return (
    <PlaceholderPage
      titulo="Historial"
      descripcion="Revisa todos tus simulacros anteriores y analiza tu evolución."
      icono={History}
      color="#0ea5e9"
    />
  );
}

export function EstadisticasPage() {
  return (
    <PlaceholderPage
      titulo="Estadísticas"
      descripcion="Visualiza gráficos detallados de tu progreso y rendimiento por categoría."
      icono={BarChart2}
      color="#8b5cf6"
    />
  );
}

export function RecomendacionesPage() {
  return (
    <PlaceholderPage
      titulo="Recomendaciones"
      descripcion="Recibe sugerencias personalizadas basadas en tu rendimiento y errores frecuentes."
      icono={Lightbulb}
      color="#f59e0b"
    />
  );
}

export function PerfilPage() {
  return (
    <PlaceholderPage
      titulo="Mi perfil"
      descripcion="Gestiona tu información personal, foto de perfil y preferencias de cuenta."
      icono={User}
      color="#6366f1"
    />
  );
}

export function AjustesPage() {
  return (
    <PlaceholderPage
      titulo="Ajustes"
      descripcion="Configura notificaciones, preferencias de idioma y opciones de privacidad."
      icono={Settings}
      color="#64748b"
    />
  );
}

export function NotFoundPage() {
  return (
    <div className="page-enter flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <p className="text-7xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-border)' }}>
        404
      </p>
      <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
        Página no encontrada
      </h2>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
        La sección que buscas aún no existe o fue movida.
      </p>
    </div>
  );
}
