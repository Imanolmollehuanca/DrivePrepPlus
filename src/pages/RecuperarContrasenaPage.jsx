/* ============================================================
   DrivePrep+ — RecuperarContrasenaPage
   Recuperación de contraseña 100% interna (sin correos reales).
   Verifica el correo contra las cuentas registradas localmente
   y actualiza la contraseña directamente.
   TODO Fase 4: reemplazar por flujo real backend (token de un
   solo uso enviado por email + endpoint de reseteo verificado).
   ============================================================ */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Car, ArrowLeft, Lock, CheckCircle2, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BENEFICIOS = [
  'Simulacros con preguntas tipo MTC actualizadas',
  'Análisis de rendimiento por categoría',
  'Recomendaciones personalizadas de estudio',
  'Mejora progresiva, tu licencia',
];

export default function RecuperarContrasenaPage() {
  const navigate = useNavigate();
  const { recuperarContrasena } = useAuth();

  const [form, setForm] = useState({ email: '', nuevaContrasena: '', confirmar: '' });
  const [mostrarPass1, setMostrarPass1] = useState(false);
  const [mostrarPass2, setMostrarPass2] = useState(false);
  const [cargando, setCargando]         = useState(false);
  const [errores, setErrores]           = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [exito, setExito]               = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: '' }));
    setErrorGeneral('');
  };

  /* ── Validación local ──
     Las reglas de "cuenta no encontrada" y "contraseñas no coinciden"
     se muestran como error general porque son condiciones del flujo,
     no errores de formato de un campo individual. */
  const validar = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'El correo es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido.';

    if (!form.nuevaContrasena) e.nuevaContrasena = 'La nueva contraseña es obligatoria.';
    else if (form.nuevaContrasena.length < 8) e.nuevaContrasena = 'Mínimo 8 caracteres, incluye números y letras.';

    if (!form.confirmar) e.confirmar = 'Confirma tu nueva contraseña.';

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setErrorGeneral('');
    if (!validar()) return;

    if (form.nuevaContrasena !== form.confirmar) {
      setErrorGeneral('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);
    try {
      await recuperarContrasena({ email: form.email, nuevaContrasena: form.nuevaContrasena });
      setExito(true);
      /* Redirige al login después de mostrar el mensaje de éxito */
      setTimeout(() => navigate('/login'), 2200);
    } catch (err) {
      setErrorGeneral(err.message || 'No se pudo actualizar la contraseña. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo (hero) — idéntico al de LoginPage ── */}
      <div
        className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #4f46e5 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 20% 20%, #818cf8 0%, transparent 50%), radial-gradient(circle at 80% 80%, #a5b4fc 0%, transparent 50%)` }}
        />
        <div className="relative flex items-center gap-3">
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
              Practica con simulacros reales, identifica tus errores y mejora tu rendimiento.
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

      {/* ── Panel derecho (formulario de recuperación) ── */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background:'var(--color-bg)' }}>
        <div className="w-full max-w-[420px] space-y-7">

          {/* Volver al login */}
          <Link to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{ color:'var(--color-primary)', fontFamily:'var(--font-display)' }}>
            <ArrowLeft size={15} /> Volver al inicio de sesión
          </Link>

          {/* ── Pantalla de éxito ── */}
          {exito ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                   style={{ background:'#d1fae5' }}>
                <CheckCircle2 size={30} style={{ color:'#10b981' }} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                  Contraseña actualizada correctamente.
                </h2>
                <p className="mt-1 text-sm" style={{ color:'var(--color-text-secondary)', fontFamily:'var(--font-body)' }}>
                  Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
              </div>
              <div className="pt-2">
                <div className="w-6 h-6 rounded-full mx-auto animate-spin"
                     style={{ border:'2px solid #d1fae5', borderTopColor:'#10b981' }} />
                <p className="text-xs mt-3" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                  Redirigiendo al inicio de sesión...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Encabezado */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                     style={{ background:'#eef2ff' }}>
                  <Lock size={28} style={{ color:'var(--color-primary)' }} />
                </div>
                <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.5rem', color:'var(--color-text-primary)' }}>
                  Recuperar contraseña
                </h2>
                <p className="mt-1 text-sm" style={{ color:'var(--color-text-secondary)', fontFamily:'var(--font-body)' }}>
                  Ingresa tu correo y establece una nueva contraseña para tu cuenta de DrivePrep+.
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

                {/* Correo registrado */}
                <div>
                  <label className="form-label">Correo registrado</label>
                  <div className="relative">
                    <input name="email" type="email" autoComplete="email"
                      placeholder="tucorreo@ejemplo.com"
                      value={form.email} onChange={handleChange}
                      className={`form-input pr-10 ${errores.email ? 'border-red-400' : ''}`} />
                    <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2"
                          style={{ color:'var(--color-text-muted)' }} />
                  </div>
                  {errores.email && <p className="mt-1 text-xs text-red-500">{errores.email}</p>}
                </div>

                {/* Nueva contraseña */}
                <div>
                  <label className="form-label">Nueva contraseña</label>
                  <div className="relative">
                    <input name="nuevaContrasena"
                      type={mostrarPass1 ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={form.nuevaContrasena} onChange={handleChange}
                      className={`form-input pr-10 ${errores.nuevaContrasena ? 'border-red-400' : ''}`} />
                    <button type="button" tabIndex={-1}
                      onClick={() => setMostrarPass1((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color:'var(--color-text-muted)' }}>
                      {mostrarPass1 ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errores.nuevaContrasena
                    ? <p className="mt-1 text-xs text-red-500">{errores.nuevaContrasena}</p>
                    : <p className="mt-1 text-xs" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                        Mínimo 8 caracteres, incluye números y letras.
                      </p>
                  }
                </div>

                {/* Confirmar nueva contraseña */}
                <div>
                  <label className="form-label">Confirmar nueva contraseña</label>
                  <div className="relative">
                    <input name="confirmar"
                      type={mostrarPass2 ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={form.confirmar} onChange={handleChange}
                      className={`form-input pr-10 ${errores.confirmar ? 'border-red-400' : ''}`} />
                    <button type="button" tabIndex={-1}
                      onClick={() => setMostrarPass2((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color:'var(--color-text-muted)' }}>
                      {mostrarPass2 ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errores.confirmar && <p className="mt-1 text-xs text-red-500">{errores.confirmar}</p>}
                </div>

                {/* Botón submit */}
                <button type="submit" disabled={cargando}
                  className="btn-primary w-full justify-center text-base py-3 disabled:opacity-70 disabled:cursor-not-allowed">
                  {cargando
                    ? <><div className="spinner" />Actualizando...</>
                    : <><Lock size={16} />Cambiar contraseña</>
                  }
                </button>
              </form>

              {/* Nota informativa */}
              <div className="p-3 rounded-lg flex items-start gap-2"
                   style={{ background:'#d1fae5', border:'1px solid #a7f3d0' }}>
                <CheckCircle2 size={15} style={{ color:'#10b981' }} className="shrink-0 mt-0.5" />
                <p className="text-xs" style={{ color:'#065f46', fontFamily:'var(--font-body)' }}>
                  Si el correo existe, podrás cambiar tu contraseña.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
