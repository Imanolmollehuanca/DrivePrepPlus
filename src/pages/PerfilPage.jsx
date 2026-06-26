/* ============================================================
   DrivePrep+ — PerfilPage
   Perfil del usuario: datos personales, conducción, nivel de
   preparación, resumen rápido y sistema de logros.
   TODO Fase 4: conectar con GET /api/perfil/:userId
   ============================================================ */

import { useState }    from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, CreditCard, Calendar, Car, Shield,
  ClipboardList, TrendingUp, Star, Clock,
  Edit2, Check, X, ChevronRight, Lock,
  BarChart2, BookOpen, Target, Crown, AlertTriangle,
} from 'lucide-react';
import { usePerfil }                from '../hooks/usePerfil';
import { useAuth }                  from '../context/AuthContext';
import { usePremium, PLANES }       from '../context/PremiumContext';
import { ProgressRing }             from '../components/ui/UIComponents';
import { guardarPerfilExtra }        from '../hooks/usePerfil';

/* ── Avatar con iniciales ── */
function Avatar({ nombre, size = 'xl' }) {
  const iniciales = (nombre || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

  const sizes = {
    sm:  { box: 'w-10 h-10', text: 'text-sm'   },
    md:  { box: 'w-14 h-14', text: 'text-lg'   },
    xl:  { box: 'w-28 h-28', text: 'text-4xl'  },
  };
  const s = sizes[size] || sizes.xl;

  return (
    <div
      className={`${s.box} rounded-full flex items-center justify-center font-extrabold text-white select-none`}
      style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        fontFamily: 'var(--font-display)',
        boxShadow:  '0 4px 20px rgba(99,102,241,0.35)',
      }}
    >
      <span className={s.text}>{iniciales}</span>
    </div>
  );
}

