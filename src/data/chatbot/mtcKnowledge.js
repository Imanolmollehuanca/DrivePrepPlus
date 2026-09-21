/* ============================================================
   DrivePrep+ — Base de Conocimientos MTC Perú
   Base de preguntas, respuestas profesionales y datos educativos
   organizados por categorías para el Asistente/Tutor de Reglas MTC.
   ============================================================ */

export const CATEGORIAS_KNOWLEDGE = {
  saludos: {
    id: 'saludos',
    nombre: 'Saludos y Presentación',
    icono: '👋'
  },
  senales: {
    id: 'senales',
    nombre: 'Señales de Tránsito',
    icono: '🚦'
  },
  pare_ceda: {
    id: 'pare_ceda',
    nombre: 'PARE y CEDA EL PASO',
    icono: '🛑'
  },
  ovales_prioridad: {
    id: 'ovales_prioridad',
    nombre: 'Óvalos y Prioridad de Paso',
    icono: '🔄'
  },
  reglas_circulacion: {
    id: 'reglas_circulacion',
    nombre: 'Reglas de Circulación',
    icono: '🛣️'
  },
  semaforos: {
    id: 'semaforos',
    nombre: 'Semáforos y Señales Luminosas',
    icono: '🚥'
  },
  infracciones: {
    id: 'infracciones',
    nombre: 'Infracciones y Sanciones',
    icono: '⚠️'
  },
  mecanica_basica: {
    id: 'mecanica_basica',
    nombre: 'Mecánica Básica',
    icono: '🔧'
  },
  seguridad_vial: {
    id: 'seguridad_vial',
    nombre: 'Seguridad Vial y Primeros Auxilios',
    icono: '🚗'
  },
  estacionamiento: {
    id: 'estacionamiento',
    nombre: 'Estacionamiento y Maniobras',
    icono: '🅿️'
  },
  consejos_examen: {
    id: 'consejos_examen',
    nombre: 'Consejos para el Examen',
    icono: '🎯'
  }
};

/* ══════════════════════════════════════════════════════════════
   BASE DE PREGUNTAS Y RESPUESTAS ESTRUCTURADAS
   ══════════════════════════════════════════════════════════════ */

