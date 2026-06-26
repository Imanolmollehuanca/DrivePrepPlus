/* ============================================================
   DrivePrep+ — TemaContext
   Gestiona el tema visual (claro / oscuro / automático).
   Aplica la clase "dark" en <html> y persiste en localStorage.
   ============================================================ */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { leerJSON, guardarJSON } from '../utils/storageUsuario';

const TemaContext = createContext(null);

/* Clave propia para tema (antes compartía 'driveprep_ajustes' con
   IdiomaContext, lo que provocaba que uno pisara el valor del otro
   cada vez que se guardaba). Ahora además queda aislada por usuario. */
const KEY = 'driveprep_ajustes_tema';

function leerTemaGuardado(userId) {
  const data = leerJSON(KEY, userId, {});
  return data.tema || 'auto';
}

function resolverTema(tema) {
  if (tema === 'oscuro') return true;
  if (tema === 'claro')  return false;
  // 'auto' → detectar preferencia del sistema
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export function TemaProvider({ children }) {
  const { usuario } = useAuth();
  const userId = usuario?.id || null;

  const [tema, setTema] = useState(() => leerTemaGuardado(userId));

  const aplicar = useCallback((t) => {
    const esDark = resolverTema(t);
    document.documentElement.classList.toggle('dark', esDark);
  }, []);

  // Aplicar al montar y cuando cambia el tema
  useEffect(() => { aplicar(tema); }, [tema, aplicar]);

  // Al cambiar de cuenta, cargar el tema guardado de la nueva cuenta
  // en vez de mantener el de la sesión anterior.
  useEffect(() => {
    setTema(leerTemaGuardado(userId));
  }, [userId]);

  // Escuchar cambios del sistema cuando está en "auto"
  useEffect(() => {
    if (tema !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => aplicar('auto');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [tema, aplicar]);

  const cambiarTema = useCallback((nuevoTema) => {
    setTema(nuevoTema);
    aplicar(nuevoTema);
    const datos = leerJSON(KEY, userId, {});
    guardarJSON(KEY, userId, { ...datos, tema: nuevoTema });
  }, [aplicar, userId]);

  return (
    <TemaContext.Provider value={{ tema, cambiarTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const ctx = useContext(TemaContext);
  if (!ctx) throw new Error('useTema debe usarse dentro de <TemaProvider>');
  return ctx;
}
