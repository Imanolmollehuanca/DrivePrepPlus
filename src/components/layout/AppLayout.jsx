/* ============================================================
   DrivePrep+ — AppLayout
   Incluye el modal global de límite Premium.
   ============================================================ */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar            from './Sidebar';
import Topbar             from './Topbar';
import ModalLimitePremium from '../ui/ModalLimitePremium';

export default function AppLayout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar abierto={sidebarAbierto} onCerrar={() => setSidebarAbierto(false)} />

      <div className="main-content">
        <Topbar onToggleSidebar={() => setSidebarAbierto((v) => !v)} />
        <main className="flex-1 p-5 lg:p-7">
          <Outlet />
        </main>
      </div>

      {/* Modal global de límite Premium */}
      <ModalLimitePremium />
    </div>
  );
}