export const BASE_CONOCIMIENTOS_MTC = [

  /* ────────────────────────────────────────────────────────────
     1. 👋 SALUDOS Y PRESENTACIÓN
     ──────────────────────────────────────────────────────────── */
  {
    id: 'saludo_general',
    categoria: 'saludos',
    intencion: 'saludo',
    patrones: [
      'hola', 'buenos dias', 'buenos días', 'buenas tardes', 'buenas noches',
      'buenas', 'hey', 'hola asistente', 'hola tutor', 'que tal', 'qué tal',
      'saludos', 'hola max', 'hola driveprep'
    ],
    respuestas: [
      (nombre) => `¡Hola${nombre ? `, ${nombre}` : ''}! 👋 Soy tu **Asistente Educativo de DrivePrepPlus**.

Estoy aquí para ayudarte a prepararte para tu examen de reglas de tránsito del MTC del Perú.

Puedes consultarme sobre señales de tránsito, reglas de circulación, prioridad en óvalos, PARE vs CEDA, infracciones, mecánica básica o pedirme preguntas de práctica tipo examen.

¿Qué tema te gustaría repasar hoy?`,

      (nombre) => `¡Bienvenido a DrivePrepPlus${nombre ? `, ${nombre}` : ''}! 🚗

Soy tu guía para el examen de conocimientos del MTC. Podemos resolver dudas del balotario, analizar situaciones de tránsito o poner a prueba tus conocimientos con preguntas tipo test.

¿En qué te puedo orientar hoy?`,

      (nombre) => `¡Hola! 👋 Qué gusto tenerte aquí estudiando con DrivePrepPlus.

Te acompaño en tu preparación para que apruebes tu examen de reglas a la primera. Puedes preguntarme cualquier concepto del Reglamento Nacional de Tránsito o pedirme consejos de estudio.

¿Empezamos con algún tema en particular?`
    ]
  },
  {
    id: 'presentacion_quien_eres',
    categoria: 'saludos',
    intencion: 'quien_eres',
    patrones: [
      'quien eres', 'quién eres', 'que eres', 'qué eres', 'como te llamas', 'cómo te llamas',
      'cual es tu funcion', 'cuál es tu función'
    ],
    respuestas: [
      () => `Soy el **Asistente y Tutor de DrivePrepPlus** 🚗, diseñado para ayudarte a estudiar y aprobar el examen oficial de reglas de tránsito del MTC (Ministerio de Transportes y Comunicaciones del Perú).

Mi objetivo es resolver tus dudas, explicarte normas y señales viales con claridad pedagógica, y ayudarte a practicar con preguntas tipo examen.

¿Tienes alguna duda sobre alguna regla o señal en específico?`
    ]
  },
  {
    id: 'presentacion_que_puedes_hacer',
    categoria: 'saludos',
    intencion: 'que_haces',
    patrones: [
      'que puedes hacer', 'qué puedes hacer', 'en que me ayudas', 'en qué me ayudas',
      'como me puedes ayudar', 'cómo me puedes ayudar', 'como me ayudas', 'cómo me ayudas',
      'necesito ayuda para estudiar', 'quiero prepararme para el examen', 'que temas sabes', 'qué temas sabes'
    ],
    respuestas: [
      () => `Puedo ayudarte en todos los temas del balotario oficial del MTC para licencias de conducir:

### 🚦 Áreas de preparación
• **Señales de tránsito:** Preventivas, reglamentarias e informativas.
• **Reglas de circulación:** Prioridad de paso, óvalos, intersecciones y velocidades.
• **PARE y CEDA EL PASO:** Diferencias, exigencias y casos prácticos.
• **Semáforos:** Significado de luces fijas e intermitentes.
• **Infracciones y sanciones:** Faltas Leves, Graves, Muy Graves y sistema de puntos.
• **Mecánica básica:** Niveles, testigos, presión de neumáticos y mantenimiento preventivo.
• **Seguridad vial:** Uso del cinturón, protocolo P.A.S. y SOAT.
• **Preguntas de práctica:** Simulaciones con alternativas A, B, C, D.

¿Quieres que veamos la teoría de un tema o prefieres una pregunta de práctica?`
    ]
  },

  /* ────────────────────────────────────────────────────────────
     2. 🚦 SEÑALES DE TRÁNSITO
     ──────────────────────────────────────────────────────────── */
  {
    id: 'senales_que_son',
    categoria: 'senales',
    intencion: 'que_son_senales',
    patrones: [
      'que son las senales de transito', 'qué son las señales de tránsito',
      'que significan las senales de transito', 'qué significan las señales de tránsito',
      'para que sirven las senales', 'para qué sirven las señales', 'definicion de senales de transito'
    ],
    respuestas: [
      () => `Las **señales de tránsito** son dispositivos viales, símbolos y marcas que guían, regulan y advierten a los conductores y peatones para asegurar un tránsito fluido y seguro.

### 🚦 Respuesta
En el Perú se clasifican en 3 grupos principales:
1. **Reglamentarias o de Reglamentación (R):** Notifican prohibiciones, restricciones y obligaciones legales.
2. **Preventivas o de Advertencia (P):** Advierten condiciones de peligro real o potencial en la vía.
3. **Informativas (I):** Guían e informan sobre destinos, rutas, servicios y sitios de interés.

### 🧠 Para recordar
Respetar las señales previene accidentes y evita infracciones de tránsito graves en tu récord.`
    ]
  },
  {
    id: 'senales_preventivas',
    categoria: 'senales',
    intencion: 'senales_preventivas',
    patrones: [
      'que son las senales preventivas', 'qué son las señales preventivas',
      'que significa una senal preventiva', 'qué significa una señal preventiva',
      'que significa senal preventiva', 'qué significa señal preventiva',
      'que significan las senales preventivas', 'qué significan las señales preventivas',
      'para que sirven las senales preventivas', 'para qué sirven las señales preventivas',
      'senales amarillas', 'señales amarillas', 'rombo amarillo', 'forma de las senales preventivas'
    ],
    respuestas: [
      () => `### 🚦 Respuesta
Las **señales preventivas (P)** advierten al conductor sobre la proximidad de un peligro o condición especial en la vía para que reduzca la velocidad y tome precauciones.

### 📌 Características
• **Forma:** Rombo (cuadrado colocado con una diagonal vertical).
• **Color:** Fondo amarillo con orla y símbolos en color negro.
• **Ejemplos clásicos:** Curva peligrosa, zona escolar, cruce de peatones, badén o resalto.

### 🧠 Para recordar
Ante una señal preventiva **no estás obligado a detenerte por completo**, sino a **reducir la velocidad y extremar la atención**.`
    ]
  },
  {
    id: 'senales_reguladoras_reglamentarias',
    categoria: 'senales',
    intencion: 'senales_reguladoras',
    patrones: [
      'que son las senales reguladoras', 'qué son las señales reguladoras',
      'que significa una senal reguladora', 'qué significa una señal reguladora',
      'que significa una senal reglamentaria', 'qué significa una señal reglamentaria',
      'que son las senales reglamentarias', 'qué son las señales reglamentarias',
      'para que sirven las senales reguladoras', 'para qué sirven las señales reguladoras',
      'senales de prohibicion', 'señales de prohibición', 'senales rojas'
    ],
    respuestas: [
      () => `### 🚦 Respuesta
Las **señales reglamentarias o reguladoras (R)** indican límites, obligaciones, autorizaciones y prohibiciones en el uso de la vía. **Su cumplimiento es mandatorio por ley**.

### 📌 Características
• **Forma y Color:** Mayormente circulares con fondo blanco, orla roja y símbolo negro.
• **Excepciones de forma:** 
  - **PARE (R-1):** Forma octagonal con fondo rojo y letras blancas.
  - **CEDA EL PASO (R-2):** Forma triangular invertida con fondo blanco y borde rojo.
  - **Señales de sentido de circulación:** Rectangulares con fondo negro y flecha blanca.

### ⚠️ Importante
Desobedecer una señal reglamentaria constituye una infracción al Reglamento Nacional de Tránsito y amerita multa y acumulación de puntos.`
    ]
  },
  {
    id: 'senales_informativas',
    categoria: 'senales',
    intencion: 'senales_informativas',
    patrones: [
      'que son las senales informativas', 'qué son las señales informativas',
      'que significa una senal informativa', 'qué significa una señal informativa',
      'que significan las senales informativas', 'qué significan las señales informativas',
      'como reconocer una senal informativa', 'cómo reconocer una señal informativa',
      'para que sirven las senales informativas', 'para qué sirven las señales informativas',
      'senales verdes', 'senales azules', 'señales verdes'
    ],
    respuestas: [
      () => `### 🚦 Respuesta
Las **señales informativas (I)** guían al conductor hacia su destino, indicando distancias, rutas, servicios y atractivos turísticos.

### 📌 Clasificación por colores
• **Fondo Verde (con letras blancas):** Señales de destino, orientación y kilometraje en autopistas y carreteras.
• **Fondo Azul (con símbolos blancos/negros):** Servicios generales (grifos, hospitales, mecánicos, restaurantes, paraderos).
• **Fondo Marrón:** Puntos de interés turístico, ecológico y arqueológico.

### 🧠 Para recordar
Son de forma **rectangular** y no imponen prohibiciones, sino que facilitan el viaje.`
    ]
  },
  {
    id: 'senales_diferencias',
    categoria: 'senales',
    intencion: 'diferencias_senales',
    patrones: [
      'cual es la diferencia entre una senal preventiva y una reguladora',
      'cuál es la diferencia entre una señal preventiva y una reguladora',
      'diferencia entre senales preventivas y reglamentarias',
      'diferencias entre los tipos de senales', 'como diferenciar las senales'
    ],
    respuestas: [
      () => `### 🚦 Respuesta
La diferencia principal radica en su **función legal y su forma visual**:

1. **Preventivas (Amarillas / Rombo):**
   • **Función:** Advierten peligro.
   • **Acción:** Disminuir la velocidad y estar atento.
   • **No imponen sanción por su sola presencia**, sino que previenen riesgos.

2. **Reglamentarias (Rojas o Azules / Círculo u Octágono):**
   • **Función:** Ordenan prohibiciones u obligaciones legales.
   • **Acción:** Cumplimiento estricto (ej. no voltear, no superar velocidad, detenerse).
   • **Ignorarlas genera una infracción y multa directa**.

3. **Informativas (Verdes, Azules o Marrones / Rectángulo):**
   • **Función:** Guiar y orientar sobre rutas y servicios.`
    ]
  },
  {
    id: 'senales_colores_formas',
    categoria: 'senales',
    intencion: 'colores_formas_senales',
    patrones: [
      'colores y formas de las senales', 'colores de las señales', 'formas de las señales',
      'como reconocer una senal', 'cómo reconocer una señal', 'resumen de colores de senales'
    ],
    respuestas: [
      () => `### 🚦 Guía rápida de Formas y Colores MTC:

• **Rombo Amarillo:** Señal **Preventiva** (peligro adelante).
• **Círculo Blanco con borde Rojo:** Señal **Reglamentaria de Prohibición / Restricción**.
• **Círculo Azul con símbolo Blanco:** Señal **Reglamentaria de Obligación**.
• **Octágono Rojo:** Señal de **PARE**.
• **Triángulo Invertido:** Señal de **CEDA EL PASO**.
• **Rectángulo Verde:** Información de **Destino y Rutas**.
• **Rectángulo Azul:** Información de **Servicios**.
• **Rectángulo Marrón:** Información **Turística**.`
    ]
  },

  /* ────────────────────────────────────────────────────────────
     3. 🛑 PARE Y CEDA EL PASO
     ──────────────────────────────────────────────────────────── */
  {
    id: 'pare_significado',
    categoria: 'pare_ceda',
    intencion: 'significado_pare',
    patrones: [
      'que significa pare', 'qué significa pare', 'que es la senal de pare', 'qué es la señal de pare',
      'que indica pare', 'qué indica pare', 'senal r-1', 'señal r-1'
    ],
    respuestas: [
      () => `### 🚦 Respuesta
La señal de **PARE (R-1)** es una señal reglamentaria de prioridad que **obliga al conductor a detener su vehículo por completo** antes de la línea de parada o del crucero peatonal, cediendo el paso a todos los vehículos y peatones de la vía transversal.

### 📌 Ejemplo
Al llegar a una intersección con señal de PARE, debes frenar hasta que las ruedas se detengan al 100% (0 km/h), verificar ambos lados durante unos segundos y reanudar la marcha solo cuando la vía esté totalmente libre.

### 🧠 Para recordar
La forma octagonal y el color rojo de la señal de PARE son únicos en el mundo para que sea reconocible incluso cubierta de polvo o vista desde atrás.`
    ]
  },
  {
    id: 'ceda_significado',
    categoria: 'pare_ceda',
    intencion: 'significado_ceda',
    patrones: [
      'que significa ceda el paso', 'qué significa ceda el paso', 'que es ceda el paso',
      'qué es ceda el paso', 'senal r-2', 'señal r-2', 'para que sirve ceda el paso'
    ],
    respuestas: [
      () => `### 🚦 Respuesta
La señal de **CEDA EL PASO (R-2)** indica que los conductores deben **reducir la velocidad y detenerse si es necesario**, para permitir el paso preferente a los vehículos o peatones que circulan por la vía a la que intentan ingresar o cruzar.

### 📌 Ejemplo
Si llegas a una intersección con señal de CEDA EL PASO y compruebas con suficiente antelación que no viene ningún vehículo ni cruza ningún peatón, puedes incorporarte fluidamente sin necesidad de frenar a cero.

### 🧠 Para recordar
CEDA EL PASO exige precaución y preferencia hacia los demás usuarios de la vía.`
    ]
  },
  {
    id: 'pare_vs_ceda_diferencia',
    categoria: 'pare_ceda',
    intencion: 'diferencia_pare_ceda',
    patrones: [
      'cual es la diferencia entre pare y ceda', 'cuál es la diferencia entre pare y ceda',
      'diferencia entre pare y ceda el paso', 'diferencias pare y ceda',
      'cual tiene mayor exigencia', 'cuál tiene mayor exigencia', 'pare vs ceda'
    ],
    respuestas: [
      () => `### 🚦 Diferencia Clave MTC:

• **PARE (R-1):** Exige **DETENCIÓN TOTAL Y OBLIGATORIA (0 km/h)** en todos los casos, haya o no otros vehículos o peatones.
• **CEDA EL PASO (R-2):** Exige **REDUCIR LA VELOCIDAD** y detenerse **ÚNICAMENTE si se aproximan vehículos o peatones** con derecho de paso.

### 🧠 Para recordar
La señal de **PARE tiene mayor exigencia** que la de CEDA EL PASO, pues no permite continuar sin haber hecho la parada completa previa.`
    ]
  },
  {
    id: 'pare_detenerse_siempre',
    categoria: 'pare_ceda',
    intencion: 'pare_obligatorio_siempre',
    patrones: [
      'tengo que detenerme siempre ante pare', 'tengo que detenerme obligatoriamente en pare',
      'tengo que parar si no viene nadie en pare', 'debo parar en pare si la calle esta vacia',
      'que pasa si no viene nadie en pare'
    ],
    respuestas: [
      () => `### 🚦 Respuesta
**Sí, absolutamente siempre.** Ante una señal de **PARE**, la detención completa a 0 km/h es **estrictamente obligatoria**, incluso si la calle está vacía, es de noche o no se aproxima ningún vehículo.

### ⚠️ Importante para el examen
En la evaluación práctica y en las preguntas del balotario del MTC, no detener el vehículo al 100% ante un PARE es considerado una **falta Muy Grave (M-01/M-02)** que causa descalificación directa.`
    ]
  },
  {
    id: 'ceda_situacion_cruce',
    categoria: 'pare_ceda',
    intencion: 'ceda_que_hacer_cruce',
    patrones: [
      'estoy llegando a un cruce y veo ceda el paso que debo hacer',
      'estoy llegando a un cruce y veo una señal de ceda el paso, ¿qué debo hacer?',
      'que hago ante ceda el paso', 'qué hago ante ceda el paso',
      'como actuar ante ceda el paso', 'que debo hacer si veo ceda el paso'
    ],
    respuestas: [
      () => `### 🚦 ¿Qué hacer al llegar a un cruce con CEDA EL PASO?

1. **Reduce la velocidad progresivamente** antes de ingresar al cruce.
2. **Observa ambos lados de la vía transversal** para verificar el flujo de vehículos y peatones.
3. **Si se aproxima alguien:** Detén la marcha con suavidad y espera a que cruce.
4. **Si la vía está completamente libre:** Puedes ingresar o cruzar de manera continua y segura sin necesidad de detenerte a cero.

### 🧠 Para recordar
En CEDA EL PASO tú decides si te detienes o no, según el tránsito presente.`
    ]
  },
  {
    id: 'ceda_si_no_viene_nadie',
    categoria: 'pare_ceda',
    intencion: 'ceda_sin_vehiculos',
    patrones: [
      'que pasa si no viene ningun vehiculo cuando encuentro ceda',
      'que pasa si no viene nadie en ceda', 'tengo que detenerme aunque no venga nadie en ceda',
      'y tengo que detenerme aunque no venga nadie', 'tengo que parar si no viene nadie en ceda'
    ],
    respuestas: [
      () => `### 🚦 Respuesta
**No tienes que detenerte a cero si no viene nadie.**

A diferencia de la señal de PARE, ante una señal de **CEDA EL PASO**, si has reducido la velocidad, observado atentamente y comprobado que la vía está completamente despejada, **puedes continuar la marcha de forma fluida**.

### 🧠 Para recordar
• **PARE:** Te detienes siempre (venga o no venga alguien).
• **CEDA:** Te detienes solo si viene alguien con derecho preferente.`
    ]
  },

  /* ────────────────────────────────────────────────────────────
     4. 🔄 ÓVALOS Y PRIORIDAD DE PASO
     ──────────────────────────────────────────────────────────── */
  {
    id: 'ovalo_prioridad_general',
    categoria: 'ovales_prioridad',
    intencion: 'prioridad_ovalo',
    patrones: [
      'quien tiene prioridad en un ovalo', 'quién tiene prioridad en un óvalo',
      'prioridad en rotonda', 'prioridad en ovalo', 'explicame la prioridad de paso en un ovalo',
      'quien pasa primero en un ovalo', 'regla del ovalo'
    ],
    respuestas: [
      () => `### 🚦 Respuesta
En el Perú, según el **Art. 182 del Reglamento Nacional de Tránsito**, **el vehículo que ya se encuentra circulando dentro del óvalo tiene la máxima prioridad de paso** sobre cualquier vehículo que intente ingresar.

### 📌 Ejemplo
Si estás por entrar a un óvalo y observas que un vehículo ya está dando la vuelta por cualquiera de los carriles interiores o exteriores, debes frenar o aminorar la marcha antes de la línea de entrada y cederle el paso.

### 🧠 Para recordar
• **Dentro del óvalo:** Tienes la preferencia.
• **Ingresando al óvalo:** Debes ceder el paso siempre.`
    ]
  },
  {
    id: 'ovalo_ingreso_correcto',
    categoria: 'ovales_prioridad',
    intencion: 'ingreso_ovalo',
    patrones: [
      'como ingreso correctamente a un ovalo', 'cómo ingreso correctamente a un óvalo',
      'que debo observar antes de entrar a un ovalo', 'qué debo observar antes de entrar a un óvalo',
      'como entrar a un ovalo', 'pasos para entrar a una rotonda'
    ],
    respuestas: [
      () => `### 🚦 Pasos para ingresar correctamente a un óvalo:

1. **Reduce la velocidad** al aproximarte a la entrada del óvalo.
2. **Ubícate en el carril adecuado:**
   • Carril derecho si vas a tomar la primera o segunda salida.
   • Carril izquierdo o central si vas a dar la vuelta completa o tomar salidas lejanas.
3. **Cede el paso** a los vehículos que ya están girando dentro de la rotonda.
4. **Ingresa únicamente** cuando exista un espacio seguro que no obligue a frenar a quienes ya circulan dentro.

### ⚠️ Importante
No aceleres para ganarle el paso al que ya está dentro; es una de las causas más comunes de accidentes y faltas de examen.`
    ]
  },
  {
    id: 'ovalo_salida_correcta',
    categoria: 'ovales_prioridad',
    intencion: 'salida_ovalo',
    patrones: [
      'como debo salir de un ovalo', 'cómo debo salir de un óvalo',
      'como salir de una rotonda', 'senalizar salida ovalo', 'direccional en ovalo'
    ],
    respuestas: [
      () => `### 🚦 Maniobra de salida en un óvalo:

1. **Posiciónate en el carril exterior (derecho)** con suficiente anticipación antes de tu salida. Nunca salgas directamente desde el carril más interno cruzando los demás carriles de golpe.
2. **Acciona la luz direccional derecha** al pasar la salida anterior a la que vas a tomar.
3. **Verifica tus espejos retrovisores** para asegurar que no tengas vehículos o motos en tu punto ciego lateral derecho.
4. **Abandona el óvalo con suavidad**, manteniendo tu carril.

### 🧠 Para recordar
La luz direccional derecha avisa a los demás conductores que vas a abandonar el óvalo.`
    ]
  },

  /* ────────────────────────────────────────────────────────────
     5. 🛣️ REGLAS DE CIRCULACIÓN
     ──────────────────────────────────────────────────────────── */
  {
    id: 'circulacion_prioridad_intersecciones',
    categoria: 'reglas_circulacion',
    intencion: 'prioridad_interseccion',
    patrones: [
      'prioridad de paso en intersecciones', 'quien pasa primero en un cruce',
      'regla de la mano derecha', 'regla de la derecha', 'cruce sin semaforo ni policia'
    ],
    respuestas: [
      () => `### 🚦 Prioridad en intersecciones no semaforizadas:

Cuando dos vehículos llegan a un cruce sin semáforos, policías ni señales de PARE/CEDA:
1. **Regla de la derecha:** Tiene preferencia de paso el vehículo que se aproxima por el **lado derecho** del conductor.
2. **Vía pavimentada sobre afirmada:** El vehículo en calle asfaltada/pavimentada tiene preferencia sobre el que viene de calle de tierra o ripio.
3. **Vía principal:** Los vehículos en avenidas tienen preferencia sobre calles secundarias.
4. **Vehículos de emergencia:** Tienen prioridad absoluta cuando van con sirenas y balizas activas.

### 🧠 Para recordar
Si tienes dudas o el cruce es ciego, aplica el principio de manejo defensivo: disminuye la velocidad.`
    ]
  },
  {
    id: 'circulacion_limites_velocidad',
    categoria: 'reglas_circulacion',
    intencion: 'limites_velocidad',
    patrones: [
      'cuales son los limites de velocidad', 'cuáles son los límites de velocidad',
      'velocidad maxima en calles', 'velocidad maxima en avenidas', 'velocidad maxima en colegios',
      'velocidad en carretera', 'limite de velocidad mtc'
    ],
    respuestas: [
      () => `### 🚦 Límites de velocidad en Perú (D.S. 025-2021-MTC):

**En Zonas Urbanas:**
• **Calles y jirones:** Máximo **30 km/h**.
• **Avenidas:** Máximo **50 km/h**.
• **Zonas escolares y hospitales:** Máximo **30 km/h**.
• **Zonas comerciales:** **30 km/h** en calles / **50 km/h** en avenidas.

**En Carreteras (Autos particulares):**
• **Carreteras convencionales:** Hasta **100 km/h**.
• **Caminos rurales:** Hasta **60 km/h**.

### ⚠️ Importante
Exceder la velocidad por más de 30 km/h respecto al límite es infracción Muy Grave con multa del 50% de la UIT y 50 puntos en tu récord.`
    ]
  },
  {
    id: 'circulacion_adelantamiento',
    categoria: 'reglas_circulacion',
    intencion: 'adelantamiento',
    patrones: [
      'como adelantar correctamente', 'cómo adelantar correctamente',
      'por donde se adelanta', 'por dónde se adelanta', 'linea continua adelantamiento',
      'adelantar por la derecha'
    ],
    respuestas: [
      () => `### 🚦 Reglas de adelantamiento según el MTC:

1. **Siempre por la izquierda:** Todo adelantamiento debe realizarse por el carril izquierdo, salvo que el vehículo delantero vaya a voltear a la izquierda.
2. **Línea en el pavimento:**
   • **Línea discontinua blanca o amarilla:** Adelantamiento permitido cuando no venga tránsito en contra.
   • **Línea continua:** **Estrictamente prohibido** adelantar o cambiar de carril.
3. **Prohibido adelantar en:** Curvas, túneles, cruces de ferrocarril, pasos peatonales e intersecciones.

### 🧠 Para recordar
Señaliza con direccional izquierda antes de salir y con direccional derecha al regresar a tu carril.`
    ]
  },

  /* ────────────────────────────────────────────────────────────
     6. 🚥 SEMÁFOROS
     ──────────────────────────────────────────────────────────── */
  {
    id: 'semaforo_luz_roja',
    categoria: 'semaforos',
    intencion: 'luz_roja',
    patrones: [
      'que significa la luz roja', 'qué significa la luz roja',
      'que hago ante luz roja', 'que pasa si me paso la luz roja'
    ],
    respuestas: [
      () => `### 🚦 Respuesta
La **Luz Roja Fija** indica detención obligatoria inmediata del vehículo antes de la línea de parada o del paso peatonal.

### ⚠️ Importante
Pasarse la luz roja del semáforo es una infracción **Muy Grave (M-27)** que conlleva multa económica y descuento crítico de puntos. En el examen práctico descalifica de inmediato.`
    ]
  },
  {
    id: 'semaforo_luz_amarilla',
    categoria: 'semaforos',
    intencion: 'luz_amarilla',
    patrones: [
      'que significa la luz amarilla', 'qué significa la luz amarilla',
      'que hacer ante luz amarilla', 'puedo cruzar con luz amarilla', 'luz ambar'
    ],
    respuestas: [
      () => `### 🚦 Respuesta
La **Luz Amarilla (o Ámbar) Fija** advierte que la luz cambiará a rojo en breves segundos.

### 📌 Acción correcta
• **Regla general:** Debes **detenerte** antes de la línea de parada.
• **Excepción:** Si estás tan cerca del cruce que frenar bruscamente provocaría una colisión por alcance con el vehículo de atrás, debes despejar el cruce con precaución.

### 🧠 Para recordar
La luz amarilla **NO es para acelerar**, sino para advertir la parada inminente.`
    ]
  },
  {
    id: 'semaforo_luz_intermitente',
    categoria: 'semaforos',
    intencion: 'luz_intermitente',
    patrones: [
      'que significa la luz amarilla intermitente', 'qué significa la luz amarilla intermitente',
      'que significa la luz roja intermitente', 'qué significa la luz roja intermitente',
      'luz intermitente del semaforo'
    ],
    respuestas: [
      () => `### 🚦 Luces Intermitentes del Semáforo:

• **Luz Amarilla Intermitente:** Indica **precaución**. Debes reducir la velocidad y continuar la marcha observando con cuidado el cruce.
• **Luz Roja Intermitente:** Equivale exactamente a una **señal de PARE**. Debes detener el vehículo por completo a 0 km/h, verificar el paso y reanudar la marcha cuando no haya peligro.

### 🧠 Para recordar
• Amarilla intermitente = Precaución y avance con cuidado.
• Roja intermitente = Parada completa obligatoria.`
    ]
  },

  /* ────────────────────────────────────────────────────────────
     7. ⚠️ INFRACCIONES Y SANCIONES
     ──────────────────────────────────────────────────────────── */
  {
    id: 'infracciones_que_son',
    categoria: 'infracciones',
    intencion: 'que_es_infraccion',
    patrones: [
      'que es una infraccion de transito', 'qué es una infracción de tránsito',
      'diferencia entre infraccion y sancion', 'tipos de infracciones'
    ],
    respuestas: [
      () => `### 🚦 Respuesta
• **Infracción:** Es el incumplimiento o violación de las normas establecidas en el Reglamento Nacional de Tránsito por parte del conductor o peatón.
• **Sanción:** Es la consecuencia legal y administrativa que se impone al infractor (multa económica, suspensión de licencia, cancelación o retención del vehículo).

### 📌 Clasificación de Infracciones MTC:
1. **Muy Graves (M):** Conductas de alto riesgo (ej. alcohol al volante, semáforo en rojo, exceso extremo de velocidad).
2. **Graves (G):** Faltas que comprometen la fluidez o seguridad (ej. no usar cinturón, adelantar en curva, no respetar prioridad).
3. **Leves (L):** Faltas menores (ej. estacionar en lugar no señalizado sin obstaculizar severamente).`
    ]
  },
  {
    id: 'infracciones_sistema_puntos',
    categoria: 'infracciones',
    intencion: 'sistema_puntos',
    patrones: [
      'como funciona el sistema de puntos', 'cómo funciona el sistema de puntos',
      'cuantos puntos te quitan', 'cuántos puntos te quitan', 'limite de 100 puntos'
    ],
    respuestas: [
      () => `### 🚦 Sistema de Control de Licencias por Puntos:

En el Perú se acumulan puntos en el récord del conductor por cada infracción cometida:
• **Infracción Leve:** 5 a 10 puntos.
• **Infracción Grave:** 20 a 50 puntos.
• **Infracción Muy Grave:** 50 a 100 puntos.

### ⚠️ Consecuencias del acumulado:
• El límite máximo es de **100 puntos firmes acumulados en 24 meses**.
• **1.ª vez con 100 pts:** Suspensión de la licencia por **6 meses**.
• **2.ª vez con 100 pts:** Suspensión por **12 meses**.
• **3.ª vez con 100 pts:** **Cancelación definitiva e inhabilitación** del brevete.`
    ]
  },

  /* ────────────────────────────────────────────────────────────
     8. 🔧 MECÁNICA BÁSICA
     ──────────────────────────────────────────────────────────── */
  {
    id: 'mecanica_general',
    categoria: 'mecanica_basica',
    intencion: 'mecanica_general',
    patrones: [
      'explicame mecanica basica', 'explícame mecánica básica',
      'que entra de mecanica en el examen', 'conceptos de mecanica basica'
    ],
    respuestas: [
      () => `### 🚦 Mecánica Básica para el Examen MTC:

Los aspectos principales evaluados en el examen de reglas son de mantenimiento preventivo:
1. **Nivel de Aceite de Motor:** Se mide con la varilla medidora con el motor **apagado y frío** en superficie plana.
2. **Presión de Neumáticos:** Se mide con manómetro en **frío**. Una presión baja aumenta el consumo de combustible y desgasta los bordes de la llanta.
3. **Líquido de Frenos y Refrigerante:** Se comprueba visualmente que estén entre MIN y MAX.
4. **Testigos del Tablero:**
   • *Aceitera roja:* Baja presión de aceite (parar motor de inmediato).
   • *Termómetro rojo:* Sobrecalentamiento del motor.
   • *Batería roja:* Falla del alternador / carga eléctrica.

### 🧠 Para recordar
La mecánica en el examen MTC está orientada a la seguridad preventiva del conductor.`
    ]
  },
  {
    id: 'mecanica_neumaticos_presion',
    categoria: 'mecanica_basica',
    intencion: 'neumaticos_presion',
    patrones: [
      'presion de neumaticos', 'presión de neumáticos', 'como medir la presion de llantas',
      'que pasa si la llanta tiene poca presion', 'desgaste de neumaticos'
    ],
    respuestas: [
      () => `### 🚦 Presión de Neumáticos:

• **¿Cómo y cuándo medirla?** Se mide siempre con los neumáticos en **frío** utilizando un manómetro calibrado.
• **¿Si tiene poca presión (baja)?** Se desgastan los **hombros o bordes exteriores**, aumenta el consumo de combustible y se alarga la distancia de frenado.
• **¿Si tiene exceso de presión (alta)?** Se desgasta el **centro de la banda de rodadura**, el vehículo pierde adherencia y se siente más rígido ante baches.

### 🧠 Para recordar
La presión recomendada figura en el marco de la puerta del conductor o en el manual del fabricante del auto.`
    ]
  },

  /* ────────────────────────────────────────────────────────────
     9. 🚗 SEGURIDAD VIAL Y PRIMEROS AUXILIOS
     ──────────────────────────────────────────────────────────── */
  {
    id: 'seguridad_cinturon_pasajeros',
    categoria: 'seguridad_vial',
    intencion: 'cinturon_seguridad',
    patrones: [
      'uso del cinturon de seguridad', 'quienes deben usar cinturon',
      'cinturon en asientos traseros', 'es obligatorio el cinturon'
    ],
    respuestas: [
      () => `### 🚦 Cinturón de Seguridad:

• **Obligatoriedad:** Es obligatorio para el conductor y **todos los ocupantes del vehículo**, tanto en asientos delanteros como traseros.
• **Función principal:** Evita que los ocupantes salgan despedidos del vehículo y reduce en más del 50% las lesiones mortales en un impacto.
• **Niños menores:** Deben viajar en los asientos traseros con sistemas de retención infantil (sillas de seguridad) según su peso y edad.

### ⚠️ Importante
No usar el cinturón de seguridad es una infracción Grave para el conductor y acarrea sanción directa.`
    ]
  },
  {
    id: 'seguridad_distancia_seguimiento',
    categoria: 'seguridad_vial',
    intencion: 'distancia_seguridad',
    patrones: [
      'distancia de seguridad', 'distancia de seguimiento',
      'regla de los dos segundos', 'regla de los 2 segundos', 'distancia con el auto de adelante'
    ],
    respuestas: [
      () => `### 🚦 Distancia de Seguridad:

Es el espacio libre que debes mantener respecto al vehículo que te antecede para poder frenar a tiempo sin colisionar si este se detiene bruscamente.

### 📌 Regla de los 2 a 3 segundos
1. Toma un punto de referencia fijo en el camino (árbol, poste o puente).
2. Cuando el vehículo delantero pase por ese punto, cuenta *"mil uno, mil dos, mil tres"*.
3. Si tu vehículo llega al punto antes de terminar de contar, estás muy cerca y debes aumentar la distancia.

### 🧠 Para recordar
En condiciones de lluvia, niebla o pista mojada, la distancia debe duplicarse a **4 o 5 segundos**.`
    ]
  },
  {
    id: 'seguridad_primeros_auxilios_pas',
    categoria: 'seguridad_vial',
    intencion: 'primeros_auxilios_pas',
    patrones: [
      'que es el protocolo pas', 'qué es el protocolo pas', 'primeros auxilios en accidentes',
      'que hacer en un accidente de transito', 'socorrer a un herido'
    ],
    respuestas: [
      () => `### 🚦 Protocolo P.A.S. en Accidentes:

1. **P - Proteger:** Señaliza el lugar con luces de emergencia y triángulos de seguridad (a 50 m en ciudad / 100 m en carretera) para evitar nuevos choques.
2. **A - Avisar:** Comunica a emergencias (116 Bomberos, 105 Policía Nacional, 106 SAMU) detallando lugar y número de heridos.
3. **S - Socorrer:** Brinda auxilio básico sin mover a víctimas graves salvo peligro de fuego o explosión.

### ⚠️ Reglas clave de examen MTC:
• **A motociclistas NUNCA se les quita el casco**.
• **NO dar agua ni alimentos** a personas inconscientes.`
    ]
  },

  /* ────────────────────────────────────────────────────────────
     10. 🅿️ ESTACIONAMIENTO Y MANIOBRAS
     ──────────────────────────────────────────────────────────── */
  {
    id: 'estacionamiento_lugares_prohibidos',
    categoria: 'estacionamiento',
    intencion: 'donde_no_estacionar',
    patrones: [
      'donde esta prohibido estacionar', 'dónde está prohibido estacionar',
      'distancia para estacionar de un hidrante', 'distancia de esquina para estacionar',
      'estacionar en curva', 'prohibido estacionar'
    ],
    respuestas: [
      () => `### 🚦 Lugares donde está prohibido estacionar:

• A menos de **5 metros de un grifo de agua contra incendios (hidrante)**.
• A menos de **5 metros de una esquina o intersección**.
• A menos de **10 metros de un paso peatonal o paradero de transporte**.
• En curvas, puentes, túneles, rampas y pasos a desnivel.
• Frente a puertas de garajes o entradas de hospitales.
• Sobre aceras, veredas o pasos peatonales.

### 🧠 Para recordar
Estacionar es colocar el vehículo en un lugar autorizado por más tiempo del necesario para dejar o recoger pasajeros.`
    ]
  },

  /* ────────────────────────────────────────────────────────────
     11. 🎯 CONSEJOS PARA EL EXAMEN
     ──────────────────────────────────────────────────────────── */
  {
    id: 'consejos_como_estudiar',
    categoria: 'consejos_examen',
    intencion: 'consejos_estudio',
    patrones: [
      'consejos para el examen', 'como estudiar para el examen', 'cómo estudiar para el examen',
      'como organizar mi tiempo', 'como evitar memorizar mecanicamente', 'tips para aprobar el mtc'
    ],
    respuestas: [
      () => `### 🎯 Consejos de Oro para el Examen MTC:

1. **Gestión del tiempo:** Tienes 40 minutos para 40 preguntas (1 minuto por pregunta). Si dudas en una pregunta, márcala y continúa para no perder tiempo.
2. **Atención a palabras trampa:** Identifica palabras clave como *"EXCEPTO"*, *"SALVO"*, *"NO ES CORRECTO"* o *"SIEMPRE"*.
3. **Técnica del descarte:** Descarta primero las 2 alternativas más absurdas o extremistas. La respuesta correcta siempre promueve la seguridad y el respeto a la ley.
4. **Estudia por bloques temáticos:** Señales y Normas representan el 60% del balotario.
5. **Usa los simuladores de DrivePrepPlus:** Realiza al menos 3 simulacros completos antes de tu fecha oficial hasta promediar más del 88% de aciertos.`
    ]
  }
];

/* ── Temas fuera de dominio MTC ── */
export const TEMAS_FUERA_DOMINIO = [
  'partido', 'futbol', 'fútbol', 'chiste', 'receta', 'cocinar', 'cancion', 'canción',
  'capital de', 'quien gano', 'quién ganó', 'clima en', 'presidente', 'pelicula', 'película',
  'matematica', 'videojuego', 'horoscopo', 'horóscopo', 'poema', 'chismes', 'musica',
  'cuentame un chiste', 'hazme reir', 'dame una receta'
];
