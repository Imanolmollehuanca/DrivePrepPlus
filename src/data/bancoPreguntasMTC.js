/* ============================================================
   DrivePrep+ — Banco de Preguntas MTC (Fase 3 — Completo)
   40 preguntas con distribución equilibrada:
     • 10 Señales de tránsito
     • 10 Normas de circulación
     • 10 Infracciones y sanciones
     • 10 Seguridad vial
   Tipos: opcion_multiple · relacionar · ordenar · clasificar · completar
   ============================================================ */

/* ── Categorías ── */
export const CATEGORIAS = {
  senales:      { id:'senales',      label:'Señales de tránsito',     color:'#f59e0b', icon:'AlertTriangle' },
  normas:       { id:'normas',       label:'Normas de circulación',   color:'#6366f1', icon:'BookOpen'      },
  infracciones: { id:'infracciones', label:'Infracciones y sanciones',color:'#ef4444', icon:'Gavel'         },
  seguridad:    { id:'seguridad',    label:'Seguridad vial',          color:'#10b981', icon:'Shield'        },
};

/* ── Evaluador universal ── */
export function evaluarRespuesta(pregunta, respuestaUsuario) {
  if (respuestaUsuario === undefined || respuestaUsuario === null)
    return { correcta: false, puntajeParcial: 0 };

  switch (pregunta.tipo) {
    case 'opcion_multiple':
      return { correcta: respuestaUsuario === pregunta.correcta, puntajeParcial: respuestaUsuario === pregunta.correcta ? 1 : 0 };

    case 'relacionar': {
      const total = pregunta.columnaIzq.length;
      let aciertos = 0;
      Object.entries(pregunta.paresCorrectos).forEach(([izq, der]) => {
        if (respuestaUsuario[izq] === der) aciertos++;
      });
      return { correcta: aciertos === total, puntajeParcial: total > 0 ? aciertos / total : 0 };
    }

    case 'ordenar': {
      const correctoArr = pregunta.ordenCorrecto;
      const usuarioArr  = Array.isArray(respuestaUsuario) ? respuestaUsuario : [];
      let aciertos = 0;
      correctoArr.forEach((id, i) => { if (usuarioArr[i] === id) aciertos++; });
      return { correcta: aciertos === correctoArr.length, puntajeParcial: correctoArr.length > 0 ? aciertos / correctoArr.length : 0 };
    }

    case 'clasificar': {
      const total = Object.keys(pregunta.clasificacionCorrecta).length;
      let aciertos = 0;
      Object.entries(pregunta.clasificacionCorrecta).forEach(([item, cat]) => {
        if (respuestaUsuario[item] === cat) aciertos++;
      });
      return { correcta: aciertos === total, puntajeParcial: total > 0 ? aciertos / total : 0 };
    }

    case 'completar': {
      const total = Object.keys(pregunta.respuestasCorrectas).length;
      let aciertos = 0;
      Object.entries(pregunta.respuestasCorrectas).forEach(([hueco, val]) => {
        if (respuestaUsuario[hueco] === val) aciertos++;
      });
      return { correcta: aciertos === total, puntajeParcial: total > 0 ? aciertos / total : 0 };
    }

    default:
      return { correcta: false, puntajeParcial: 0 };
  }
}

/* ══════════════════════════════════════════════════════════════
   BANCO DE PREGUNTAS — 40 preguntas, 4 categorías × 10 c/u
   ══════════════════════════════════════════════════════════════ */
