/* ============================================================
   DrivePrep+ — MensajeChat
   Renderizador con diseño enriquecido para el Asistente MTC
   ============================================================ */

import React from 'react';
import { Sparkles, Brain, AlertTriangle, Lightbulb, BookOpen, Target, HelpCircle, ArrowRight } from 'lucide-react';

export default function MensajeChat({ mensaje, onSeleccionarOpcion }) {
  const esUsuario = mensaje.emisor === 'usuario';
  const texto = mensaje.texto || '';
  const preguntaData = mensaje.preguntaData;

  if (esUsuario) {
    return (
      <div className="flex justify-end animate-[fadeIn_0.2s_ease]">
        <div className="max-w-[85%] sm:max-w-[80%] p-3.5 sm:p-4 rounded-2xl rounded-br-none bg-indigo-600 text-white shadow-md font-body text-xs sm:text-[13.5px] leading-relaxed">
          <p className="whitespace-pre-line">{texto}</p>
        </div>
      </div>
    );
  }

  /* ── Formateador inline para negritas y cursivas ── */
  const renderizarTextoInline = (txt) => {
    if (!txt) return null;
    const partes = txt.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return partes.map((p, idx) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return <strong key={idx} className="font-bold text-slate-900 dark:text-white font-display">{p.slice(2, -2)}</strong>;
      }
      if (p.startsWith('*') && p.endsWith('*')) {
        return <em key={idx} className="italic text-slate-600 dark:text-slate-300">{p.slice(1, -1)}</em>;
      }
      return p;
    });
  };

  /* ── Parser de bloques estructurados ── */
  const lineas = texto.split('\n');
  const bloques = [];
  let bloqueActual = { tipo: 'parrafo', lineas: [] };

  const guardarBloque = () => {
    if (bloqueActual.lineas.length > 0) {
      bloques.push({ ...bloqueActual });
      bloqueActual = { tipo: 'parrafo', lineas: [] };
    }
  };

  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i];
    const lineaTrim = linea.trim();

    if (lineaTrim.startsWith('### ')) {
      guardarBloque();
      const tituloOriginal = lineaTrim.replace('### ', '').trim();
      
      // Clasificación de sección para diseño de tarjeta
      let subtipo = 'general';
      let Icono = BookOpen;
      let estilo = 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/50 text-indigo-900 dark:text-indigo-200';
      let colorIcono = 'text-indigo-600 dark:text-indigo-400';

      if (tituloOriginal.includes('Respuesta') || tituloOriginal.includes('🚦') || tituloOriginal.includes('Explicación')) {
        subtipo = 'respuesta';
        Icono = BookOpen;
        estilo = 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60';
        colorIcono = 'text-indigo-600 dark:text-indigo-400';
      } else if (tituloOriginal.includes('recordar') || tituloOriginal.includes('🧠')) {
        subtipo = 'recordar';
        Icono = Brain;
        estilo = 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60';
        colorIcono = 'text-emerald-600 dark:text-emerald-400';
      } else if (tituloOriginal.includes('Importante') || tituloOriginal.includes('⚠️') || tituloOriginal.includes('Reglas clave')) {
        subtipo = 'importante';
        Icono = AlertTriangle;
        estilo = 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60';
        colorIcono = 'text-amber-600 dark:text-amber-400';
      } else if (tituloOriginal.includes('Ejemplo') || tituloOriginal.includes('📌') || tituloOriginal.includes('Características') || tituloOriginal.includes('Clasificación')) {
        subtipo = 'ejemplo';
        Icono = Lightbulb;
        estilo = 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60';
        colorIcono = 'text-sky-600 dark:text-sky-400';
      } else if (tituloOriginal.includes('Consejo') || tituloOriginal.includes('🎯') || tituloOriginal.includes('Recomendación')) {
        subtipo = 'consejo';
        Icono = Target;
        estilo = 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60';
        colorIcono = 'text-purple-600 dark:text-purple-400';
      }

      bloqueActual = {
        tipo: 'seccion',
        subtipo,
        titulo: tituloOriginal,
        Icono,
        estilo,
        colorIcono,
        lineas: []
      };
    } else {
      bloqueActual.lineas.push(linea);
    }
  }
  guardarBloque();

  return (
    <div className="flex justify-start animate-[fadeIn_0.25s_ease]">
      <div className="max-w-[94%] sm:max-w-[90%] p-4 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800/95 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 shadow-sm font-body text-xs sm:text-[13.5px] leading-relaxed space-y-3">
        
        {bloques.map((b, bIdx) => {
          if (b.tipo === 'seccion') {
            const IconoComp = b.Icono;
            return (
              <div key={bIdx} className={`p-3.5 rounded-xl border ${b.estilo} space-y-2 transition-all shadow-2xs`}>
                <div className="flex items-center gap-2">
                  <IconoComp size={15} className={`${b.colorIcono} shrink-0`} />
                  <span className="text-[12px] font-extrabold font-display tracking-wide uppercase text-slate-900 dark:text-slate-100">
                    {b.titulo}
                  </span>
                </div>
                <div className="whitespace-pre-line text-xs sm:text-[13px] leading-relaxed space-y-1 text-slate-800 dark:text-slate-200">
                  {b.lineas.map((lin, lIdx) => (
                    <p key={lIdx} className={lin.trim() === '' ? 'h-1.5' : 'my-0.5'}>
                      {renderizarTextoInline(lin)}
                    </p>
                  ))}
                </div>
              </div>
            );
          }

          /* Párrafo normal */
          return (
            <div key={bIdx} className="whitespace-pre-line space-y-1">
              {b.lineas.map((lin, lIdx) => (
                <p key={lIdx} className={lin.trim() === '' ? 'h-1.5' : 'my-0.5'}>
                  {renderizarTextoInline(lin)}
                </p>
              ))}
            </div>
          );
        })}

        {/* ── Botones interactivos si hay pregunta de examen activa ── */}
        {preguntaData && preguntaData.opciones && onSeleccionarOpcion && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-display flex items-center gap-1.5">
              <HelpCircle size={13} /> Elige tu respuesta para comprobar:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {preguntaData.opciones.map((op) => (
                <button
                  key={op.id}
                  onClick={() => onSeleccionarOpcion(`Opción ${op.id.toUpperCase()}`)}
                  className="p-2.5 text-left rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-slate-800 dark:text-slate-200 transition-all font-body text-xs shadow-2xs group flex items-start gap-2.5 active:scale-[0.98]"
                >
                  <span className="w-5 h-5 rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-black font-display text-[11px] flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {op.id.toUpperCase()}
                  </span>
                  <span className="flex-1 leading-snug">{op.texto}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
