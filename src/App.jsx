/* ============================================================
   DrivePrep+ — App.jsx
   ============================================================ */
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute       from './components/auth/ProtectedRoute';
import AppLayout            from './components/layout/AppLayout';
import LoginPage            from './pages/LoginPage';
import DashboardPage        from './pages/DashboardPage';
import SimuladoresPage      from './pages/SimuladoresPage';
import PracticaPage         from './pages/PracticaPage';
import HistorialPage        from './pages/HistorialPage';
import EstadisticasPage     from './pages/EstadisticasPage';
import RecomendacionesPage  from './pages/RecomendacionesPage';
import PerfilPage           from './pages/PerfilPage';
import AjustesPage          from './pages/AjustesPage';
import PremiumPage          from './pages/PremiumPage';
import RecuperarContrasenaPage from './pages/RecuperarContrasenaPage';
import { NotFoundPage }     from './pages/PlaceholderPages';

export default function App() {
  return (
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
  );
}
