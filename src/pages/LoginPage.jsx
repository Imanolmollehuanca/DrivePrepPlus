/* ============================================================
   DrivePrep+ — LoginPage + RegistroPage unificados
   Detecta la ruta actual para mostrar login o registro.
   ============================================================ */

import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Car, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import loginHero from '../assets/images/login-hero.png';


const BENEFICIOS = [
  'Simulacros con preguntas tipo MTC actualizadas',
  'Análisis de rendimiento por categoría',
  'Recomendaciones personalizadas de estudio',
  'Historial completo de tu progreso',
];

export default function LoginPage() {
  const navigate       = useNavigate();
  const location       = useLocation();
  const { iniciarSesion, registrar, iniciarSesionConGoogle } = useAuth();
  const esRegistro     = location.pathname === '/registro';

  /* ── Estado del formulario ── */
  const [form, setForm] = useState({ nombre: '', email: '', contrasena: '', confirmar: '' });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando]               = useState(false);
  const [errores,  setErrores]                = useState({});
  const [errorGeneral, setErrorGeneral]       = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: '' }));
    setErrorGeneral('');
  };

  /* ── Validación ── */
  const validar = () => {
    const e = {};
    if (esRegistro && !form.nombre.trim()) e.nombre = 'El nombre es obligatorio.';
    if (!form.email.trim()) e.email = 'El correo es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido.';
    if (!form.contrasena) e.contrasena = 'La contraseña es obligatoria.';
    else if (form.contrasena.length < 6) e.contrasena = 'Mínimo 6 caracteres.';
    if (esRegistro && form.contrasena !== form.confirmar) e.confirmar = 'Las contraseñas no coinciden.';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  /* ── Botón "Continuar con Google" ──
     TODO Fase 4: conectar con el SDK real de Google.
     Por ahora es solo un elemento visual, sin funcionalidad. */

  /* ── Submit ── */
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validar()) return;
    setCargando(true);
    try {
      if (esRegistro) {
        await registrar({ nombre: form.nombre, email: form.email, contrasena: form.contrasena });
      } else {
        await iniciarSesion({ email: form.email, contrasena: form.contrasena });
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorGeneral(err.message || (esRegistro ? 'Error al crear la cuenta.' : 'Error al iniciar sesión.'));
    } finally {
      setCargando(false);
    }
  };

  /* FUNCIÓN ES NUEVA */
  const handleGoogleLogin = async () => {
    try {
      await iniciarSesionConGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setErrorGeneral('No se pudo iniciar sesión con Google');
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo (hero) ── */}
      <div
        className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #4f46e5 100%)' }}
      >
        {/* imagen */}
        <div
        className="absolute inset-0"
        style={{backgroundImage: `url(${loginHero})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>        
        </div>
        {/* oscuro */}
        <div 
        className="absolute inset-0"
        style={{ background: 'linear-gradient(15,23,42,0.45), rgba(49,46,129,0.55))' }}></div>
        
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 20% 20%, #818cf8 0%, transparent 50%), radial-gradient(circle at 80% 80%, #a5b4fc 0%, transparent 50%)` }}
        />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Car size={22} className="text-white" />
          </div>
          <div>
            <span className="text-white font-extrabold text-xl" style={{ fontFamily:'var(--font-display)' }}>
              DrivePrep<span className="text-indigo-300">+</span>
            </span>
            <p className="text-indigo-300 text-xs" style={{ fontFamily:'var(--font-body)' }}>
              Preparación Teórica MTC · Perú
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <p className="text-indigo-300 text-sm font-semibold tracking-widest uppercase" style={{ fontFamily:'var(--font-display)' }}>
              Tu licencia de conducir te espera
            </p>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight" style={{ fontFamily:'var(--font-display)' }}>
              Aprobar tu examen<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage:'linear-gradient(90deg, #a5b4fc, #34d399)' }}>
                teórico del MTC
              </span><br />
              es posible.
            </h1>
            <p className="text-indigo-200 text-base max-w-sm leading-relaxed" style={{ fontFamily:'var(--font-body)' }}>
              Practica con simulacros reales, identifica tus errores y mejora tu rendimiento día a día.
            </p>
          </div>
          <ul className="space-y-3">
            {BENEFICIOS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-indigo-100 text-sm" style={{ fontFamily:'var(--font-body)' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <p className="text-indigo-400 text-xs" style={{ fontFamily:'var(--font-body)' }}>
            © {new Date().getFullYear()} DrivePrep+. Basado en el Reglamento Nacional de Tránsito.
          </p>
        </div>
      </div>

      {/* ── Panel derecho (formulario) ── */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background:'var(--color-bg)' }}>
        <div className="w-full max-w-[420px] space-y-7">

          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-2 mb-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Car size={18} className="text-white" />
            </div>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.15rem', color:'var(--color-text-primary)' }}>
              DrivePrep<span style={{ color:'var(--color-primary)' }}>+</span>
            </span>
          </div>

          {/* Encabezado dinámico */}
          <div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.65rem', color:'var(--color-text-primary)' }}>
              {esRegistro ? 'Crea tu cuenta' : (
                <>¡Bienvenido a{' '}<span style={{ color:'var(--color-primary)' }}>DrivePrep+</span>!</>
              )}
            </h2>
            <p className="mt-1 text-sm" style={{ color:'var(--color-text-secondary)', fontFamily:'var(--font-body)' }}>
              {esRegistro
                ? 'Regístrate gratis y comienza a prepararte hoy.'
                : 'Inicia sesión para continuar con tu preparación.'}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {errorGeneral && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                <span className="text-red-500 text-xs">⚠</span>
                <p className="text-sm text-red-600" style={{ fontFamily:'var(--font-body)' }}>{errorGeneral}</p>
              </div>
            )}

            {/* Nombre (solo registro) */}
            {esRegistro && (
              <div>
                <label className="form-label">Nombre completo</label>
                <input name="nombre" type="text" autoComplete="name"
                  placeholder="Tu nombre completo"
                  value={form.nombre} onChange={handleChange}
                  className={`form-input ${errores.nombre ? 'border-red-400' : ''}`} />
                {errores.nombre && <p className="mt-1 text-xs text-red-500">{errores.nombre}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="form-label">Correo electrónico</label>
              <input name="email" type="email" autoComplete="email"
                placeholder="tucorreo@ejemplo.com"
                value={form.email} onChange={handleChange}
                className={`form-input ${errores.email ? 'border-red-400' : ''}`} />
              {errores.email && <p className="mt-1 text-xs text-red-500">{errores.email}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <label className="form-label">Contraseña</label>
              <div className="relative">
                <input name="contrasena"
                  type={mostrarPassword ? 'text' : 'password'}
                  autoComplete={esRegistro ? 'new-password' : 'current-password'}
                  placeholder="Tu contraseña"
                  value={form.contrasena} onChange={handleChange}
                  className={`form-input pr-10 ${errores.contrasena ? 'border-red-400' : ''}`} />
                <button type="button" tabIndex={-1}
                  onClick={() => setMostrarPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color:'var(--color-text-muted)' }}>
                  {mostrarPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errores.contrasena && <p className="mt-1 text-xs text-red-500">{errores.contrasena}</p>}
            </div>

            {/* Confirmar contraseña (solo registro) */}
            {esRegistro && (
              <div>
                <label className="form-label">Confirmar contraseña</label>
                <input name="confirmar" type="password" autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                  value={form.confirmar} onChange={handleChange}
                  className={`form-input ${errores.confirmar ? 'border-red-400' : ''}`} />
                {errores.confirmar && <p className="mt-1 text-xs text-red-500">{errores.confirmar}</p>}
              </div>
            )}

            {/* Recordarme / Olvidé (solo login) */}
            {!esRegistro && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor:'var(--color-primary)' }} />
                  <span className="text-sm" style={{ color:'var(--color-text-secondary)', fontFamily:'var(--font-body)' }}>
                    Recordarme
                  </span>
                </label>
                <Link to="/recuperar-contrasena" className="text-sm font-semibold"
                  style={{ color:'var(--color-primary)', fontFamily:'var(--font-display)' }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            {/* Botón submit  */}
            <button type="submit" disabled={cargando}
              className="btn-primary w-full justify-center text-base py-3 disabled:opacity-70 disabled:cursor-not-allowed">
              {cargando ? (
                <><div className="spinner" />{esRegistro ? 'Creando cuenta...' : 'Iniciando sesión...'}</>
              ) : (
                <>{esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}<ArrowRight size={17} /></>
              )}
            </button>

            {/* Divisor */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background:'var(--color-border)' }} />
              <span className="text-xs" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                o continúa con
              </span>
              <div className="flex-1 h-px" style={{ background:'var(--color-border)' }} />
            </div>

            {/* OAuth — solo Google, únicamente visual por ahora cursor-not-allowed*/}
            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer hover:opacity-90"
              style={{ border:'1.5px solid var(--color-border)', background:'var(--color-card)', color:'var(--color-text-primary)', fontFamily:'var(--font-display)' }}>
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><path d="M47.532 24.552c0-1.636-.132-3.222-.396-4.756H24v9.01h13.2c-.576 3.06-2.28 5.652-4.824 7.392v6.156h7.8c4.548-4.2 7.356-10.38 7.356-17.802z" fill="#4285F4"/><path d="M24 48c6.6 0 12.132-2.184 16.176-5.916l-7.8-6.072c-2.148 1.44-4.896 2.292-8.376 2.292-6.444 0-11.904-4.356-13.86-10.2H2.052v6.24C6.072 42.624 14.436 48 24 48z" fill="#34A853"/><path d="M10.14 28.104A14.988 14.988 0 019.36 24c0-1.428.252-2.808.78-4.104v-6.24H2.052A23.952 23.952 0 000 24c0 3.876.924 7.548 2.052 10.344l8.088-6.24z" fill="#FBBC05"/><path d="M24 9.504c3.624 0 6.876 1.248 9.432 3.684l7.044-7.044C36.12 2.4 30.6 0 24 0 14.436 0 6.072 5.376 2.052 13.656l8.088 6.24C12.096 13.86 17.556 9.504 24 9.504z" fill="#EA4335"/></svg>
              Continuar con Google
            </button>
          </form>

          {/* Toggle login / registro */}
          <p className="text-center text-sm" style={{ color:'var(--color-text-secondary)', fontFamily:'var(--font-body)' }}>
            {esRegistro ? (
              <>¿Ya tienes cuenta?{' '}
                <Link to="/login" className="font-semibold" style={{ color:'var(--color-primary)', fontFamily:'var(--font-display)' }}>
                  Inicia sesión
                </Link>
              </>
            ) : (
              <>¿No tienes cuenta?{' '}
                <Link to="/registro" className="font-semibold" style={{ color:'var(--color-primary)', fontFamily:'var(--font-display)' }}>
                  Regístrate aquí
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