export const BANCO_PREGUNTAS = [

  /* ════════════ SEÑALES DE TRÁNSITO (10) ════════════ */
  {
    id:1, tipo:'opcion_multiple', categoria:'senales', dificultad:'facil',
    enunciado:'¿Qué forma tienen las señales preventivas en el Perú?',
    opciones:[
      {id:'a',texto:'Círculo con borde rojo'},
      {id:'b',texto:'Rombo (cuadrado a 45°) con fondo amarillo'},
      {id:'c',texto:'Rectángulo con fondo verde'},
      {id:'d',texto:'Octágono con fondo rojo'},
    ],
    correcta:'b',
    explicacion:'Las señales preventivas tienen forma de rombo con fondo amarillo y símbolo negro. Advierten condiciones peligrosas en la vía.',
  },
  {
    id:2, tipo:'opcion_multiple', categoria:'senales', dificultad:'facil',
    enunciado:'Una señal circular con borde rojo y símbolo negro indica:',
    opciones:[
      {id:'a',texto:'Una advertencia de peligro próximo'},
      {id:'b',texto:'Información sobre servicios disponibles'},
      {id:'c',texto:'Una prohibición u obligación para el conductor'},
      {id:'d',texto:'Zona escolar de velocidad reducida'},
    ],
    correcta:'c',
    explicacion:'Las señales reglamentarias circulares con borde rojo indican prohibiciones. Son de cumplimiento obligatorio.',
  },
  {
    id:3, tipo:'opcion_multiple', categoria:'senales', dificultad:'media',
    enunciado:'¿Cuál es el color de fondo de las señales informativas de destino en carreteras?',
    opciones:[
      {id:'a',texto:'Amarillo'},
      {id:'b',texto:'Azul'},
      {id:'c',texto:'Verde'},
      {id:'d',texto:'Rojo'},
    ],
    correcta:'c',
    explicacion:'Las señales informativas de destino tienen fondo verde con letras blancas. El azul se usa para servicios y el marrón para sitios turísticos.',
  },
  {
    id:4, tipo:'opcion_multiple', categoria:'senales', dificultad:'facil',
    enunciado:'La señal de "PARE" obliga al conductor a:',
    opciones:[
      {id:'a',texto:'Reducir velocidad y ceder el paso si hay vehículos'},
      {id:'b',texto:'Detener el vehículo completamente antes de la línea y ceder el paso'},
      {id:'c',texto:'Parar solo si hay peatones cruzando'},
      {id:'d',texto:'Disminuir la velocidad a 30 km/h'},
    ],
    correcta:'b',
    explicacion:'PARE exige detención completa antes de la línea de parada y ceder el paso a todos los usuarios.',
  },
  {
    id:5, tipo:'opcion_multiple', categoria:'senales', dificultad:'media',
    enunciado:'Una señal circular azul con flecha blanca indica:',
    opciones:[
      {id:'a',texto:'Prohibición de circular en esa dirección'},
      {id:'b',texto:'Obligación de seguir la dirección indicada'},
      {id:'c',texto:'Recomendación de seguir la dirección indicada'},
      {id:'d',texto:'Zona de cruce peatonal'},
    ],
    correcta:'b',
    explicacion:'Las señales circulares azules con símbolo blanco son de obligación. El conductor debe seguir la dirección indicada.',
  },
  {
    id:6, tipo:'relacionar', categoria:'senales', dificultad:'media',
    enunciado:'Relaciona cada señal con su significado correcto.',
    instruccion:'Selecciona un elemento de la izquierda y luego su par en la derecha.',
    columnaIzq:[
      {id:'s1', texto:'🔺 Rombo amarillo'},
      {id:'s2', texto:'🔴 Círculo rojo'},
      {id:'s3', texto:'🟢 Rectángulo verde'},
      {id:'s4', texto:'🔷 Octágono rojo'},
    ],
    columnaDer:[
      {id:'d1', texto:'Señal de PARE'},
      {id:'d2', texto:'Señal informativa de destino'},
      {id:'d3', texto:'Señal preventiva de peligro'},
      {id:'d4', texto:'Señal reglamentaria de prohibición'},
    ],
    paresCorrectos:{s1:'d3', s2:'d4', s3:'d2', s4:'d1'},
    explicacion:'Rombo amarillo = preventiva. Círculo rojo = prohibición. Verde = informativa. Octágono = PARE.',
  },
  {
    id:7, tipo:'clasificar', categoria:'senales', dificultad:'media',
    enunciado:'Clasifica cada señal en su categoría correcta.',
    instruccion:'Arrastra cada señal a la columna correspondiente.',
    categorias:[
      {id:'prev', label:'Preventiva',     color:'#f59e0b'},
      {id:'regl', label:'Reglamentaria',  color:'#ef4444'},
      {id:'info', label:'Informativa',    color:'#3b82f6'},
    ],
    items:[
      {id:'it1', texto:'⚠️ Curva peligrosa',         emoji:'⚠️'},
      {id:'it2', texto:'🚫 No adelantar',              emoji:'🚫'},
      {id:'it3', texto:'🟢 Dirección a Lima',          emoji:'🗺️'},
      {id:'it4', texto:'⚠️ Cruce escolar',             emoji:'🏫'},
      {id:'it5', texto:'🚗 Velocidad máx. 60 km/h',   emoji:'60'},
      {id:'it6', texto:'ℹ️ Estacionamiento permitido', emoji:'🅿️'},
    ],
    clasificacionCorrecta:{it1:'prev', it2:'regl', it3:'info', it4:'prev', it5:'regl', it6:'info'},
    explicacion:'Curva peligrosa y cruce escolar = preventivas. No adelantar y velocidad máxima = reglamentarias. Destino y estacionamiento = informativas.',
  },
  {
    id:8, tipo:'opcion_multiple', categoria:'senales', dificultad:'dificil',
    enunciado:'¿Qué diferencia a la señal de "CEDA EL PASO" de la de "PARE"?',
    opciones:[
      {id:'a',texto:'CEDA no requiere detenerse completamente si no hay peligro'},
      {id:'b',texto:'CEDA aplica solo a peatones, PARE a vehículos'},
      {id:'c',texto:'CEDA tiene forma octagonal y PARE triangular'},
      {id:'d',texto:'CEDA solo aplica en autopistas'},
    ],
    correcta:'a',
    explicacion:'CEDA EL PASO (triángulo invertido) permite no detener si hay paso libre. PARE obliga a detenerse completamente siempre.',
  },
  {
    id:9, tipo:'completar', categoria:'senales', dificultad:'media',
    enunciado:'Completa el texto sobre las características de las señales de tránsito.',
    instruccion:'Haz clic en una palabra del banco y luego en el espacio donde va.',
    textoConHuecos:'Las señales {{h1}} tienen forma de rombo y fondo {{h2}}. Las señales reglamentarias son de forma {{h3}} con borde rojo. Las señales informativas de destino tienen fondo {{h4}}.',
    palabrasDisponibles:['preventivas','informativas','amarillo','verde','azul','circular','octagonal','rectangular'],
    respuestasCorrectas:{h1:'preventivas', h2:'amarillo', h3:'circular', h4:'verde'},
    explicacion:'Preventivas: rombo amarillo. Reglamentarias: círculo con borde rojo. Informativas de destino: fondo verde.',
  },
  {
    id:10, tipo:'opcion_multiple', categoria:'senales', dificultad:'dificil',
    enunciado:'¿Qué indica una señal de delineadores (postes reflectivos) al borde de la carretera?',
    opciones:[
      {id:'a',texto:'Que hay una zona de descanso próxima'},
      {id:'b',texto:'Delimitan el borde de la calzada y orientan visualmente la vía'},
      {id:'c',texto:'Señalan el inicio de una zona urbana'},
      {id:'d',texto:'Indican la distancia al siguiente peaje'},
    ],
    correcta:'b',
    explicacion:'Los delineadores son dispositivos de seguridad que marcan el borde de la vía y guían visualmente al conductor, especialmente de noche.',
  },

  /* ════════════ NORMAS DE CIRCULACIÓN (10) ════════════ */
  {
    id:11, tipo:'opcion_multiple', categoria:'normas', dificultad:'facil',
    enunciado:'¿Cuál es la velocidad máxima en zonas urbanas en Perú, salvo señal en contrario?',
    opciones:[
      {id:'a',texto:'40 km/h'},
      {id:'b',texto:'50 km/h'},
      {id:'c',texto:'60 km/h'},
      {id:'d',texto:'80 km/h'},
    ],
    correcta:'c',
    explicacion:'El RNT establece 60 km/h como límite en zonas urbanas, salvo señalización diferente.',
  },
  {
    id:12, tipo:'opcion_multiple', categoria:'normas', dificultad:'media',
    enunciado:'¿Cuándo es obligatorio el uso del cinturón de seguridad?',
    opciones:[
      {id:'a',texto:'Solo en carreteras y autopistas'},
      {id:'b',texto:'Solo el conductor y copiloto delantero'},
      {id:'c',texto:'En todo momento y para todos los ocupantes'},
      {id:'d',texto:'Solo cuando la velocidad supera los 60 km/h'},
    ],
    correcta:'c',
    explicacion:'El cinturón es obligatorio para todos los ocupantes del vehículo en todo momento y en cualquier tipo de vía.',
  },
  {
    id:13, tipo:'opcion_multiple', categoria:'normas', dificultad:'media',
    enunciado:'La velocidad máxima para automóviles en carreteras nacionales es:',
    opciones:[
      {id:'a',texto:'80 km/h'},
      {id:'b',texto:'90 km/h'},
      {id:'c',texto:'100 km/h'},
      {id:'d',texto:'120 km/h'},
    ],
    correcta:'c',
    explicacion:'En red vial nacional, automóviles: 100 km/h. Para transporte público y vehículos de carga el límite es menor.',
  },
  {
    id:14, tipo:'opcion_multiple', categoria:'normas', dificultad:'media',
    enunciado:'¿En qué orden de prioridad se cede el paso en intersecciones sin señalización?',
    opciones:[
      {id:'a',texto:'El vehículo más grande tiene prioridad absoluta'},
      {id:'b',texto:'El que llegó primero tiene prioridad'},
      {id:'c',texto:'Primero peatones, luego el vehículo que viene por la derecha'},
      {id:'d',texto:'El vehículo más rápido tiene prioridad'},
    ],
    correcta:'c',
    explicacion:'Peatones tienen prioridad absoluta. Entre vehículos, cede el que tiene a otro por su derecha.',
  },
  {
    id:15, tipo:'relacionar', categoria:'normas', dificultad:'media',
    enunciado:'Relaciona cada situación con la norma de tránsito aplicable.',
    instruccion:'Selecciona un elemento de la izquierda y luego su par en la derecha.',
    columnaIzq:[
      {id:'n1', texto:'Intersección con semáforo en verde'},
      {id:'n2', texto:'Cruce de ferrocarril sin barreras'},
      {id:'n3', texto:'Vía con niebla densa'},
      {id:'n4', texto:'Zona escolar'},
    ],
    columnaDer:[
      {id:'r1', texto:'Reducir velocidad y encender luces'},
      {id:'r2', texto:'Máximo 30 km/h y alta precaución'},
      {id:'r3', texto:'Circular con precaución, ceder a peatones'},
      {id:'r4', texto:'Detenerse, verificar y cruzar con precaución'},
    ],
    paresCorrectos:{n1:'r3', n2:'r4', n3:'r1', n4:'r2'},
    explicacion:'Semáforo verde: circular con precaución. Cruce ferroviario: detenerse. Niebla: luces y velocidad reducida. Zona escolar: 30 km/h.',
  },
  {
    id:16, tipo:'opcion_multiple', categoria:'normas', dificultad:'facil',
    enunciado:'¿Está permitido usar el teléfono celular mientras se conduce?',
    opciones:[
      {id:'a',texto:'Sí, si se usa altavoz'},
      {id:'b',texto:'Sí, solo para llamadas cortas'},
      {id:'c',texto:'No, está prohibido mientras se conduce'},
      {id:'d',texto:'Sí, si el vehículo está detenido en semáforo'},
    ],
    correcta:'c',
    explicacion:'El uso del celular mientras se conduce está prohibido. Solo están permitidos los sistemas de manos libres integrados al vehículo.',
  },
  {
    id:17, tipo:'ordenar', categoria:'normas', dificultad:'media',
    enunciado:'Ordena las acciones correctas al realizar un adelantamiento en carretera.',
    instruccion:'Arrastra los pasos hasta lograr el orden correcto.',
    items:[
      {id:'p1', texto:'Verificar que el carril contrario esté libre', emoji:'👁️'},
      {id:'p2', texto:'Activar la luz de giro izquierda', emoji:'↰'},
      {id:'p3', texto:'Acelerar y adelantar rápidamente', emoji:'🚗'},
      {id:'p4', texto:'Volver al carril derecho al ver el vehículo adelantado por el espejo', emoji:'↱'},
      {id:'p5', texto:'Apagar la luz de giro', emoji:'💡'},
    ],
    ordenCorrecto:['p2','p1','p3','p4','p5'],
    explicacion:'Primero señalizar, luego verificar, adelantar, regresar al carril y desactivar la señal.',
  },
  {
    id:18, tipo:'completar', categoria:'normas', dificultad:'media',
    enunciado:'Completa las normas de circulación en Perú.',
    instruccion:'Haz clic en una palabra del banco y luego en el espacio donde va.',
    textoConHuecos:'La velocidad máxima en zona urbana es {{h1}} km/h. El cinturón es {{h2}} para todos los ocupantes. Al adelantar se debe activar el indicador {{h3}}. En zonas escolares el límite es {{h4}} km/h.',
    palabrasDisponibles:['60','80','obligatorio','opcional','izquierdo','derecho','30','50'],
    respuestasCorrectas:{h1:'60', h2:'obligatorio', h3:'izquierdo', h4:'30'},
    explicacion:'60 km/h urbano, cinturón obligatorio para todos, indicador izquierdo al adelantar, 30 km/h en zonas escolares.',
  },
  {
    id:19, tipo:'opcion_multiple', categoria:'normas', dificultad:'dificil',
    enunciado:'¿En qué carril debe circular preferentemente un vehículo en una vía de tres carriles en el mismo sentido?',
    opciones:[
      {id:'a',texto:'En el carril izquierdo para mayor velocidad'},
      {id:'b',texto:'En el carril central siempre'},
      {id:'c',texto:'En el carril derecho, salvo adelantamiento o giro'},
      {id:'d',texto:'En cualquier carril según conveniencia'},
    ],
    correcta:'c',
    explicacion:'El carril derecho es de circulación normal. El central y el izquierdo se usan para adelantar o girar y se deben desocupar después.',
  },
  {
    id:20, tipo:'opcion_multiple', categoria:'normas', dificultad:'media',
    enunciado:'¿Cuándo deben encenderse las luces del vehículo obligatoriamente?',
    opciones:[
      {id:'a',texto:'Solo de noche o en túneles'},
      {id:'b',texto:'De noche, en baja visibilidad, lluvia intensa y túneles'},
      {id:'c',texto:'Solo cuando llueve intensamente'},
      {id:'d',texto:'Únicamente en horas de noche'},
    ],
    correcta:'b',
    explicacion:'Las luces son obligatorias de noche, en baja visibilidad (neblina, lluvia), en túneles y cuando sea necesario para mayor seguridad.',
  },

  /* ════════════ INFRACCIONES Y SANCIONES (10) ════════════ */
  {
    id:21, tipo:'opcion_multiple', categoria:'infracciones', dificultad:'media',
    enunciado:'¿Cuál de estas conductas es infracción MUY GRAVE según el RNT?',
    opciones:[
      {id:'a',texto:'Estacionar en zona prohibida'},
      {id:'b',texto:'Conducir bajo la influencia del alcohol'},
      {id:'c',texto:'No usar cinturón de seguridad'},
      {id:'d',texto:'Exceder el límite de velocidad en 10 km/h'},
    ],
    correcta:'b',
    explicacion:'Conducir ebrio es infracción MUY GRAVE. Puede resultar en cancelación de licencia y responsabilidad penal.',
  },
  {
    id:22, tipo:'opcion_multiple', categoria:'infracciones', dificultad:'media',
    enunciado:'¿Qué ocurre al acumular el máximo de puntos de demérito en Perú?',
    opciones:[
      {id:'a',texto:'Solo recibe una amonestación escrita'},
      {id:'b',texto:'Debe pagar una multa adicional'},
      {id:'c',texto:'La licencia es cancelada definitivamente'},
      {id:'d',texto:'Queda suspendida por 30 días'},
    ],
    correcta:'c',
    explicacion:'Al acumular 100 puntos de demérito (máximo), la licencia de conducir es cancelada definitivamente.',
  },
  {
    id:23, tipo:'opcion_multiple', categoria:'infracciones', dificultad:'media',
    enunciado:'¿Cuál es el límite de alcoholemia para conductores particulares en Perú?',
    opciones:[
      {id:'a',texto:'0.25 g/l'},
      {id:'b',texto:'0.5 g/l'},
      {id:'c',texto:'1.0 g/l'},
      {id:'d',texto:'0.0 g/l (tolerancia cero)'},
    ],
    correcta:'b',
    explicacion:'Para conductores particulares el límite es 0.5 g/l de sangre. Para transporte público es tolerancia cero (0.0 g/l).',
  },
  {
    id:24, tipo:'relacionar', categoria:'infracciones', dificultad:'dificil',
    enunciado:'Relaciona cada infracción con su nivel de gravedad.',
    instruccion:'Selecciona un elemento de la izquierda y luego su par en la derecha.',
    columnaIzq:[
      {id:'i1', texto:'Conducir bajo efectos del alcohol'},
      {id:'i2', texto:'No usar cinturón de seguridad'},
      {id:'i3', texto:'Fuga del lugar del accidente'},
      {id:'i4', texto:'Estacionar en zona prohibida'},
    ],
    columnaDer:[
      {id:'g1', texto:'Infracción leve'},
      {id:'g2', texto:'Infracción grave'},
      {id:'g3', texto:'Infracción muy grave'},
      {id:'g4', texto:'Infracción gravísima'},
    ],
    paresCorrectos:{i1:'g3', i2:'g2', i3:'g4', i4:'g1'},
    explicacion:'Alcohol: muy grave. Sin cinturón: grave. Fuga del accidente: gravísima. Estacionamiento indebido: leve.',
  },
  {
    id:25, tipo:'clasificar', categoria:'infracciones', dificultad:'media',
    enunciado:'Clasifica cada conducta según si es infracción o conducta correcta.',
    instruccion:'Arrastra cada elemento a la columna que le corresponde.',
    categorias:[
      {id:'ok',  label:'Conducta correcta', color:'#10b981'},
      {id:'inf', label:'Infracción',         color:'#ef4444'},
    ],
    items:[
      {id:'c1', texto:'Usar cinturón de seguridad',            emoji:'✅'},
      {id:'c2', texto:'Usar el celular mientras maneja',        emoji:'📱'},
      {id:'c3', texto:'Respetar la señal de PARE',              emoji:'🛑'},
      {id:'c4', texto:'Adelantar en curva cerrada',             emoji:'⛔'},
      {id:'c5', texto:'Encender luces en túnel',                emoji:'💡'},
      {id:'c6', texto:'Conducir sin licencia vigente',          emoji:'🚫'},
    ],
    clasificacionCorrecta:{c1:'ok', c2:'inf', c3:'ok', c4:'inf', c5:'ok', c6:'inf'},
    explicacion:'Conductas correctas: cinturón, respetar señales, encender luces. Infracciones: celular al manejar, adelantar en curva, conducir sin licencia.',
  },
  {
    id:26, tipo:'opcion_multiple', categoria:'infracciones', dificultad:'facil',
    enunciado:'¿Cuántos puntos de demérito se asignan por no respetar una señal de PARE?',
    opciones:[
      {id:'a',texto:'5 puntos'},
      {id:'b',texto:'10 puntos'},
      {id:'c',texto:'15 puntos'},
      {id:'d',texto:'20 puntos'},
    ],
    correcta:'c',
    explicacion:'No respetar la señal de PARE es una infracción grave sancionada con 15 puntos de demérito.',
  },
  {
    id:27, tipo:'opcion_multiple', categoria:'infracciones', dificultad:'dificil',
    enunciado:'¿Qué documento deben portar obligatoriamente los conductores en Perú?',
    opciones:[
      {id:'a',texto:'Solo la licencia de conducir'},
      {id:'b',texto:'Licencia, tarjeta de propiedad, SOAT vigente y revisión técnica'},
      {id:'c',texto:'Solo la tarjeta de propiedad y el SOAT'},
      {id:'d',texto:'Solo DNI y licencia de conducir'},
    ],
    correcta:'b',
    explicacion:'Es obligatorio portar: licencia, tarjeta de propiedad, SOAT vigente y certificado de revisión técnica vehicular.',
  },
  {
    id:28, tipo:'completar', categoria:'infracciones', dificultad:'dificil',
    enunciado:'Completa el texto sobre el sistema de puntos de demérito en Perú.',
    instruccion:'Haz clic en una palabra del banco y luego en el espacio donde va.',
    textoConHuecos:'El máximo de puntos de demérito es {{h1}}. Al alcanzarlos, la licencia es {{h2}}. Conducir con alcohol supera el límite de {{h3}} g/l. Las infracciones leves acumulan {{h4}} puntos.',
    palabrasDisponibles:['100','50','cancelada','suspendida','0.5','1.0','5','10'],
    respuestasCorrectas:{h1:'100', h2:'cancelada', h3:'0.5', h4:'5'},
    explicacion:'100 puntos = cancelación. Alcohol: límite 0.5 g/l. Infracciones leves: 5 puntos de demérito.',
  },
  {
    id:29, tipo:'opcion_multiple', categoria:'infracciones', dificultad:'media',
    enunciado:'¿Qué implica la infracción de "fuga del lugar del accidente"?',
    opciones:[
      {id:'a',texto:'Una multa menor por no reportar el incidente'},
      {id:'b',texto:'Suspensión de la licencia por 30 días'},
      {id:'c',texto:'Cancelación de la licencia y posible responsabilidad penal'},
      {id:'d',texto:'Curso obligatorio de manejo defensivo'},
    ],
    correcta:'c',
    explicacion:'Abandonar el lugar de un accidente es infracción gravísima: cancelación de licencia y posible cargo penal por omisión de socorro.',
  },
  {
    id:30, tipo:'opcion_multiple', categoria:'infracciones', dificultad:'facil',
    enunciado:'¿Cuál es la consecuencia de conducir sin SOAT vigente?',
    opciones:[
      {id:'a',texto:'Solo una advertencia verbal'},
      {id:'b',texto:'Multa y retención del vehículo'},
      {id:'c',texto:'Suspensión de la licencia por 10 días'},
      {id:'d',texto:'No hay consecuencia si no hay accidente'},
    ],
    correcta:'b',
    explicacion:'Circular sin SOAT vigente resulta en multa económica y puede derivar en retención del vehículo hasta regularizar la documentación.',
  },

  /* ════════════ SEGURIDAD VIAL (10) ════════════ */
  {
    id:31, tipo:'opcion_multiple', categoria:'seguridad', dificultad:'facil',
    enunciado:'¿Qué es el manejo defensivo?',
    opciones:[
      {id:'a',texto:'Conducir agresivamente para protegerse'},
      {id:'b',texto:'Anticipar riesgos y tomar decisiones seguras para evitar accidentes'},
      {id:'c',texto:'Usar el claxon frecuentemente para alertar'},
      {id:'d',texto:'Conducir siempre por el carril izquierdo'},
    ],
    correcta:'b',
    explicacion:'El manejo defensivo consiste en anticipar situaciones peligrosas y actuar proactivamente para prevenirlas, independientemente de otros conductores.',
  },
  {
    id:32, tipo:'opcion_multiple', categoria:'seguridad', dificultad:'media',
    enunciado:'¿Cuál es la acción correcta si el conductor siente somnolencia al volante?',
    opciones:[
      {id:'a',texto:'Bajar la ventana para que entre aire frío'},
      {id:'b',texto:'Tomar café y continuar'},
      {id:'c',texto:'Detenerse en lugar seguro y descansar'},
      {id:'d',texto:'Aumentar velocidad para llegar rápido'},
    ],
    correcta:'c',
    explicacion:'La única solución efectiva a la somnolencia es descansar. El aire frío y el café son soluciones temporales que no eliminan el riesgo.',
  },
  {
    id:33, tipo:'ordenar', categoria:'seguridad', dificultad:'media',
    enunciado:'Ordena las acciones correctas al llegar a la escena de un accidente de tránsito.',
    instruccion:'Arrastra los pasos hasta lograr el orden correcto.',
    items:[
      {id:'a1', texto:'Asegurar la escena y señalizar el área', emoji:'🚧'},
      {id:'a2', texto:'Llamar al 911 (emergencias)', emoji:'📞'},
      {id:'a3', texto:'Evaluar el estado de las víctimas', emoji:'🔍'},
      {id:'a4', texto:'Aplicar primeros auxilios si es necesario', emoji:'🩺'},
      {id:'a5', texto:'Dar información a los servicios de emergencia', emoji:'📋'},
    ],
    ordenCorrecto:['a1','a2','a3','a4','a5'],
    explicacion:'Primero asegurar la escena (evita nuevas víctimas), llamar al 911, evaluar, actuar e informar.',
  },
  {
    id:34, tipo:'relacionar', categoria:'seguridad', dificultad:'media',
    enunciado:'Relaciona cada situación de emergencia con la acción correcta.',
    instruccion:'Selecciona un elemento de la izquierda y luego su par en la derecha.',
    columnaIzq:[
      {id:'e1', texto:'Falla de frenos en movimiento'},
      {id:'e2', texto:'Incendio en el motor'},
      {id:'e3', texto:'Reventón de neumático a alta velocidad'},
      {id:'e4', texto:'Víctima inconsciente que respira'},
    ],
    columnaDer:[
      {id:'ac1', texto:'Colocar en posición lateral de seguridad'},
      {id:'ac2', texto:'Agarrar firme el volante, reducir marchas, usar freno de mano'},
      {id:'ac3', texto:'Detener, apagar motor, alejarse del vehículo'},
      {id:'ac4', texto:'Soltar el acelerador, mantener volante firme y frenar suavemente'},
    ],
    paresCorrectos:{e1:'ac2', e2:'ac3', e3:'ac4', e4:'ac1'},
    explicacion:'Frenos: reducir marchas + freno de mano. Incendio: apagar y alejarse. Reventón: no frenar bruscamente. Inconsciente: posición lateral.',
  },
  {
    id:35, tipo:'opcion_multiple', categoria:'seguridad', dificultad:'media',
    enunciado:'¿Cuándo NO se debe mover a una víctima de accidente?',
    opciones:[
      {id:'a',texto:'Cuando la víctima esté consciente'},
      {id:'b',texto:'Siempre se debe mover para atenderla mejor'},
      {id:'c',texto:'Cuando se sospecha lesión de columna, salvo peligro inminente'},
      {id:'d',texto:'Cuando han pasado más de 10 minutos del accidente'},
    ],
    correcta:'c',
    explicacion:'No mover a una víctima con posible lesión cervical o espinal. Un movimiento incorrecto puede causar parálisis. Solo se mueve ante peligro de vida inmediato.',
  },
  {
    id:36, tipo:'opcion_multiple', categoria:'seguridad', dificultad:'media',
    enunciado:'¿Cuál es la frecuencia correcta de compresiones en la RCP para adultos?',
    opciones:[
      {id:'a',texto:'15 compresiones cada 2 respiraciones'},
      {id:'b',texto:'30 compresiones cada 2 respiraciones'},
      {id:'c',texto:'20 compresiones continuas'},
      {id:'d',texto:'10 compresiones cada respiración'},
    ],
    correcta:'b',
    explicacion:'El protocolo RCP estándar para adultos: 30 compresiones torácicas + 2 respiraciones de rescate a 100-120 compresiones/minuto.',
  },
  {
    id:37, tipo:'opcion_multiple', categoria:'seguridad', dificultad:'facil',
    enunciado:'¿Cómo se controla una hemorragia externa en una víctima de accidente?',
    opciones:[
      {id:'a',texto:'Aplicar hielo directamente sobre la herida'},
      {id:'b',texto:'Lavar con agua y dejar expuesta'},
      {id:'c',texto:'Aplicar presión directa con un paño limpio sobre la herida'},
      {id:'d',texto:'Colocar torniquete en todos los casos'},
    ],
    correcta:'c',
    explicacion:'La presión directa y sostenida con un paño limpio es el método principal para controlar hemorragias externas hasta que llegue ayuda profesional.',
  },
  {
    id:38, tipo:'clasificar', categoria:'seguridad', dificultad:'media',
    enunciado:'Clasifica cada factor según si aumenta o reduce el riesgo de accidente.',
    instruccion:'Arrastra cada elemento a la columna que le corresponde.',
    categorias:[
      {id:'reduce', label:'Reduce el riesgo',   color:'#10b981'},
      {id:'aumenta',label:'Aumenta el riesgo',  color:'#ef4444'},
    ],
    items:[
      {id:'f1', texto:'Mantener distancia de seguridad', emoji:'↔️'},
      {id:'f2', texto:'Conducir con somnolencia',         emoji:'😴'},
      {id:'f3', texto:'Revisar espejos regularmente',     emoji:'🪞'},
      {id:'f4', texto:'Exceso de velocidad',               emoji:'💨'},
      {id:'f5', texto:'Cinturón de seguridad abrochado',  emoji:'🔒'},
      {id:'f6', texto:'Distraerse con el celular',         emoji:'📱'},
    ],
    clasificacionCorrecta:{f1:'reduce', f2:'aumenta', f3:'reduce', f4:'aumenta', f5:'reduce', f6:'aumenta'},
    explicacion:'Reducen el riesgo: distancia de seguridad, revisar espejos, cinturón. Aumentan el riesgo: somnolencia, exceso de velocidad, celular.',
  },
  {
    id:39, tipo:'completar', categoria:'seguridad', dificultad:'media',
    enunciado:'Completa el texto sobre primeros auxilios en accidentes de tránsito.',
    instruccion:'Haz clic en una palabra del banco y luego en el espacio donde va.',
    textoConHuecos:'Al llegar a un accidente, primero se debe {{h1}} la escena. Si hay víctima inconsciente que respira, se coloca en posición {{h2}}. Para controlar una hemorragia se aplica {{h3}} directa. El número de emergencias en Perú es el {{h4}}.',
    palabrasDisponibles:['asegurar','abandonar','lateral','boca arriba','presión','hielo','911','105'],
    respuestasCorrectas:{h1:'asegurar', h2:'lateral', h3:'presión', h4:'911'},
    explicacion:'Asegurar la escena, posición lateral de seguridad para inconscientes que respiran, presión directa para hemorragias, llamar al 911.',
  },
  {
    id:40, tipo:'ordenar', categoria:'seguridad', dificultad:'dificil',
    enunciado:'Ordena los pasos correctos para cambiar un neumático pinchado en carretera.',
    instruccion:'Arrastra los pasos hasta lograr el orden correcto.',
    items:[
      {id:'n1', texto:'Estacionar en zona segura y señalizar', emoji:'🚧'},
      {id:'n2', texto:'Aflojar pernos levemente con la llave', emoji:'🔧'},
      {id:'n3', texto:'Colocar el gato y elevar el vehículo',  emoji:'⬆️'},
      {id:'n4', texto:'Retirar el neumático dañado',          emoji:'🔄'},
      {id:'n5', texto:'Montar la rueda de repuesto y ajustar pernos', emoji:'✅'},
    ],
    ordenCorrecto:['n1','n2','n3','n4','n5'],
    explicacion:'Siempre señalizar primero, aflojar pernos antes de elevar (más fácil), elevar con el gato, cambiar y ajustar.',
  },
];

/* ── Configuración ── */
export const CONFIG_SIMULACRO = {
  cantidadPreguntas: 40,
  tiempoLimiteMinutos: 40,
  puntajeAprobacion: 70,
  distribucionCategorias: {
    senales: 10, normas: 10, infracciones: 10, seguridad: 10,
  },
};

/* ── Función: selección aleatoria con distribución equilibrada ── */
export function obtenerPreguntasSimulacro() {
  const porCategoria = {};
  Object.keys(CONFIG_SIMULACRO.distribucionCategorias).forEach((cat) => {
    porCategoria[cat] = BANCO_PREGUNTAS
      .filter((p) => p.categoria === cat)
      .sort(() => Math.random() - 0.5);
  });

  const seleccionadas = [];
  Object.entries(CONFIG_SIMULACRO.distribucionCategorias).forEach(([cat, cantidad]) => {
    seleccionadas.push(...(porCategoria[cat] || []).slice(0, cantidad));
  });

  // Mezcla final para que las categorías no estén agrupadas
  return seleccionadas.sort(() => Math.random() - 0.5);
}
