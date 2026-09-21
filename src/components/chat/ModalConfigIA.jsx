/* ============================================================
   DrivePrep+ — Modal de Configuración de IA (Google Gemini)
   Permite ingresar o modificar la API Key de Google Gemini Gratuita
   ============================================================ */

import { useState } from 'react';
import { Sparkles, Key, Check, X, ExternalLink, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { getApiKeyGemini, setApiKeyGemini, consultarGeminiMTC } from '../../services/aiService';

export default function ModalConfigIA({ abierto, onCerrar, onGuardar }) {
  const [apiKey, setApiKey] = useState(getApiKeyGemini());
  const [probando, setProbando] = useState(false);
  const [resultadoPrueba, setResultadoPrueba] = useState(null);

  if (!abierto) return null;

  const handleProbar = async () => {
    if (!apiKey.trim()) {
      setResultadoPrueba({ exito: false, mensaje: 'Por favor ingresa una clave API.' });
      return;
    }
    setProbando(true);
    setResultadoPrueba(null);

    // Guardar temporalmente para probar
    setApiKeyGemini(apiKey.trim());

    try {
      const res = await consultarGeminiMTC({
        mensajeUsuario: 'Hola Max, confirma que estás listo para el MTC.'
      });
      if (res && res.texto) {
        setResultadoPrueba({
          exito: true,
          mensaje: `¡Conexión Exitosa con ${res.proveedor}! ⚡ (1,000,000 tokens de contexto disponibles)`
        });
      }
    } catch (err) {
      setResultadoPrueba({
        exito: false,
        mensaje: `Error al conectar: ${err.message || 'Clave inválida o límite superado.'}`
      });
    } finally {
      setProbando(false);
    }
  };

  const handleGuardar = () => {
    setApiKeyGemini(apiKey.trim());
    if (onGuardar) onGuardar();
    onCerrar();
  };

  const handleLimpiar = () => {
    setApiKey('');
    setApiKeyGemini('');
    setResultadoPrueba(null);
    if (onGuardar) onGuardar();
  };

  const tieneKey = Boolean(getApiKeyGemini());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white leading-tight">
                Configurar IA (Google Gemini)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-body">
                Tokens ilimitados y 1,500 peticiones diarias gratis.
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Estado actual */}
        <div className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs font-semibold font-display ${
          tieneKey 
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
        }`}>
          <Zap size={18} className="shrink-0" />
          <span>
            {tieneKey
              ? '⚡ Modo IA Generativa Gemini Activo'
              : '🔌 Modo Local MTC (Sin clave API — usando motor local)'}
          </span>
        </div>

        {/* Formulario */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-display">
            Google AI Studio API Key (Gratis)
          </label>
          <div className="relative">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none font-mono text-slate-900 dark:text-white"
            />
            <Key size={15} className="absolute left-3 top-3 text-slate-400" />
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-display font-medium"
          >
            <span>Obtener clave gratis en Google AI Studio</span>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Resultado de prueba */}
        {resultadoPrueba && (
          <div className={`p-3 rounded-xl text-xs font-body border ${
            resultadoPrueba.exito
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}>
            {resultadoPrueba.mensaje}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleProbar}
            disabled={probando || !apiKey.trim()}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {probando ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
            <span>Probar clave</span>
          </button>

          <div className="flex items-center gap-2">
            {tieneKey && (
              <button
                type="button"
                onClick={handleLimpiar}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                Quitar
              </button>
            )}
            <button
              type="button"
              onClick={handleGuardar}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
            >
              Guardar y Usar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
