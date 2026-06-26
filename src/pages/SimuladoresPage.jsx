/* ============================================================
   DrivePrep+ — SimuladoresPage
   Con verificación de límite Premium antes de iniciar.
   ============================================================ */

import { useState } from 'react';
import { ESTADOS, useSimulacro } from '../hooks/useSimulacro';
import SimuladorIntro     from '../components/simulador/SimuladorIntro';
import SimuladorTopbar    from '../components/simulador/SimuladorTopbar';
import RenderedorPregunta from '../components/simulador/RenderedorPregunta';
import PanelNavegacion    from '../components/simulador/PanelNavegacion';
import ModalConfirmacion  from '../components/simulador/ModalConfirmacion';
import ResultadoSimulacro from '../components/simulador/ResultadoSimulacro';
import { usePremium } from '../context/PremiumContext';

export default function SimuladoresPage() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const { registrarSimulacro } = usePremium();

  const {
    estado, preguntas, preguntaActual, indicePregunta,
    respuestas, marcadas, resultado,
    tiempoRestanteFormato, tiempoEsCritico,
    totalPreguntas, respondidas, porcentajeAvance,
    iniciarSimulacro, seleccionarRespuesta, irAPregunta,
    siguiente, anterior, toggleMarcada, finalizarSimulacro, reiniciar,
  } = useSimulacro();

  const handleIniciar = () => {
    const permitido = registrarSimulacro();
    if (permitido) iniciarSimulacro();
  };

  const handleConfirmarFinalizar = () => { setMostrarModal(false); finalizarSimulacro(false); };

  if (estado === ESTADOS.IDLE) {
    return <div className="page-enter"><SimuladorIntro onIniciar={handleIniciar} /></div>;
  }

  if (estado === ESTADOS.FINALIZADO && resultado) {
    return (
      <ResultadoSimulacro
        resultado={resultado}
        preguntas={preguntas}
        respuestas={respuestas}
        onReintentar={reiniciar}
      />
    );
  }

  return (
    <div className="page-enter -mx-5 lg:-mx-7 -mt-5 lg:-mt-7">
      <SimuladorTopbar
        tiempoRestanteFormato={tiempoRestanteFormato}
        tiempoEsCritico={tiempoEsCritico}
        respondidas={respondidas}
        totalPreguntas={totalPreguntas}
        porcentajeAvance={porcentajeAvance}
        onFinalizar={() => setMostrarModal(true)}
      />
      <div className="p-5 lg:p-7">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5">
          <RenderedorPregunta
            pregunta={preguntaActual}
            indice={indicePregunta}
            total={totalPreguntas}
            respuesta={respuestas[preguntaActual?.id]}
            marcada={!!marcadas[preguntaActual?.id]}
            onResponder={seleccionarRespuesta}
            onToggleMarcada={toggleMarcada}
            onAnterior={anterior}
            onSiguiente={siguiente}
          />
          <div className="order-first lg:order-last">
            <PanelNavegacion
              preguntas={preguntas}
              indicePregunta={indicePregunta}
              respuestas={respuestas}
              marcadas={marcadas}
              onIrAPregunta={irAPregunta}
            />
          </div>
        </div>
      </div>
      {mostrarModal && (
        <ModalConfirmacion
          respondidas={respondidas}
          totalPreguntas={totalPreguntas}
          onConfirmar={handleConfirmarFinalizar}
          onCancelar={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}
