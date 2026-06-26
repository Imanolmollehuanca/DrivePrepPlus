/* ============================================================
   DrivePrep+ — AjustesPage
   Tema real (claro/oscuro/auto) + Idioma real (ES/EN).
   Cuenta: cambiar nombre, correo y contraseña funcionales.
   ============================================================ */

import { useState, useEffect, useRef } from 'react';
import {
  Settings, User, Mail, Lock, GraduationCap,
  Bell, Sun, Moon, Monitor, Globe, Shield, Check,
  X, Eye, EyeOff, CheckCircle, AlertCircle,
} from 'lucide-react';
import { useAuth    } from '../context/AuthContext';
import { useTema    } from '../context/TemaContext';
import { useIdioma  } from '../context/IdiomaContext';

const KEY_AJUSTES = 'driveprep_ajustes';
const AJUSTES_DEFECTO = {
  cantidadPreguntas:   40,
  temporizadorActivo:  true,
  recordatorioDiario:  true,
  avisoRendimiento:    true,
  recomendacionesPush: true,
};

function leerAjustes() {
  try { return { ...AJUSTES_DEFECTO, ...JSON.parse(localStorage.getItem(KEY_AJUSTES) || '{}') }; }
  catch { return AJUSTES_DEFECTO; }
}
function persistirAjustes(datos) {
  try {
    const actuales = JSON.parse(localStorage.getItem(KEY_AJUSTES) || '{}');
    localStorage.setItem(KEY_AJUSTES, JSON.stringify({ ...actuales, ...datos }));
  } catch { /* ignore */ }
}

/* ── Toggle switch ── */
function Toggle({ activo, onToggle, color = '#6366f1' }) {
  return (
    <button onClick={onToggle}
      className="relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 focus:outline-none"
      style={{ background: activo ? color : '#cbd5e1' }}
      role="switch" aria-checked={activo}>
      <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300"
            style={{ transform: activo ? 'translateX(20px)' : 'translateX(0)' }} />
    </button>
  );
}

/* ── Sección de ajustes ── */
function SeccionAjustes({ icono: Ico, titulo, descripcion, color = '#6366f1', bg = '#eef2ff', children }) {
  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
          <Ico size={20} style={{ color }} />
        </div>
        <div>
          <h2 className="text-base font-bold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>{titulo}</h2>
          {descripcion && (
            <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>{descripcion}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ── Fila de acción (botón clicable) ── */
function FilaAjuste({ icono: Ico, titulo, descripcion, color = '#6366f1', onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left hover:shadow-sm"
      style={{ borderColor:'var(--color-border)', background:'var(--color-card)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}08`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-card)'; }}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background:`${color}12` }}>
        <Ico size={16} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>{titulo}</p>
        {descripcion && (
          <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>{descripcion}</p>
        )}
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color:'var(--color-text-muted)', flexShrink:0 }}>
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  );
}

