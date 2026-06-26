/* ============================================================
   DrivePrep+ — AuthContext
   Gestiona el estado de autenticación de forma global.
   FASE 3 — autenticación social (Google/Facebook) + aislamiento
   de datos por usuario.
   TODO Fase 4: reemplazar la persistencia local por API real
   (POST /api/auth/login, /api/auth/registro, /api/auth/google,
   /api/auth/facebook, todos devolviendo JWT).
   ============================================================ */

import { createContext, useContext, useState, useEffect } from 'react';
import { mockUser } from '../data/mockData';
import { migrarDatosHuérfanos } from '../utils/storageUsuario';

/* ── Contexto ── */
const AuthContext = createContext(null);

/* ── Clave de almacenamiento de cuentas registradas (global, no por usuario:
     es precisamente el "directorio" de todas las cuentas) ── */
const KEY_CUENTAS = 'driveprep_cuentas_locales';

/* ── Hash simple para no guardar la contraseña en texto plano ──
   NOTA: esto es solo para esta demo basada en localStorage.
   En Fase 4 el hash de contraseñas debe hacerse en el backend
   con bcrypt/argon2; el cliente nunca debe calcular el hash. */
function hashSimple(texto) {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

/* ── Leer / guardar el "registro" local de cuentas ── */
function leerCuentasLocales() {
  try { return JSON.parse(localStorage.getItem(KEY_CUENTAS) || '[]'); }
  catch { return []; }
}
function guardarCuentaLocal(cuenta) {
  try {
    const cuentas = leerCuentasLocales();
    const idx = cuentas.findIndex((c) => c.email === cuenta.email);
    if (idx >= 0) cuentas[idx] = cuenta; else cuentas.push(cuenta);
    localStorage.setItem(KEY_CUENTAS, JSON.stringify(cuentas));
  } catch { /* ignore */ }
}

/* ── Valores iniciales para una cuenta completamente nueva ──
   Esto es lo que pide la consigna: todo en cero, idioma español,
   tema automático, plan gratuito. Los hooks de historial/práctica
   ya devuelven estos valores por defecto cuando no encuentran data
   en su namespace, así que aquí solo dejamos explícito el modelo
   base del usuario — el resto de módulos "nace en cero" porque
   simplemente no existe ninguna clave todavía bajo su nuevo userId. */
function crearPerfilNuevo({ id, nombre, email, proveedor }) {
  return {
    ...mockUser,
    id,
    nombre,
    email,
    proveedor,                 // 'email' | 'google' | 'facebook'
    plan:             'gratuito',
    estadoSuscripcion: null,
    fechaRegistro:    new Date().toISOString(),
  };
}

/* ── Simuladores de login social ──
   En un entorno real esto vendría del SDK de Google/Facebook con
   un token que el backend valida. Aquí, para la demo de Fase 3,
   generamos una identidad determinística a partir de un correo de
   ejemplo, de forma que volver a "iniciar sesión con Google" desde
   el mismo navegador siempre devuelva la MISMA cuenta — no una nueva
   cada vez — igual que pasaría con una cuenta social real.
   TODO Fase 4: reemplazar por el flujo OAuth real (popup/redirect). */
function generarIdentidadSocialDemo(proveedor) {
  const KEY = `driveprep_identidad_demo_${proveedor}`;
  let email = localStorage.getItem(KEY);
  if (!email) {
    const sufijo = Math.random().toString(36).slice(2, 8);
    email = `usuario.${proveedor}.${sufijo}@${proveedor}-demo.com`;
    localStorage.setItem(KEY, email);
  }
  const nombre = proveedor === 'google' ? 'Usuario de Google' : 'Usuario de Facebook';
  return { email, nombre };
}

/* ── Provider ── */
export function AuthProvider({ children }) {
  const [usuario, setUsuario]   = useState(null);
  const [cargando, setCargando] = useState(true);

  /* Restaurar sesión activa al montar */
  useEffect(() => {
    const sesionGuardada = localStorage.getItem('driveprep_session');
    if (sesionGuardada) {
      try {
        const datos = JSON.parse(sesionGuardada);
        setUsuario(datos);
        /* Asegura que, si esta cuenta tenía datos "viejos" sin
           namespace (de antes de implementar el aislamiento),
           se copien una sola vez a su espacio propio. */
        migrarDatosHuérfanos(datos.id);
      } catch {
        localStorage.removeItem('driveprep_session');
      }
    }
    setCargando(false);
  }, []);

  /* ── Establece la sesión activa + dispara migración de datos huérfanos ── */
  const activarSesion = (datosPublicos) => {
    setUsuario(datosPublicos);
    localStorage.setItem('driveprep_session', JSON.stringify(datosPublicos));
    migrarDatosHuérfanos(datosPublicos.id);
  };

  /* ── Iniciar sesión con correo y contraseña (SOLO cuentas existentes) ──
     TODO Fase 4: reemplazar por POST /api/auth/login */
  const iniciarSesion = async ({ email, contrasena }) => {
    await new Promise((res) => setTimeout(res, 700));

    if (!email || !contrasena) {
      throw new Error('Correo y contraseña son obligatorios.');
    }

    const emailNormalizado = email.trim().toLowerCase();
    const cuentas = leerCuentasLocales();
    const cuenta  = cuentas.find((c) => c.email === emailNormalizado);

    if (!cuenta) {
      throw new Error('Cuenta no encontrada.');
    }
    if (cuenta.proveedor && cuenta.proveedor !== 'email') {
      throw new Error(`Esta cuenta usa inicio de sesión con ${cuenta.proveedor === 'google' ? 'Google' : 'Facebook'}.`);
    }
    if (cuenta.passwordHash !== hashSimple(contrasena)) {
      throw new Error('Contraseña incorrecta.');
    }

    const { passwordHash, ...datosPublicos } = cuenta;
    activarSesion(datosPublicos);
    return datosPublicos;
  };

  /* ── Registrar nueva cuenta con correo y contraseña ──
     TODO Fase 4: reemplazar por POST /api/auth/registro */
  const registrar = async ({ nombre, email, contrasena }) => {
    await new Promise((res) => setTimeout(res, 900));

    if (!nombre?.trim() || !email || !contrasena) {
      throw new Error('Todos los campos son obligatorios.');
    }

    const emailNormalizado = email.trim().toLowerCase();
    const cuentas = leerCuentasLocales();

    if (cuentas.some((c) => c.email === emailNormalizado)) {
      throw new Error('Ya existe una cuenta registrada con este correo.');
    }

    const nuevaCuenta = {
      ...crearPerfilNuevo({ id: Date.now(), nombre: nombre.trim(), email: emailNormalizado, proveedor: 'email' }),
      passwordHash: hashSimple(contrasena),
    };

    guardarCuentaLocal(nuevaCuenta);

    const { passwordHash, ...datosPublicos } = nuevaCuenta;
    activarSesion(datosPublicos);
    return datosPublicos;
  };

  /* ── Login social genérico (Google / Facebook) ──
     Comportamiento pedido:
     - Primera vez con ese proveedor → crea la cuenta con todo en cero.
     - Si ya existe → carga su información real, tal cual está guardada.
     TODO Fase 4: reemplazar generarIdentidadSocialDemo() por el SDK
     real de Google/Facebook, que entrega el email y nombre verificados;
     el resto de esta función (buscar o crear cuenta) se mantiene igual. */
  const iniciarSesionConProveedor = async (proveedor) => {
    await new Promise((res) => setTimeout(res, 800));

    const { email, nombre } = generarIdentidadSocialDemo(proveedor);
    const cuentas  = leerCuentasLocales();
    const existente = cuentas.find((c) => c.email === email);

    if (existente) {
      /* Usuario existente: cargar su información real tal cual está */
      const { passwordHash, ...datosPublicos } = existente;
      activarSesion(datosPublicos);
      return { datos: datosPublicos, esNuevo: false };
    }

    /* Primera vez con este proveedor: crear cuenta con todo en cero */
    const nuevaCuenta = crearPerfilNuevo({ id: Date.now(), nombre, email, proveedor });
    guardarCuentaLocal(nuevaCuenta);
    activarSesion(nuevaCuenta);
    return { datos: nuevaCuenta, esNuevo: true };
  };

  const iniciarSesionConGoogle   = () => iniciarSesionConProveedor('google');
  const iniciarSesionConFacebook = () => iniciarSesionConProveedor('facebook');

  /* ── Recuperar contraseña (cuenta interna, sin correos reales) ──
     Verifica que el correo exista y actualiza directamente el hash
     de la contraseña en el "registro" local de cuentas.
     TODO Fase 4: reemplazar por un flujo real de recuperación en el
     backend (token de un solo uso + endpoint de reseteo), nunca
     permitiendo cambiar la contraseña sin verificar identidad. */
  const recuperarContrasena = async ({ email, nuevaContrasena }) => {
    await new Promise((res) => setTimeout(res, 700));

    if (!email || !nuevaContrasena) {
      throw new Error('Correo y nueva contraseña son obligatorios.');
    }

    const emailNormalizado = email.trim().toLowerCase();
    const cuentas = leerCuentasLocales();
    const idx = cuentas.findIndex((c) => c.email === emailNormalizado);

    if (idx === -1) {
      throw new Error('Cuenta no encontrada.');
    }

    cuentas[idx] = { ...cuentas[idx], passwordHash: hashSimple(nuevaContrasena) };
    localStorage.setItem(KEY_CUENTAS, JSON.stringify(cuentas));

    /* Si la cuenta afectada es la que tiene sesión activa, no la cerramos:
       el flujo de recuperación se hace desde la pantalla pública de login,
       así que normalmente no habrá sesión activa en este punto. */
    return true;
  };

  /* ── Cerrar sesión ──
     Solo se borra la sesión activa. Los datos de cada usuario quedan
     intactos bajo su propio namespace (claveUsuario), listos para
     cuando vuelva a iniciar sesión. Esto es lo que garantiza que al
     entrar con OTRA cuenta no se vea ningún dato de la anterior:
     el estado en memoria de React se reinicia (usuario = null) y
     cada hook vuelve a leer su propio namespace cuando el nuevo
     usuario inicia sesión. */
  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('driveprep_session');
  };

  /* ── Cambiar nombre ── */
  const cambiarNombre = async (nuevoNombre) => {
    await new Promise((res) => setTimeout(res, 500));
    const nombre = nuevoNombre.trim();
    if (!nombre) throw new Error('El nombre no puede estar vacío.');
    const cambios = { nombre };
    const actualizado = { ...usuario, ...cambios };
    setUsuario(actualizado);
    localStorage.setItem('driveprep_session', JSON.stringify(actualizado));
    try {
      const cuentas = leerCuentasLocales();
      const idx = cuentas.findIndex((c) => c.email === actualizado.email);
      if (idx >= 0) {
        cuentas[idx] = { ...cuentas[idx], nombre };
        localStorage.setItem(KEY_CUENTAS, JSON.stringify(cuentas));
      }
    } catch { /* ignore */ }
    return true;
  };

  /* ── Cambiar correo ── */
  const cambiarEmail = async ({ nuevoEmail, contrasena }) => {
    await new Promise((res) => setTimeout(res, 700));
    const emailNorm = nuevoEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNorm)) throw new Error('formato');
    if (emailNorm === usuario.email) throw new Error('igual');
    const cuentas = leerCuentasLocales();
    if (cuentas.some((c) => c.email === emailNorm)) throw new Error('registrado');
    // Verificar contraseña (solo cuentas de tipo 'email')
    if (usuario.proveedor === 'email') {
      const cuenta = cuentas.find((c) => c.email === usuario.email);
      if (!cuenta || cuenta.passwordHash !== hashSimple(contrasena)) throw new Error('pass_err');
    }
    // Actualizar email en el registro de cuentas
    const idx = cuentas.findIndex((c) => c.email === usuario.email);
    if (idx >= 0) {
      cuentas[idx] = { ...cuentas[idx], email: emailNorm };
      localStorage.setItem(KEY_CUENTAS, JSON.stringify(cuentas));
    }
    const actualizado = { ...usuario, email: emailNorm };
    setUsuario(actualizado);
    localStorage.setItem('driveprep_session', JSON.stringify(actualizado));
    return true;
  };

  /* ── Cambiar contraseña ── */
  const cambiarContrasena = async ({ contrasenaActual, nuevaContrasena, confirmar }) => {
    await new Promise((res) => setTimeout(res, 700));
    if (usuario.proveedor && usuario.proveedor !== 'email') throw new Error('social');
    if (nuevaContrasena.length < 6) throw new Error('corta');
    if (nuevaContrasena !== confirmar) throw new Error('no_coincide');
    const cuentas = leerCuentasLocales();
    const idx = cuentas.findIndex((c) => c.email === usuario.email);
    if (idx < 0 || cuentas[idx].passwordHash !== hashSimple(contrasenaActual)) throw new Error('actual_err');
    cuentas[idx] = { ...cuentas[idx], passwordHash: hashSimple(nuevaContrasena) };
    localStorage.setItem(KEY_CUENTAS, JSON.stringify(cuentas));
    return true;
  };

  /* ── Actualizar datos del usuario (perfil, plan, etc.) ── */
  const actualizarUsuario = (cambios) => {
    const actualizado = { ...usuario, ...cambios };
    setUsuario(actualizado);
    localStorage.setItem('driveprep_session', JSON.stringify(actualizado));

    /* Sincronizar también con el "registro" de cuentas, preservando el hash */
    try {
      const cuentas = leerCuentasLocales();
      const idx = cuentas.findIndex((c) => c.email === actualizado.email);
      if (idx >= 0) {
        cuentas[idx] = { ...cuentas[idx], ...cambios };
        localStorage.setItem(KEY_CUENTAS, JSON.stringify(cuentas));
      }
    } catch { /* ignore */ }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        estaAutenticado: !!usuario,
        esPremium: usuario?.plan === 'premium' && usuario?.estadoSuscripcion !== 'cancelado',
        iniciarSesion,
        registrar,
        recuperarContrasena,
        iniciarSesionConGoogle,
        iniciarSesionConFacebook,
        cerrarSesion,
        actualizarUsuario,
        cambiarNombre,
        cambiarEmail,
        cambiarContrasena,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ── Hook ── */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
