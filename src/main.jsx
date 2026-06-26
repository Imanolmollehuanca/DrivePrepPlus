/* ============================================================
   DrivePrep+ — main.jsx
   Punto de entrada de la aplicación.
   ============================================================ */

import { StrictMode }      from 'react';
import { createRoot }      from 'react-dom/client';
import { BrowserRouter }   from 'react-router-dom';
import { AuthProvider }    from './context/AuthContext';
import { TemaProvider }    from './context/TemaContext';
import { IdiomaProvider }  from './context/IdiomaContext';
import { PremiumProvider } from './context/PremiumContext';
import App                 from './App';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TemaProvider>
          <IdiomaProvider>
            <PremiumProvider>
              <App />
            </PremiumProvider>
          </IdiomaProvider>
        </TemaProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