/* ── Input con mostrar/ocultar contraseña ── */
function InputPassword({ value, onChange, placeholder, disabled }) {
  const [ver, setVer] = useState(false);
  return (
    <div className="relative">
      <input
        type={ver ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2.5 pr-10 rounded-xl border text-sm transition-colors focus:outline-none"
        style={{ borderColor:'var(--color-border)', background: disabled ? 'var(--color-bg)' : 'var(--color-card)', color:'var(--color-text-primary)', fontFamily:'var(--font-body)' }}
      />
      <button type="button" onClick={() => setVer(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:'var(--color-text-muted)' }} tabIndex={-1}>
        {ver ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

/* ── Input estándar ── */
function Input({ value, onChange, placeholder, disabled, readOnly, type = 'text' }) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      disabled={disabled} readOnly={readOnly}
      className="w-full px-3 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none"
      style={{ borderColor:'var(--color-border)', background: (disabled||readOnly) ? 'var(--color-bg)' : 'var(--color-card)', color:'var(--color-text-primary)', fontFamily:'var(--font-body)', opacity:(disabled||readOnly) ? 0.7 : 1 }}
    />
  );
}

/* ── Label de campo ── */
function Label({ children }) {
  return (
    <p className="text-xs font-bold mb-1.5" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>{children}</p>
  );
}

/* ── Alerta éxito / error ── */
function Alerta({ tipo, mensaje }) {
  if (!mensaje) return null;
  const ok = tipo === 'exito';
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm"
         style={{ background: ok ? '#d1fae5' : '#fee2e2', color: ok ? '#065f46' : '#991b1b', border:`1px solid ${ok ? '#6ee7b7' : '#fca5a5'}`, fontFamily:'var(--font-body)' }}>
      {ok ? <CheckCircle size={16} style={{ color:'#059669', flexShrink:0, marginTop:1 }} /> : <AlertCircle size={16} style={{ color:'#dc2626', flexShrink:0, marginTop:1 }} />}
      <span>{mensaje}</span>
    </div>
  );
}

/* ── Modal base ── */
function Modal({ abierto, onCerrar, titulo, color = '#6366f1', icono: Ico, children }) {
  const overlayRef = useRef(null);
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e) => { if (e.key === 'Escape') onCerrar(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [abierto, onCerrar]);
  if (!abierto) return null;
  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)' }}
         onMouseDown={e => { if (e.target === overlayRef.current) onCerrar(); }}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
           style={{ background:'var(--color-card)', border:'1px solid var(--color-border)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor:'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:`${color}15` }}>
              <Ico size={18} style={{ color }} />
            </div>
            <h3 className="font-bold text-base" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>{titulo}</h3>
          </div>
          <button onClick={onCerrar} className="p-1.5 rounded-lg transition-colors hover:bg-gray-100" style={{ color:'var(--color-text-muted)' }}>
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ── Campo de solo lectura ── */
function CampoActual({ label, valor }) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <Input value={valor} readOnly />
    </div>
  );
}

/* ── Botones de modal ── */
function BotonesModal({ onCerrar, onGuardar, cargando, deshabilitado, color, t }) {
  return (
    <div className="flex gap-3 pt-1">
      <button onClick={onCerrar} disabled={cargando}
              className="flex-1 py-2.5 rounded-xl border text-sm font-semibold"
              style={{ borderColor:'var(--color-border)', color:'var(--color-text-secondary)', fontFamily:'var(--font-display)' }}>
        {t('aj_modal_cancelar')}
      </button>
      <button onClick={onGuardar} disabled={deshabilitado}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: cargando ? `${color}80` : color, fontFamily:'var(--font-display)', opacity: deshabilitado ? 0.6 : 1 }}>
        {cargando ? t('aj_modal_guardando') : t('aj_modal_guardar')}
      </button>
    </div>
  );
}

/* ════ MODAL CAMBIAR NOMBRE ════ */
function ModalNombre({ abierto, onCerrar }) {
  const { usuario, cambiarNombre } = useAuth();
  const { t } = useIdioma();
  const [nombre, setNombre] = useState('');
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState(null);
  useEffect(() => { if (abierto) { setNombre(''); setAlerta(null); } }, [abierto]);
  const handleGuardar = async () => {
    if (!nombre.trim()) { setAlerta({ tipo:'error', msg: t('aj_modal_nombre_vacio') }); return; }
    setCargando(true); setAlerta(null);
    try {
      await cambiarNombre(nombre);
      setAlerta({ tipo:'exito', msg: t('aj_modal_nombre_ok') });
      setTimeout(onCerrar, 1400);
    } catch(e) { setAlerta({ tipo:'error', msg: e.message }); }
    finally { setCargando(false); }
  };
  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo={t('aj_modal_nombre_titulo')} color="#6366f1" icono={User}>
      <div className="space-y-4">
        <CampoActual label={t('aj_modal_nombre_actual')} valor={usuario?.nombre || ''} />
        <div>
          <Label>{t('aj_modal_nombre_nuevo')}</Label>
          <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder={t('aj_modal_nombre_ph')} disabled={cargando} />
        </div>
        {alerta && <Alerta tipo={alerta.tipo} mensaje={alerta.msg} />}
        <BotonesModal onCerrar={onCerrar} onGuardar={handleGuardar} cargando={cargando} deshabilitado={cargando || !nombre.trim()} color="#6366f1" t={t} />
      </div>
    </Modal>
  );
}

