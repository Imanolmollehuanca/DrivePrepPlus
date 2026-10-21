/* ============================================================
   DrivePrep+ — App.jsx
   ============================================================ */
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout      from './components/layout/AppLayout';
import CargandoRuta   from './components/common/CargandoRuta';
import ErrorBoundary  from './components/common/ErrorBoundary';

/* Carga diferida de páginas para optimizar el bundle inicial */
const LoginPage             = lazy(() => import('./pages/LoginPage'));
const DashboardPage         = lazy(() => import('./pages/DashboardPage'));
const SimuladoresPage       = lazy(() => import('./pages/SimuladoresPage'));
const PracticaPage          = lazy(() => import('./pages/PracticaPage'));
const HistorialPage         = lazy(() => import('./pages/HistorialPage'));
const EstadisticasPage      = lazy(() => import('./pages/EstadisticasPage'));
const RecomendacionesPage   = lazy(() => import('./pages/RecomendacionesPage'));
const PerfilPage            = lazy(() => import('./pages/PerfilPage'));
const AjustesPage           = lazy(() => import('./pages/AjustesPage'));
const PremiumPage           = lazy(() => import('./pages/PremiumPage'));
const RecuperarContrasenaPage = lazy(() => import('./pages/RecuperarContrasenaPage'));
const NotFoundPage = lazy(() => import('./pages/PlaceholderPages').then(m => ({ default: m.NotFoundPage })));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<CargandoRuta />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login"                element={<LoginPage />} />
          <Route path="/registro"             element={<LoginPage />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasenaPage />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"            element={<DashboardPage />}       />
              <Route path="/simuladores"          element={<SimuladoresPage />}     />
              <Route path="/simuladores/completo" element={<SimuladoresPage />}     />
              <Route path="/practica"             element={<PracticaPage />}        />
              <Route path="/historial"            element={<HistorialPage />}       />
              <Route path="/estadisticas"         element={<EstadisticasPage />}    />
              <Route path="/recomendaciones"      element={<RecomendacionesPage />} />
              <Route path="/perfil"               element={<PerfilPage />}          />
              <Route path="/ajustes"              element={<AjustesPage />}         />
              <Route path="/premium"              element={<PremiumPage />}         />
              <Route path="*"                     element={<NotFoundPage />}        />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
