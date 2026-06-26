/* ============================================================
   DrivePrep+ — Mock Data
   FASE 1: Datos de ejemplo temporales.
   En fases posteriores, estos datos serán reemplazados
   por llamadas reales a la API / base de datos.
   ============================================================ */

/* ── Usuario autenticado ── */
export const mockUser = {
  id: null,                    // Se llenará con el ID real del usuario
  nombre: 'Usuario',           // Nombre dinámico según sesión
  apellido: '',
  email: '',
  avatar: null,                // URL del avatar o null para mostrar inicial
  plan: 'gratuito',            // 'gratuito' | 'premium'
  fechaRegistro: null,
};

/* ── Métricas de progreso del usuario ── */
export const mockProgreso = {
  rendimientoGeneral: 0,       // Porcentaje de 0 a 100
  simulacrosRealizados: 0,
  promedioPuntaje: 0,
  mejorPuntaje: 0,
};

/* ── Evolución de puntajes (gráfico de líneas) ── */
// Formato: { fecha: 'DD MMM', puntaje: número }
export const mockEvolucionPuntajes = [
  { fecha: '01 Jun', puntaje: 0 },
  { fecha: '05 Jun', puntaje: 0 },
  { fecha: '10 Jun', puntaje: 0 },
  { fecha: '15 Jun', puntaje: 0 },
  { fecha: '20 Jun', puntaje: 0 },
  { fecha: '25 Jun', puntaje: 0 },
  { fecha: '30 Jun', puntaje: 0 },
];

/* ── Categorías con más errores ── */
// Porcentaje de aciertos por categoría (mayor % = mejor rendimiento)
export const mockCategorias = [
  { nombre: 'Señales preventivas',  porcentajeAcierto: 0, color: '#ef4444' },
  { nombre: 'Normas de tránsito',   porcentajeAcierto: 0, color: '#f59e0b' },
  { nombre: 'Infracciones',         porcentajeAcierto: 0, color: '#f59e0b' },
  { nombre: 'Primeros auxilios',    porcentajeAcierto: 0, color: '#10b981' },
];

/* ── Último simulacro ── */
export const mockUltimoSimulacro = {
  fecha: null,
  hora: null,
  resultado: null,             // 'aprobado' | 'desaprobado' | null
  puntaje: 0,
  correctas: 0,
  incorrectas: 0,
  total: 0,
};

/* ── Recomendación personalizada ── */
export const mockRecomendacion = {
  tema: null,                  // Tema a reforzar (viene de análisis de errores)
  mensaje: null,
};

/* ── Accesos rápidos del dashboard ── */
export const mockAccesosRapidos = [
  { id: 'manual',      label: 'Manual del Conductor',  icon: 'BookOpen',   ruta: '/manual'    },
  { id: 'reglamento',  label: 'Reglamento Nacional',   icon: 'Gavel',      ruta: '/reglamento'},
  { id: 'tips',        label: 'Tips de estudio',        icon: 'Lightbulb',  ruta: '/tips'      },
  { id: 'faq',         label: 'Preguntas frecuentes',   icon: 'HelpCircle', ruta: '/faq'       },
];

/* ── Módulos del simulador ── */
export const mockModulos = [
  {
    id: 'completo',
    titulo: 'Simulador completo',
    descripcion: 'Examen tipo MTC',
    icono: 'ClipboardList',
    color: '#6366f1',
    ruta: '/simuladores/completo',
  },
  {
    id: 'temas',
    titulo: 'Práctica por temas',
    descripcion: 'Elige una categoría',
    icono: 'GraduationCap',
    color: '#10b981',
    ruta: '/simuladores/temas',
  },
  {
    id: 'senales',
    titulo: 'Señales de tránsito',
    descripcion: 'Aprende señales',
    icono: 'AlertTriangle',
    color: '#f59e0b',
    ruta: '/simuladores/senales',
  },
  {
    id: 'estadisticas',
    titulo: 'Mis estadísticas',
    descripcion: 'Revisa tu progreso',
    icono: 'Target',
    color: '#8b5cf6',
    ruta: '/estadisticas',
  },
];

/* ── Notificaciones ── */
export const mockNotificaciones = [];  // Se llenará dinámicamente

/* ── Filtros de tiempo disponibles para el gráfico ── */
export const filtrosTiempo = [
  { valor: '7d',  label: 'Últimos 7 días'  },
  { valor: '30d', label: 'Últimos 30 días' },
  { valor: '90d', label: 'Últimos 3 meses' },
];