/* ════ MODAL CAMBIAR EMAIL ════ */
function ModalEmail({ abierto, onCerrar }) {
  const { usuario, cambiarEmail } = useAuth();
  const { t } = useIdioma();
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState(null);
  const esSocial = usuario?.proveedor && usuario.proveedor !== 'email';
  useEffect(() => { if (abierto) { setNuevoEmail(''); setContrasena(''); setAlerta(null); } }, [abierto]);
  const handleGuardar = async () => {
    setCargando(true); setAlerta(null);
    try {
      await cambiarEmail({ nuevoEmail, contrasena });
      setAlerta({ tipo:'exito', msg: t('aj_modal_email_ok') });
      setTimeout(onCerrar, 1400);
    } catch(e) {
      const mapa = { formato: t('aj_modal_email_formato'), igual: t('aj_modal_email_igual'), registrado: t('aj_modal_email_registrado'), pass_err: t('aj_modal_email_pass_err') };
      setAlerta({ tipo:'error', msg: mapa[e.message] || e.message });
    }
    finally { setCargando(false); }
  };
  const deshabilitado = cargando || !nuevoEmail.trim() || (!esSocial && !contrasena);
  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo={t('aj_modal_email_titulo')} color="#0ea5e9" icono={Mail}>
      <div className="space-y-4">
        <CampoActual label={t('aj_modal_email_actual')} valor={usuario?.email || ''} />
        <div>
          <Label>{t('aj_modal_email_nuevo')}</Label>
          <Input type="email" value={nuevoEmail} onChange={e => setNuevoEmail(e.target.value)} placeholder={t('aj_modal_email_ph')} disabled={cargando} />
        </div>
        {!esSocial && (
          <div>
            <Label>{t('aj_modal_email_pass')}</Label>
            <InputPassword value={contrasena} onChange={e => setContrasena(e.target.value)} placeholder={t('aj_modal_email_pass_ph')} disabled={cargando} />
          </div>
        )}
        {alerta && <Alerta tipo={alerta.tipo} mensaje={alerta.msg} />}
        <BotonesModal onCerrar={onCerrar} onGuardar={handleGuardar} cargando={cargando} deshabilitado={deshabilitado} color="#0ea5e9" t={t} />
      </div>
    </Modal>
  );
}

