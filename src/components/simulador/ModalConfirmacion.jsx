/* ============================================================
   DrivePrep+ — ModalConfirmacionFinalizar
   Modal que aparece al intentar finalizar el examen.
   ============================================================ */

import { AlertTriangle, Flag, X } from 'lucide-react';

export default function ModalConfirmacionFinalizar({
  respondidas,
  totalPreguntas,
  onConfirmar,
  onCancelar,
}) {
  const sinResponder = totalPreguntas - respondidas;

  return (
    /* Overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)' }}>

      {/* Modal */}
      <div
        className="card w-full max-w-md p-6 space-y-5"
        style={{ animation: 'fadeInUp 0.25s ease' }}
      >
        {/* Encabezado */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                ¿Entregar examen?
              </h2>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
          <button onClick={onCancelar} className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
            <X size={18} />
          </button>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl text-center" style={{ background: '#d1fae515', border: '1px solid #10b98130' }}>
            <p className="text-2xl font-extrabold text-green-600" style={{ fontFamily: 'var(--font-display)' }}>
              {respondidas}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              Respondidas
            </p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: sinResponder > 0 ? '#fee2e215' : '#d1fae515', border: `1px solid ${sinResponder > 0 ? '#ef444430' : '#10b98130'}` }}>
            <p
              className="text-2xl font-extrabold"
              style={{ fontFamily: 'var(--font-display)', color: sinResponder > 0 ? '#ef4444' : '#10b981' }}
            >
              {sinResponder}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              Sin responder
            </p>
          </div>
        </div>

        {sinResponder > 0 && (
          <p
            className="text-sm p-3 rounded-xl"
            style={{
              background: '#fef3c7',
              color: '#92400e',
              fontFamily: 'var(--font-body)',
              border: '1px solid #fde68a',
            }}
          >
            Tienes <strong>{sinResponder} pregunta{sinResponder !== 1 ? 's' : ''}</strong> sin responder.
            Las preguntas omitidas se contarán como incorrectas.
          </p>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancelar}
            className="btn-secondary flex-1 justify-center py-2.5"
          >
            Continuar
          </button>
          <button
            onClick={onConfirmar}
            className="btn-primary flex-1 justify-center py-2.5"
            style={{ background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }}
          >
            <Flag size={15} /> Entregar
          </button>
        </div>
      </div>
    </div>
  );
}