/* ── Campo editable inline ── */
function CampoEditable({ label, valor, placeholder, onGuardar }) {
  const [editando, setEditando] = useState(false);
  const [draft,    setDraft]    = useState(valor || '');

  const guardar = () => {
    onGuardar(draft.trim());
    setEditando(false);
  };
  const cancelar = () => {
    setDraft(valor || '');
    setEditando(false);
  };

  if (editando) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') guardar(); if (e.key === 'Escape') cancelar(); }}
          className="form-input py-1.5 text-sm flex-1"
          placeholder={placeholder}
        />
        <button onClick={guardar}   className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors">
          <Check size={13} className="text-green-600" />
        </button>
        <button onClick={cancelar}  className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <X size={13} className="text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <span className="text-sm font-semibold flex-1"
            style={{ fontFamily:'var(--font-display)', color: valor ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
        {valor || placeholder}
      </span>
      <button onClick={() => setEditando(true)}
              className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center hover:bg-indigo-100 transition-all">
        <Edit2 size={11} className="text-gray-400 hover:text-indigo-500" />
      </button>
    </div>
  );
}

/* ── Tarjeta de logro ── */
function TarjetaLogro({ logro }) {
  return (
    <div
      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 text-center transition-all duration-200
                  ${logro.desbloqueado ? 'hover:-translate-y-0.5 hover:shadow-card-hover' : 'opacity-50'}`}
      style={{
        borderColor: logro.desbloqueado ? `${logro.color}35` : 'var(--color-border)',
        background:  logro.desbloqueado ? logro.bg : '#fafafa',
      }}
    >
      {/* Emoji del logro */}
      <div className="relative">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-200"
          style={{
            background: logro.desbloqueado
              ? `linear-gradient(135deg, ${logro.bg}, white)`
              : '#f1f5f9',
            boxShadow: logro.desbloqueado
              ? `0 4px 16px ${logro.color}25`
              : 'none',
          }}
        >
          {logro.desbloqueado ? logro.emoji : <Lock size={22} className="text-gray-300" />}
        </div>
        {/* Destello decorativo */}
        {logro.desbloqueado && (
          <>
            <span className="absolute -top-1 -right-1 text-xs">✨</span>
            <span className="absolute -bottom-1 -left-1 text-xs">✨</span>
          </>
        )}
      </div>

      <div className="space-y-0.5">
        <p className="text-xs font-extrabold leading-tight"
           style={{
             fontFamily: 'var(--font-display)',
             color: logro.desbloqueado ? logro.color : 'var(--color-text-muted)',
           }}>
          {logro.titulo}
        </p>
        {logro.desbloqueado && (
          <p className="text-[10px] leading-snug"
             style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
            {logro.descripcion}
          </p>
        )}
      </div>

      {/* Badge desbloqueado */}
      {logro.desbloqueado && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background:`${logro.color}20`, color: logro.color, fontFamily:'var(--font-display)' }}>
          ¡Desbloqueado!
        </span>
      )}
    </div>
  );
}

/* ── Fila de información ── */
function FilaInfo({ icono: Ico, label, children, color = '#6366f1' }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b last:border-0"
         style={{ borderColor:'var(--color-border)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
           style={{ background:`${color}12` }}>
        <Ico size={15} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide mb-0.5"
           style={{ fontFamily:'var(--font-display)', color:'var(--color-text-muted)' }}>
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

/* ── Opciones de licencia y vehículo ── */
const TIPOS_LICENCIA  = ['A-I','A-IIa','A-IIb','A-IIIa','A-IIIb','A-IIIc','B-I','B-IIa','B-IIb','B-IIc'];
const TIPOS_VEHICULO  = ['Automóvil mecánico','Automóvil automático','Moto','Camioneta','Camión','Minibús','Bus','Ninguno'];

/* ── Formatear fecha ISO a formato legible ── */
function formatearFecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-PE', { day:'numeric', month:'long', year:'numeric' });
}

/* ── Sección "Mi suscripción" ── */
function TarjetaSuscripcion({ datosUsuario, esPremiumActivo, onCancelar, onVerPlanes }) {
  const plan = PLANES.find((p) => p.id === datosUsuario.planActual);
  const tienePlanRegistrado = !!datosUsuario.planActual;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold flex items-center gap-2" style={{ fontFamily:'var(--font-display)' }}>
          <Crown size={16} style={{ color:'#f59e0b' }} />
          Mi suscripción
        </h2>
        {esPremiumActivo && (
          <span className="badge badge-warning text-xs px-3 py-1">Premium</span>
        )}
      </div>

      {!tienePlanRegistrado ? (
        <div className="text-center py-6 space-y-3">
          <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
            No tienes una suscripción Premium activa.
          </p>
          <button onClick={onVerPlanes} className="btn-primary text-sm py-2 px-5 mx-auto">
            Ver planes Premium
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          <FilaInfo icono={Crown} label="Plan actual" color="#f59e0b">
            <p className="text-sm font-semibold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
              {plan ? plan.id.charAt(0).toUpperCase() + plan.id.slice(1) : '—'}
            </p>
          </FilaInfo>

          <FilaInfo icono={Calendar} label="Fecha de inicio" color="#0ea5e9">
            <p className="text-sm font-semibold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
              {formatearFecha(datosUsuario.fechaInicioSuscripcion)}
            </p>
          </FilaInfo>

          <FilaInfo icono={Calendar} label="Fecha de renovación" color="#8b5cf6">
            <p className="text-sm font-semibold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
              {formatearFecha(datosUsuario.fechaRenovacionSuscripcion)}
            </p>
          </FilaInfo>

          <FilaInfo icono={Shield} label="Estado" color={esPremiumActivo ? '#10b981' : '#ef4444'}>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                background: esPremiumActivo ? '#d1fae5' : '#fee2e2',
                color:      esPremiumActivo ? '#15803d' : '#b91c1c',
                fontFamily: 'var(--font-display)',
              }}
            >
              {esPremiumActivo ? 'Activo' : 'Cancelado'}
            </span>
          </FilaInfo>

          {esPremiumActivo && (
            <button
              onClick={onCancelar}
              className="w-full mt-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors hover:bg-red-50"
              style={{ borderColor:'#fecaca', color:'#dc2626', fontFamily:'var(--font-display)' }}
            >
              Cancelar suscripción
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Modal de confirmación: cancelar suscripción ── */
function ModalCancelarSuscripcion({ onMantener, onConfirmar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }}>
      <div className="w-full max-w-sm rounded-2xl p-7 space-y-5 text-center"
           style={{ background:'var(--color-card)', boxShadow:'var(--shadow-card-hover)' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
             style={{ background:'#fef3c7' }}>
          <AlertTriangle size={26} style={{ color:'#f59e0b' }} />
        </div>
        <div className="space-y-1">
          <p className="font-extrabold text-lg" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
            ¿Cancelar suscripción?
          </p>
          <p className="text-sm leading-relaxed" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
            Si cancelas tu suscripción, perderás los beneficios Premium al finalizar tu periodo actual.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onMantener}
            className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors hover:bg-gray-50"
            style={{ borderColor:'var(--color-border)', color:'var(--color-text-secondary)', fontFamily:'var(--font-display)' }}>
            No, mantener
          </button>
          <button onClick={onConfirmar}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
            style={{ background:'#ef4444', fontFamily:'var(--font-display)' }}>
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════ */
export default function PerfilPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const {
    datosUsuario, nivelPreparacion,
    resumen, logros, logrosDesbloqueados, logrosBloqueados,
    actualizarPerfil,
  } = usePerfil();
  const {
    modalCancelar, abrirModalCancelar, cerrarModalCancelar, cancelarSuscripcion,
  } = usePremium();

  const [tabLogros, setTabLogros] = useState('desbloqueados');

  /* Solo es Premium activo si el plan es premium Y la suscripción no fue cancelada */
  const esPremium = datosUsuario.plan === 'premium' && datosUsuario.estadoSuscripcion !== 'cancelado';

  return (
    <div className="page-enter space-y-6 max-w-6xl mx-auto">

      {/* ── Encabezado de página ── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
             style={{ background:'#eef2ff' }}>
          <User size={24} style={{ color:'#6366f1' }} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold" style={{ fontFamily:'var(--font-display)' }}>
            Mi perfil
          </h1>
          <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
            Consulta tu información personal y tu progreso en DrivePrep+.
          </p>
        </div>
      </div>

      {/* ── Grid principal: info + panel lateral ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

        {/* ── Columna izquierda ── */}
        <div className="space-y-5">

          {/* ── INFORMACIÓN PERSONAL ── */}
          <div className="card p-6">
            <h2 className="text-base font-bold mb-5" style={{ fontFamily:'var(--font-display)' }}>
              Información personal
            </h2>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <Avatar nombre={datosUsuario.nombre} size="xl" />
                <p className="text-xs text-center"
                   style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)', maxWidth:'100px' }}>
                  Las fotos de perfil estarán disponibles en la Fase 4.
                </p>
              </div>

              {/* Campos */}
              <div className="flex-1 space-y-0">
                <FilaInfo icono={User} label="Nombre completo" color="#6366f1">
                  <CampoEditable
                    valor={datosUsuario.nombre}
                    placeholder="Tu nombre completo"
                    onGuardar={(v) => actualizarPerfil({ nombre: v })}
                  />
                </FilaInfo>

                <FilaInfo icono={Mail} label="Correo electrónico" color="#0ea5e9">
                  <p className="text-sm font-semibold"
                     style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                    {datosUsuario.email}
                  </p>
                  <p className="text-[10px]" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                    El correo se actualiza desde Ajustes.
                  </p>
                </FilaInfo>

                <FilaInfo icono={Shield} label="Método de inicio de sesión" color={
                  datosUsuario.proveedor === 'google'   ? '#ea4335' :
                  datosUsuario.proveedor === 'facebook' ? '#1877f2' : '#6366f1'
                }>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      fontFamily: 'var(--font-display)',
                      background: datosUsuario.proveedor === 'google'   ? '#fee2e2' :
                                  datosUsuario.proveedor === 'facebook' ? '#dbeafe' : '#eef2ff',
                      color:      datosUsuario.proveedor === 'google'   ? '#ea4335' :
                                  datosUsuario.proveedor === 'facebook' ? '#1877f2' : '#4338ca',
                    }}
                  >
                    {datosUsuario.proveedor === 'google'   && '🔴 Google'}
                    {datosUsuario.proveedor === 'facebook' && '🔵 Facebook'}
                    {(!datosUsuario.proveedor || datosUsuario.proveedor === 'email') && '✉️ Correo y contraseña'}
                  </span>
                </FilaInfo>

                <FilaInfo icono={CreditCard} label="Tipo de cuenta" color="#8b5cf6">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: esPremium ? 'linear-gradient(90deg,#fef3c7,#fde68a)' : '#f1f5f9',
                        color:      esPremium ? '#92400e' : '#64748b',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {esPremium ? '⭐ Premium' : 'Gratuita'}
                    </span>
                    {!esPremium && (
                      <button
                        onClick={() => navigate('/premium')}
                        className="text-xs font-semibold flex items-center gap-0.5"
                        style={{ color:'#6366f1', fontFamily:'var(--font-display)' }}
                      >
                        Mejorar <ChevronRight size={11} />
                      </button>
                    )}
                  </div>
                </FilaInfo>

                {datosUsuario.fechaRegistro && (
                  <FilaInfo icono={Calendar} label="Fecha de registro" color="#f59e0b">
                    <p className="text-sm font-semibold"
                       style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                      {datosUsuario.fechaRegistro}
                    </p>
                  </FilaInfo>
                )}
              </div>
            </div>
          </div>

          {/* ── INFORMACIÓN DE CONDUCCIÓN ── */}
          <div className="card p-6">
            <h2 className="text-base font-bold mb-4" style={{ fontFamily:'var(--font-display)' }}>
              Información de conducción
            </h2>
            <p className="text-xs mb-4" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
              Esta información personaliza tus simulacros. Puedes editarla en cualquier momento.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tipo de licencia */}
              <div className="p-4 rounded-xl border-2 space-y-2"
                   style={{ borderColor:'#6366f125', background:'#6366f108' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                       style={{ background:'#6366f115' }}>
                    <Shield size={15} style={{ color:'#6366f1' }} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide"
                     style={{ fontFamily:'var(--font-display)', color:'var(--color-text-muted)' }}>
                    Tipo de licencia
                  </p>
                </div>
                <select
                  value={datosUsuario.tipoLicencia || ''}
                  onChange={(e) => actualizarPerfil({ tipoLicencia: e.target.value })}
                  className="w-full text-sm font-bold bg-transparent border-0 outline-none cursor-pointer"
                  style={{ fontFamily:'var(--font-display)', color: datosUsuario.tipoLicencia ? '#6366f1' : 'var(--color-text-muted)' }}
                >
                  <option value="">Seleccionar...</option>
                  {TIPOS_LICENCIA.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Vehículo principal */}
              <div className="p-4 rounded-xl border-2 space-y-2"
                   style={{ borderColor:'#10b98125', background:'#10b98108' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                       style={{ background:'#10b98115' }}>
                    <Car size={15} style={{ color:'#10b981' }} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide"
                     style={{ fontFamily:'var(--font-display)', color:'var(--color-text-muted)' }}>
                    Vehículo principal
                  </p>
                </div>
                <select
                  value={datosUsuario.vehiculoPrincipal || ''}
                  onChange={(e) => actualizarPerfil({ vehiculoPrincipal: e.target.value })}
                  className="w-full text-sm font-bold bg-transparent border-0 outline-none cursor-pointer"
                  style={{ fontFamily:'var(--font-display)', color: datosUsuario.vehiculoPrincipal ? '#10b981' : 'var(--color-text-muted)' }}
                >
                  <option value="">Seleccionar...</option>
                  {TIPOS_VEHICULO.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ── RESUMEN RÁPIDO ── */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold" style={{ fontFamily:'var(--font-display)' }}>
                Resumen rápido
              </h2>
              <button
                onClick={() => navigate('/estadisticas')}
                className="text-xs font-semibold flex items-center gap-1"
                style={{ color:'#6366f1', fontFamily:'var(--font-display)' }}
              >
                Ver estadísticas <ChevronRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icono:ClipboardList, label:'Simulacros realizados', v: resumen.simulacrosRealizados, color:'#6366f1', bg:'#eef2ff', sub:'simulacros' },
                { icono:TrendingUp,    label:'Promedio general',       v: resumen.promedioPuntaje > 0 ? `${resumen.promedioPuntaje}%` : '—', color:'#10b981', bg:'#ecfdf5', sub:'de rendimiento' },
                { icono:Star,          label:'Mejor puntaje',          v: resumen.mejorPuntaje > 0 ? `${resumen.mejorPuntaje}%` : '—', color:'#f59e0b', bg:'#fef3c7', sub:'obtenido' },
                { icono:Clock,         label:'Tiempo de práctica',     v: resumen.tiempoTotal, color:'#ef4444', bg:'#fef2f2', sub:'horas' },
              ].map(({ icono:Ico, label, v, color, bg, sub }) => (
                <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-2xl"
                     style={{ background: bg }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                       style={{ background:'white', boxShadow:`0 2px 8px ${color}20` }}>
                    <Ico size={19} style={{ color }} />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-extrabold" style={{ fontFamily:'var(--font-display)', color }}>
                      {v || '—'}
                    </p>
                    <p className="text-[10px]" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── LOGROS ── */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold" style={{ fontFamily:'var(--font-display)' }}>
                  Logros
                </h2>
                <p className="text-xs mt-0.5"
                   style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                  {logrosDesbloqueados.length} de {logros.length} logros desbloqueados
                </p>
              </div>
              {/* Barra de logros */}
              <div className="flex items-center gap-3">
                <div className="progress-bar w-24 h-2">
                  <div className="progress-bar__fill"
                       style={{ width:`${(logrosDesbloqueados.length/logros.length)*100}%`, background:'linear-gradient(90deg,#f59e0b,#6366f1)' }} />
                </div>
                <span className="text-xs font-bold"
                      style={{ fontFamily:'var(--font-display)', color:'#f59e0b' }}>
                  {logrosDesbloqueados.length}/{logros.length}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              {[
                { id:'desbloqueados', label:`Desbloqueados (${logrosDesbloqueados.length})` },
                { id:'bloqueados',    label:`Por lograr (${logrosBloqueados.length})`         },
              ].map(({ id, label }) => (
                <button key={id} onClick={() => setTabLogros(id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                                    ${tabLogros===id ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        style={{ fontFamily:'var(--font-display)' }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Grid de logros */}
            {tabLogros === 'desbloqueados' && (
              logrosDesbloqueados.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="text-5xl">🎯</div>
                  <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                    Aún no tienes logros. ¡Completa tu primer simulacro para empezar!
                  </p>
                  <button onClick={() => navigate('/simuladores')}
                          className="btn-primary text-sm py-2 px-5 mx-auto">
                    Ir al simulador
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {logrosDesbloqueados.map((logro) => (
                    <TarjetaLogro key={logro.id} logro={logro} />
                  ))}
                </div>
              )
            )}

            {tabLogros === 'bloqueados' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {logrosBloqueados.map((logro) => (
                  <TarjetaLogro key={logro.id} logro={logro} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Columna derecha: Estado de preparación ── */}
        <div className="space-y-5">

          {/* Estado de preparación */}
          <div className="card p-6 text-center space-y-5"
               style={{ borderTop:'4px solid #6366f1' }}>
            <div>
              <h2 className="text-sm font-bold" style={{ fontFamily:'var(--font-display)' }}>
                Estado de preparación
              </h2>
              <p className="text-xs mt-0.5" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                Para el examen teórico MTC
              </p>
            </div>

            <div className="flex justify-center">
              <ProgressRing
                porcentaje={nivelPreparacion}
                size={140}
                stroke={12}
                color={nivelPreparacion >= 70 ? '#6366f1' : nivelPreparacion >= 50 ? '#f59e0b' : '#ef4444'}
              >
                <div className="text-center">
                  <p className="text-3xl font-black" style={{ fontFamily:'var(--font-display)' }}>
                    {nivelPreparacion}%
                  </p>
                  <p className="text-[11px]" style={{ color:'var(--color-text-muted)', fontFamily:'var(--font-body)' }}>
                    Preparación para<br />examen MTC
                  </p>
                </div>
              </ProgressRing>
            </div>

            {/* Meta recomendada */}
            <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl"
                 style={{ background:'#eef2ff', border:'1px solid #c7d2fe' }}>
              <Target size={14} style={{ color:'#6366f1' }} />
              <span className="text-xs font-bold"
                    style={{ fontFamily:'var(--font-display)', color:'#4338ca' }}>
                Meta recomendada: 85%
              </span>
            </div>

            {/* Mensaje según nivel */}
            <p className="text-xs leading-relaxed"
               style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
              {nivelPreparacion === 0 && 'Comienza a practicar para medir tu nivel de preparación.'}
              {nivelPreparacion > 0 && nivelPreparacion < 50 && 'Estás empezando. Practica más simulacros para mejorar.'}
              {nivelPreparacion >= 50 && nivelPreparacion < 70 && 'Vas por buen camino. Sigue practicando para aprobar.'}
              {nivelPreparacion >= 70 && nivelPreparacion < 85 && '¡Muy bien! Estás cerca de la meta. Sigue así.'}
              {nivelPreparacion >= 85 && '¡Excelente! Estás listo para el examen teórico del MTC.'}
            </p>

            {/* CTA */}
            <button onClick={() => navigate('/simuladores')}
                    className="btn-primary w-full justify-center py-2.5 text-sm"
                    style={{ background:'linear-gradient(90deg,#6366f1,#8b5cf6)' }}>
              Hacer simulacro ahora →
            </button>
          </div>

          {/* Mi suscripción */}
          <TarjetaSuscripcion
            datosUsuario={datosUsuario}
            esPremiumActivo={esPremium}
            onCancelar={abrirModalCancelar}
            onVerPlanes={() => navigate('/premium')}
          />

          {/* Accesos rápidos del perfil */}
          <div className="card p-5 space-y-2">
            <h3 className="text-xs font-bold mb-3"
                style={{ fontFamily:'var(--font-display)', color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>
              Accesos rápidos
            </h3>
            {[
              { icono:BarChart2,    label:'Ver mis estadísticas', ruta:'/estadisticas', color:'#6366f1' },
              { icono:ClipboardList,label:'Ver mi historial',     ruta:'/historial',    color:'#0ea5e9' },
              { icono:BookOpen,     label:'Practicar por temas',  ruta:'/practica',     color:'#10b981' },
            ].map(({ icono:Ico, label, ruta, color }) => (
              <button key={ruta} onClick={() => navigate(ruta)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                                 hover:bg-gray-50 transition-colors text-left"
                      style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                     style={{ background:`${color}15` }}>
                  <Ico size={14} style={{ color }} />
                </div>
                {label}
                <ChevronRight size={14} className="ml-auto text-gray-300" />
              </button>
            ))}
          </div>

          {/* Nota backend */}
          <div className="p-4 rounded-xl text-xs"
               style={{ background:'#f8fafc', border:'1px solid var(--color-border)', fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
            🔒 <strong>Fase 4:</strong> El perfil se sincronizará con tu cuenta en el servidor. Los cambios actuales se guardan en tu dispositivo.
          </div>
        </div>
      </div>

      {modalCancelar && (
        <ModalCancelarSuscripcion
          onMantener={cerrarModalCancelar}
          onConfirmar={cancelarSuscripcion}
        />
      )}
    </div>
  );
}