/* ════ MODAL CAMBIAR CONTRASEÑA ════ */
function ModalContrasena({ abierto, onCerrar }) {
  const { usuario, cambiarContrasena } = useAuth();
  const { t } = useIdioma();
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState(null);
  const esSocial = usuario?.proveedor && usuario.proveedor !== 'email';
  useEffect(() => { if (abierto) { setActual(''); setNueva(''); setConfirmar(''); setAlerta(null); } }, [abierto]);

  const fortaleza = (() => {
    if (!nueva) return 0;
    let p = 0;
    if (nueva.length >= 6) p++;
    if (nueva.length >= 10) p++;
    if (/[A-Z]/.test(nueva)) p++;
    if (/[0-9]/.test(nueva)) p++;
    if (/[^A-Za-z0-9]/.test(nueva)) p++;
    return p;
  })();
  const fColor = ['#e5e7eb','#ef4444','#f59e0b','#eab308','#10b981','#059669'][fortaleza] || '#e5e7eb';
  const fLabel = ['','Muy débil','Débil','Regular','Fuerte','Muy fuerte'][fortaleza] || '';

  const handleGuardar = async () => {
    if (esSocial) { setAlerta({ tipo:'error', msg: t('aj_modal_pass_social') }); return; }
    setCargando(true); setAlerta(null);
    try {
      await cambiarContrasena({ contrasenaActual: actual, nuevaContrasena: nueva, confirmar });
      setAlerta({ tipo:'exito', msg: t('aj_modal_pass_ok') });
      setTimeout(onCerrar, 1400);
    } catch(e) {
      const mapa = { social: t('aj_modal_pass_social'), corta: t('aj_modal_pass_corta'), no_coincide: t('aj_modal_pass_no_coincide'), actual_err: t('aj_modal_pass_actual_err') };
      setAlerta({ tipo:'error', msg: mapa[e.message] || e.message });
    }
    finally { setCargando(false); }
  };

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo={t('aj_modal_pass_titulo')} color="#8b5cf6" icono={Lock}>
      <div className="space-y-4">
        {esSocial ? (
          <Alerta tipo="error" mensaje={t('aj_modal_pass_social')} />
        ) : (
          <>
            <div>
              <Label>{t('aj_modal_pass_actual')}</Label>
              <InputPassword value={actual} onChange={e => setActual(e.target.value)} placeholder={t('aj_modal_pass_actual_ph')} disabled={cargando} />
            </div>
            <div>
              <Label>{t('aj_modal_pass_nueva')}</Label>
              <InputPassword value={nueva} onChange={e => setNueva(e.target.value)} placeholder={t('aj_modal_pass_nueva_ph')} disabled={cargando} />
              {nueva && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i <= fortaleza ? fColor : '#e5e7eb' }} />
                    ))}
                  </div>
                  {fLabel && <p className="text-[11px]" style={{ color: fColor, fontFamily:'var(--font-body)' }}>{fLabel}</p>}
                </div>
              )}
            </div>
            <div>
              <Label>{t('aj_modal_pass_confirmar')}</Label>
              <InputPassword value={confirmar} onChange={e => setConfirmar(e.target.value)} placeholder={t('aj_modal_pass_confirmar_ph')} disabled={cargando} />
              {confirmar && nueva && (
                <p className="text-[11px] mt-1" style={{ color: confirmar === nueva ? '#059669' : '#dc2626', fontFamily:'var(--font-body)' }}>
                  {confirmar === nueva ? '✓ Las contraseñas coinciden' : '✗ No coinciden'}
                </p>
              )}
            </div>
          </>
        )}
        {alerta && <Alerta tipo={alerta.tipo} mensaje={alerta.msg} />}
        {!esSocial && (
          <BotonesModal onCerrar={onCerrar} onGuardar={handleGuardar} cargando={cargando} deshabilitado={cargando || !actual || !nueva || !confirmar} color="#8b5cf6" t={t} />
        )}
        {esSocial && (
          <button onClick={onCerrar} className="w-full py-2.5 rounded-xl border text-sm font-semibold"
                  style={{ borderColor:'var(--color-border)', color:'var(--color-text-secondary)', fontFamily:'var(--font-display)' }}>
            {t('aj_modal_cancelar')}
          </button>
        )}
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════════ */
export default function AjustesPage() {
  const { usuario } = useAuth();
  const { tema,    cambiarTema   } = useTema();
  const { idioma,  cambiarIdioma, t } = useIdioma();
  const [ajustes, setAjustes]     = useState(leerAjustes);
  const [guardado, setGuardado]   = useState(false);

  const [modalNombre,     setModalNombre]     = useState(false);
  const [modalEmail,      setModalEmail]      = useState(false);
  const [modalContrasena, setModalContrasena] = useState(false);

  const cambiar = (campo, valor) => {
    const nuevos = { ...ajustes, [campo]: valor };
    setAjustes(nuevos);
    persistirAjustes({ [campo]: valor });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const TEMAS = [
    { id:'claro',  label: t('aj_tema_claro'),  icono: Sun    },
    { id:'oscuro', label: t('aj_tema_oscuro'),  icono: Moon   },
    { id:'auto',   label: t('aj_tema_auto'),    icono: Monitor },
  ];
  const IDIOMAS = [
    { id:'es', label:'Español' },
    { id:'en', label:'English' },
  ];

  return (
    <div className="page-enter space-y-6 max-w-5xl mx-auto">

      {/* Modales de cuenta */}
      <ModalNombre     abierto={modalNombre}     onCerrar={() => setModalNombre(false)}     />
      <ModalEmail      abierto={modalEmail}      onCerrar={() => setModalEmail(false)}      />
      <ModalContrasena abierto={modalContrasena} onCerrar={() => setModalContrasena(false)} />

      {/* Encabezado */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background:'#eef2ff' }}>
            <Settings size={24} style={{ color:'#6366f1' }} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
              {t('aj_titulo')}
            </h1>
            <p className="text-sm" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-secondary)' }}>
              {t('aj_subtitulo')}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${guardado ? 'opacity-100' : 'opacity-0'}`}
             style={{ background:'#d1fae5', color:'#065f46', fontFamily:'var(--font-display)' }}>
          <Check size={13} /> {t('aj_guardado')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Cuenta */}
        <SeccionAjustes icono={User} titulo={t('aj_cuenta')} descripcion={t('aj_cuenta_desc')} color="#6366f1" bg="#eef2ff">
          <div className="space-y-2">
            <FilaAjuste icono={User} color="#6366f1"  titulo={t('aj_cambiar_nombre')} descripcion={t('aj_cambiar_nombre_d')} onClick={() => setModalNombre(true)}     />
            <FilaAjuste icono={Mail} color="#0ea5e9"  titulo={t('aj_cambiar_email')}  descripcion={t('aj_cambiar_email_d')}  onClick={() => setModalEmail(true)}      />
            <FilaAjuste icono={Lock} color="#8b5cf6"  titulo={t('aj_cambiar_pass')}   descripcion={t('aj_cambiar_pass_d')}   onClick={() => setModalContrasena(true)} />
          </div>
          <p className="text-xs italic" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
            {t('aj_cuenta_nota')}
          </p>
        </SeccionAjustes>

        {/* Preferencias de estudio */}
        <SeccionAjustes icono={GraduationCap} titulo={t('aj_estudio')} descripcion={t('aj_estudio_desc')} color="#10b981" bg="#ecfdf5">
          <div>
            <p className="text-xs font-bold mb-1" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
              {t('aj_num_preguntas')}
            </p>
            <p className="text-[11px] mb-3" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
              {t('aj_num_preguntas_d')}
            </p>
            <div className="space-y-2">
              {[20, 30, 40].map((n) => (
                <button key={n} onClick={() => cambiar('cantidadPreguntas', n)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left"
                  style={{
                    borderColor: ajustes.cantidadPreguntas === n ? '#10b981' : 'var(--color-border)',
                    background:  ajustes.cantidadPreguntas === n ? '#ecfdf5' : 'var(--color-card)',
                  }}>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                       style={{ borderColor: ajustes.cantidadPreguntas === n ? '#10b981' : '#cbd5e1' }}>
                    {ajustes.cantidadPreguntas === n && <div className="w-2.5 h-2.5 rounded-full" style={{ background:'#10b981' }} />}
                  </div>
                  <span className="text-sm font-semibold" style={{ fontFamily:'var(--font-display)', color: ajustes.cantidadPreguntas === n ? '#059669' : 'var(--color-text-primary)' }}>
                    {n} {t('aj_preguntas')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t" style={{ borderColor:'var(--color-border)' }}>
            <p className="text-xs font-bold mb-1" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>
              {t('aj_temporizador')}
            </p>
            <div className="space-y-2">
              {[
                { val:true,  label: t('aj_temp_on'),  icono:'⏱️' },
                { val:false, label: t('aj_temp_off'), icono:'⏸️' },
              ].map(({ val, label, icono }) => (
                <button key={String(val)} onClick={() => cambiar('temporizadorActivo', val)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left"
                  style={{
                    borderColor: ajustes.temporizadorActivo === val ? '#6366f1' : 'var(--color-border)',
                    background:  ajustes.temporizadorActivo === val ? '#eef2ff' : 'var(--color-card)',
                  }}>
                  <span className="text-base">{icono}</span>
                  <span className="text-sm font-semibold flex-1" style={{ fontFamily:'var(--font-display)', color: ajustes.temporizadorActivo === val ? '#4338ca' : 'var(--color-text-primary)' }}>
                    {label}
                  </span>
                  {ajustes.temporizadorActivo === val && <Check size={15} style={{ color:'#6366f1' }} />}
                </button>
              ))}
            </div>
          </div>
        </SeccionAjustes>
      </div>

      {/* Notificaciones */}
      <SeccionAjustes icono={Bell} titulo={t('aj_notifs')} descripcion={t('aj_notifs_desc')} color="#f59e0b" bg="#fef3c7">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { campo:'recordatorioDiario',  label: t('aj_notif_diario'), desc: t('aj_notif_diario_d'), color:'#6366f1' },
            { campo:'avisoRendimiento',    label: t('aj_notif_rend'),   desc: t('aj_notif_rend_d'),   color:'#ef4444' },
            { campo:'recomendacionesPush', label: t('aj_notif_push'),   desc: t('aj_notif_push_d'),   color:'#10b981' },
          ].map(({ campo, label, desc, color }) => (
            <div key={campo} className="p-4 rounded-xl border-2 space-y-3"
                 style={{
                   borderColor: ajustes[campo] ? `${color}30` : 'var(--color-border)',
                   background:  ajustes[campo] ? `${color}06` : 'var(--color-card)',
                 }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>{label}</p>
                  <p className="text-[11px] mt-0.5" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>{desc}</p>
                </div>
                <Toggle activo={ajustes[campo]} color={color} onToggle={() => cambiar(campo, !ajustes[campo])} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
          {t('aj_notifs_nota')}
        </p>
      </SeccionAjustes>

      {/* Apariencia */}
      <SeccionAjustes icono={Sun} titulo={t('aj_apariencia')} descripcion={t('aj_apariencia_desc')} color="#8b5cf6" bg="#faf5ff">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Tema */}
          <div>
            <p className="text-xs font-bold mb-1" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>{t('aj_tema')}</p>
            <p className="text-[11px] mb-3" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>{t('aj_tema_desc')}</p>
            <div className="flex gap-3">
              {TEMAS.map(({ id, label, icono: Ico }) => (
                <button key={id}
                  onClick={() => cambiarTema(id)}
                  className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: tema === id ? '#8b5cf6' : 'var(--color-border)',
                    background:  tema === id ? '#faf5ff' : 'var(--color-card)',
                  }}>
                  <Ico size={22} style={{ color: tema === id ? '#8b5cf6' : 'var(--color-text-muted)' }} />
                  <span className="text-xs font-bold" style={{ fontFamily:'var(--font-display)', color: tema === id ? '#7c3aed' : 'var(--color-text-muted)' }}>
                    {label}
                  </span>
                  {tema === id && (
                    <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Idioma */}
          <div>
            <p className="text-xs font-bold mb-1" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>{t('aj_idioma')}</p>
            <p className="text-[11px] mb-3" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>{t('aj_idioma_desc')}</p>
            <div className="flex gap-3">
              {IDIOMAS.map(({ id, label }) => (
                <button key={id}
                  onClick={() => cambiarIdioma(id)}
                  className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: idioma === id ? '#6366f1' : 'var(--color-border)',
                    background:  idioma === id ? '#eef2ff' : 'var(--color-card)',
                  }}>
                  <Globe size={22} style={{ color: idioma === id ? '#6366f1' : 'var(--color-text-muted)' }} />
                  <span className="text-xs font-bold" style={{ fontFamily:'var(--font-display)', color: idioma === id ? '#4338ca' : 'var(--color-text-muted)' }}>
                    {label}
                  </span>
                  {idioma === id && (
                    <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-[11px] mt-2 p-2.5 rounded-lg"
               style={{ fontFamily:'var(--font-body)', color:'#0369a1', background:'#f0f9ff', border:'1px solid #bae6fd' }}>
              {t('aj_idioma_nota')}
            </p>
          </div>
        </div>
      </SeccionAjustes>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 rounded-2xl"
           style={{ background:'var(--color-card)', border:'1px solid var(--color-border)' }}>
        <div className="flex items-center gap-3">
          <Shield size={18} style={{ color:'#6366f1' }} />
          <div>
            <p className="text-sm font-bold" style={{ fontFamily:'var(--font-display)', color:'#6366f1' }}>
              {t('aj_footer')}
            </p>
            <p className="text-xs" style={{ fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
              {t('aj_footer_sub')}
            </p>
          </div>
        </div>
        <Settings size={32} className="hidden sm:block" style={{ color:'var(--color-border)' }} />
      </div>
    </div>
  );
}
