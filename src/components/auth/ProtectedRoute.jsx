/* ============================================================
   DrivePrep+ — ProtectedRoute
   Redirige al login si el usuario no está autenticado.
   ============================================================ */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { estaAutenticado, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-sm text-[var(--color-text-muted)] font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return estaAutenticado ? <Outlet /> : <Navigate to="/login" replace />;
}
