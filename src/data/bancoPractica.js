/* ============================================================
   DrivePrep+ — Banco de Práctica por Temas
   Preguntas organizadas por categoría para práctica individual.
   Tipos mixtos: opcion_multiple · relacionar · clasificar · ordenar · completar
   TODO Fase backend: reemplazar por GET /api/practica/:categoriaId
   ============================================================ */

/* ── Configuración de categorías de práctica ── */
export const CATEGORIAS_PRACTICA = {
  senales_preventivas: {
    id:          'senales_preventivas',
    label:       'Señales preventivas',
    descripcion: 'Aprende el significado de las señales preventivas y cómo actuar ante ellas.',
    color:       '#f59e0b',
    colorFondo:  '#fef3c7',
    emoji:       '⚠️',
    icono:       'AlertTriangle',
    totalPreguntas: 10,
  },
  senales_reglamentarias: {
    id:          'senales_reglamentarias',
    label:       'Señales reglamentarias',
    descripcion: 'Conoce las prohibiciones y obligaciones que debes respetar como conductor.',
    color:       '#ef4444',
    colorFondo:  '#fee2e2',
    emoji:       '🛑',
    icono:       'OctagonX',
    totalPreguntas: 10,
  },
  senales_informativas: {
    id:          'senales_informativas',
    label:       'Señales informativas',
    descripcion: 'Identifica las señales que te guían hacia destinos, servicios y puntos de interés.',
    color:       '#3b82f6',
    colorFondo:  '#eff6ff',
    emoji:       'ℹ️',
    icono:       'Info',
    totalPreguntas: 10,
  },
  normas_transito: {
    id:          'normas_transito',
    label:       'Normas de tránsito',
    descripcion: 'Repasa las principales normas del Reglamento Nacional de Tránsito del MTC.',
    color:       '#6366f1',
    colorFondo:  '#eef2ff',
    emoji:       '📋',
    icono:       'BookOpen',
    totalPreguntas: 10,
  },
  infracciones: {
    id:          'infracciones',
    label:       'Infracciones y sanciones',
    descripcion: 'Conoce las infracciones más comunes y las sanciones que conllevan.',
    color:       '#ec4899',
    colorFondo:  '#fdf2f8',
    emoji:       '⚖️',
    icono:       'Gavel',
    totalPreguntas: 10,
  },
  primeros_auxilios: {
    id:          'primeros_auxilios',
    label:       'Primeros auxilios',
    descripcion: 'Aprende las técnicas básicas de primeros auxilios en emergencias de tránsito.',
    color:       '#10b981',
    colorFondo:  '#ecfdf5',
    emoji:       '🩺',
    icono:       'HeartPulse',
    totalPreguntas: 10,
  },
  mecanica_basica: {
    id:          'mecanica_basica',
    label:       'Mecánica básica',
    descripcion: 'Conceptos esenciales sobre el funcionamiento y mantenimiento del vehículo.',
    color:       '#64748b',
    colorFondo:  '#f1f5f9',
    emoji:       '🔧',
    icono:       'Wrench',
    totalPreguntas: 10,
  },
  seguridad_vial: {
    id:          'seguridad_vial',
    label:       'Seguridad vial',
    descripcion: 'Aprende buenas prácticas para una conducción segura y responsable.',
    color:       '#0ea5e9',
    colorFondo:  '#f0f9ff',
    emoji:       '🛡️',
    icono:       'Shield',
    totalPreguntas: 10,
  },
};

/* ══════════════════════════════════════════════════════════════
   BANCO DE PREGUNTAS POR TEMA
   Cada array tiene 10 preguntas mixtas por categoría.
   ══════════════════════════════════════════════════════════════ */

const PREGUNTAS_SENALES_PREVENTIVAS = [
  {
    id:'sp01', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Cuál es la forma característica de las señales preventivas en el Perú?',
    opciones:[
      {id:'a',texto:'Círculo con borde rojo'},
      {id:'b',texto:'Rombo (cuadrado girado 45°) con fondo amarillo'},
      {id:'c',texto:'Triángulo invertido con borde rojo'},
      {id:'d',texto:'Rectángulo con fondo verde'},
    ],
    correcta:'b',
    explicacion:'Las señales preventivas tienen forma de rombo (cuadrado a 45°) con fondo amarillo y símbolo negro. Su función es advertir peligros próximos en la vía.',
  },
  {
    id:'sp02', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'Al ver una señal preventiva de "CURVA PELIGROSA", el conductor debe:',
    opciones:[
      {id:'a',texto:'Detener completamente el vehículo'},
      {id:'b',texto:'Aumentar la velocidad para salir rápido de la curva'},
      {id:'c',texto:'Reducir la velocidad y manejar con mayor precaución'},
      {id:'d',texto:'Hacer sonar el claxon al entrar en la curva'},
    ],
    correcta:'c',
    explicacion:'Ante señales preventivas se debe reducir la velocidad y aumentar la atención. La curva peligrosa no exige detenerse, sino circular con mayor cuidado.',
  },
  {
    id:'sp03', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Qué indica una señal preventiva con el dibujo de dos niños caminando?',
    opciones:[
      {id:'a',texto:'Zona de juegos infantiles permitidos'},
      {id:'b',texto:'Proximidad de zona escolar; hay peligro de cruce de niños'},
      {id:'c',texto:'Prohibición de acceso a menores de edad'},
      {id:'d',texto:'Velocidad máxima de 60 km/h en esa área'},
    ],
    correcta:'b',
    explicacion:'Esta señal advierte que el conductor se acerca a una zona escolar donde es probable cruzar niños. Debe reducir la velocidad y extremar precauciones.',
  },
  {
    id:'sp04', tipo:'relacionar', dificultad:'media',
    enunciado:'Relaciona cada señal preventiva con la situación que advierte.',
    instruccion:'Selecciona un elemento de la izquierda y luego su par correcto en la derecha.',
    columnaIzq:[
      {id:'p1', texto:'⚠️ Señal de semáforo'},
      {id:'p2', texto:'⚠️ Señal de animal (vaca)'},
      {id:'p3', texto:'⚠️ Señal de cruce de peatones'},
      {id:'p4', texto:'⚠️ Señal de badén'},
    ],
    columnaDer:[
      {id:'d1', texto:'Hay un cruce peatonal adelante'},
      {id:'d2', texto:'Posible presencia de animales en la vía'},
      {id:'d3', texto:'Existe un semáforo próximo; prepárate a detenerte'},
      {id:'d4', texto:'Hay una irregularidad en el pavimento'},
    ],
    paresCorrectos:{ p1:'d3', p2:'d2', p3:'d1', p4:'d4' },
    explicacion:'Semáforo: prepárate a parar. Animal: ganado cruzando. Peatón: zona de cruce. Badén: irregularidad en la calzada.',
  },
  {
    id:'sp05', tipo:'clasificar', dificultad:'media',
    enunciado:'Clasifica cada situación: ¿requiere señal preventiva o señal reglamentaria?',
    instruccion:'Arrastra cada situación a la columna correcta.',
    categorias:[
      {id:'prev', label:'Señal preventiva', color:'#f59e0b'},
      {id:'regl', label:'Señal reglamentaria', color:'#ef4444'},
    ],
    items:[
      {id:'i1', texto:'Curva pronunciada más adelante',    emoji:'🔀'},
      {id:'i2', texto:'Velocidad máxima 60 km/h',          emoji:'60'},
      {id:'i3', texto:'Cruce de ferrocarril próximo',      emoji:'🚂'},
      {id:'i4', texto:'Prohibido adelantar',               emoji:'🚫'},
      {id:'i5', texto:'Zona escolar a 200 metros',         emoji:'🏫'},
      {id:'i6', texto:'Ceda el paso',                     emoji:'⬇️'},
    ],
    clasificacionCorrecta:{ i1:'prev', i2:'regl', i3:'prev', i4:'regl', i5:'prev', i6:'regl' },
    explicacion:'Preventivas: advierten peligros (curva, cruce de tren, zona escolar). Reglamentarias: imponen obligaciones (velocidad máx., no adelantar, ceder paso).',
  },
  {
    id:'sp06', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿A qué distancia aproximada se coloca una señal preventiva antes del peligro?',
    opciones:[
      {id:'a',texto:'Justo en el punto de peligro'},
      {id:'b',texto:'Entre 50 y 300 metros antes del peligro, según la velocidad de la vía'},
      {id:'c',texto:'500 metros antes siempre'},
      {id:'d',texto:'La distancia no importa, solo el símbolo'},
    ],
    correcta:'b',
    explicacion:'Las señales preventivas se colocan con suficiente anticipación para que el conductor pueda reaccionar. La distancia varía según la velocidad permitida en esa vía.',
  },
  {
    id:'sp07', tipo:'completar', dificultad:'media',
    enunciado:'Completa el texto sobre las señales preventivas.',
    instruccion:'Haz clic en una palabra del banco y luego en el espacio donde va.',
    textoConHuecos:'Las señales preventivas tienen forma de {{h1}} y fondo de color {{h2}}. Su función es {{h3}} al conductor sobre condiciones peligrosas. El conductor debe {{h4}} su velocidad al verlas.',
    palabrasDisponibles:['rombo','círculo','amarillo','rojo','advertir','informar','reducir','aumentar'],
    respuestasCorrectas:{ h1:'rombo', h2:'amarillo', h3:'advertir', h4:'reducir' },
    explicacion:'Rombo amarillo = señal preventiva. Advierten y obligan a reducir la velocidad.',
  },
  {
    id:'sp08', tipo:'opcion_multiple', dificultad:'dificil',
    enunciado:'¿Cuál de las siguientes NO es una señal preventiva?',
    opciones:[
      {id:'a',texto:'Señal de "Curva a la derecha"'},
      {id:'b',texto:'Señal de "Zona de neblina"'},
      {id:'c',texto:'Señal de "Velocidad máxima 80 km/h"'},
      {id:'d',texto:'Señal de "Cruce de ferrocarril"'},
    ],
    correcta:'c',
    explicacion:'"Velocidad máxima 80 km/h" es una señal reglamentaria (circular con borde rojo), porque impone una obligación. Las demás son preventivas porque advierten peligros.',
  },
  {
    id:'sp09', tipo:'ordenar', dificultad:'media',
    enunciado:'Ordena las acciones correctas al ver una señal preventiva de "PENDIENTE PRONUNCIADA".',
    instruccion:'Arrastra los pasos hasta ordenarlos correctamente.',
    items:[
      {id:'o1', texto:'Identificar la señal y comprender el peligro', emoji:'👁️'},
      {id:'o2', texto:'Reducir la velocidad antes de llegar a la pendiente', emoji:'🐢'},
      {id:'o3', texto:'Cambiar a una marcha más baja (si aplica)', emoji:'⚙️'},
      {id:'o4', texto:'Descender la pendiente sin presionar continuamente el freno', emoji:'🏔️'},
      {id:'o5', texto:'Retomar la velocidad normal al salir de la pendiente', emoji:'✅'},
    ],
    ordenCorrecto:['o1','o2','o3','o4','o5'],
    explicacion:'Al enfrentar una pendiente pronunciada: identificar, reducir velocidad, bajar marcha, descender con motor y retomar velocidad al terminar.',
  },
  {
    id:'sp10', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Qué señal preventiva advierte sobre la posible presencia de peatones cruzando?',
    opciones:[
      {id:'a',texto:'Una señal en forma de círculo azul con silueta de persona'},
      {id:'b',texto:'Una señal en forma de rombo amarillo con silueta de persona caminando'},
      {id:'c',texto:'Una señal rectangular verde con flecha'},
      {id:'d',texto:'Una señal octagonal roja'},
    ],
    correcta:'b',
    explicacion:'La señal preventiva de cruce peatonal tiene forma de rombo amarillo con la silueta de un peatón en negro. Advierte que hay un cruce de peatones próximo.',
  },
];

const PREGUNTAS_SENALES_REGLAMENTARIAS = [
  {
    id:'sr01', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Qué significa la señal "PARE" (octógono rojo)?',
    opciones:[
      {id:'a',texto:'Reducir la velocidad al 50%'},
      {id:'b',texto:'Detener completamente el vehículo y ceder el paso'},
      {id:'c',texto:'Parar solo si hay vehículos en la intersección'},
      {id:'d',texto:'Disminuir a 30 km/h y continuar'},
    ],
    correcta:'b',
    explicacion:'PARE exige detener completamente el vehículo antes de la línea de parada y ceder el paso a todos los usuarios, sin excepción.',
  },
  {
    id:'sr02', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Cuál es la forma de la señal "CEDA EL PASO"?',
    opciones:[
      {id:'a',texto:'Octógono rojo'},
      {id:'b',texto:'Rombo amarillo'},
      {id:'c',texto:'Triángulo invertido con borde rojo y fondo blanco'},
      {id:'d',texto:'Círculo azul con flecha blanca'},
    ],
    correcta:'c',
    explicacion:'CEDA EL PASO tiene forma triangular invertida (punta hacia abajo) con borde rojo y fondo blanco. Indica que se debe ceder el paso a los vehículos con prioridad.',
  },
  {
    id:'sr03', tipo:'relacionar', dificultad:'media',
    enunciado:'Relaciona cada señal reglamentaria con su significado.',
    instruccion:'Selecciona un elemento de la izquierda y luego su par correcto.',
    columnaIzq:[
      {id:'r1', texto:'🔴 Círculo rojo + línea diagonal'},
      {id:'r2', texto:'🔵 Círculo azul + flecha'},
      {id:'r3', texto:'🔴 Octógono rojo'},
      {id:'r4', texto:'⬇️ Triángulo invertido rojo'},
    ],
    columnaDer:[
      {id:'d1', texto:'Obligación de seguir esa dirección'},
      {id:'d2', texto:'Detención total obligatoria'},
      {id:'d3', texto:'Ceder el paso a otros vehículos'},
      {id:'d4', texto:'Prohibición de la acción indicada'},
    ],
    paresCorrectos:{ r1:'d4', r2:'d1', r3:'d2', r4:'d3' },
    explicacion:'Círculo rojo con diagonal = prohibición. Azul con flecha = obligación. Octógono = PARE. Triángulo invertido = ceder.',
  },
  {
    id:'sr04', tipo:'clasificar', dificultad:'media',
    enunciado:'Clasifica cada señal según si es de PROHIBICIÓN u OBLIGACIÓN.',
    instruccion:'Arrastra cada señal a su categoría.',
    categorias:[
      {id:'proh', label:'Prohibición',  color:'#ef4444'},
      {id:'obli', label:'Obligación',   color:'#3b82f6'},
    ],
    items:[
      {id:'s1', texto:'No girar a la derecha',    emoji:'🚫'},
      {id:'s2', texto:'Girar obligatoriamente',   emoji:'↪️'},
      {id:'s3', texto:'No adelantar',              emoji:'🚫'},
      {id:'s4', texto:'Circular solo buses',      emoji:'🚌'},
      {id:'s5', texto:'Prohibido estacionar',     emoji:'🅿️'},
      {id:'s6', texto:'Reducir velocidad oblig.', emoji:'⬇️'},
    ],
    clasificacionCorrecta:{ s1:'proh', s2:'obli', s3:'proh', s4:'obli', s5:'proh', s6:'obli' },
    explicacion:'Prohibición (fondo blanco, borde rojo): impide acciones. Obligación (fondo azul): ordena acciones específicas.',
  },
  {
    id:'sr05', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'Una señal circular con fondo azul y símbolo blanco indica:',
    opciones:[
      {id:'a',texto:'Una advertencia de peligro'},
      {id:'b',texto:'Información sobre un servicio cercano'},
      {id:'c',texto:'Una obligación que el conductor debe cumplir'},
      {id:'d',texto:'Una prohibición de tránsito'},
    ],
    correcta:'c',
    explicacion:'Los círculos azules con símbolo blanco son señales de obligación. El conductor DEBE realizar la acción indicada (girar, circular a cierta velocidad, etc.).',
  },
  {
    id:'sr06', tipo:'completar', dificultad:'media',
    enunciado:'Completa el texto sobre las señales reglamentarias.',
    instruccion:'Haz clic en una palabra del banco y luego en el espacio donde va.',
    textoConHuecos:'La señal de PARE tiene forma de {{h1}} y es de color {{h2}}. La señal de CEDA EL PASO tiene forma de triángulo {{h3}}. Las señales de prohibición tienen fondo {{h4}} con borde rojo.',
    palabrasDisponibles:['octógono','rombo','rojo','amarillo','invertido','normal','blanco','azul'],
    respuestasCorrectas:{ h1:'octógono', h2:'rojo', h3:'invertido', h4:'blanco' },
    explicacion:'PARE: octógono rojo. Ceda: triángulo invertido. Prohibición: fondo blanco con borde rojo.',
  },
  {
    id:'sr07', tipo:'opcion_multiple', dificultad:'dificil',
    enunciado:'¿Qué diferencia existe entre "PARE" y "CEDA EL PASO"?',
    opciones:[
      {id:'a',texto:'Son equivalentes; ambas obligan a detenerse siempre'},
      {id:'b',texto:'PARE obliga a detención total siempre; CEDA permite no detenerse si no hay tráfico'},
      {id:'c',texto:'CEDA es para vehículos pesados y PARE para autos'},
      {id:'d',texto:'PARE aplica de noche y CEDA de día'},
    ],
    correcta:'b',
    explicacion:'PARE = detención obligatoria total siempre, independientemente del tráfico. CEDA = reducir velocidad y ceder el paso; si no hay tráfico, se puede pasar sin detenerse.',
  },
  {
    id:'sr08', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Cuál es la consecuencia legal de no respetar una señal reglamentaria?',
    opciones:[
      {id:'a',texto:'No tiene consecuencias si no hay accidente'},
      {id:'b',texto:'Es una infracción sancionada con puntos de demérito y multa'},
      {id:'c',texto:'Solo se aplica una advertencia verbal'},
      {id:'d',texto:'La sanción depende del humor del agente de tránsito'},
    ],
    correcta:'b',
    explicacion:'Las señales reglamentarias son de cumplimiento obligatorio. Incumplirlas constituye una infracción sancionada con multa económica y puntos de demérito.',
  },
  {
    id:'sr09', tipo:'relacionar', dificultad:'dificil',
    enunciado:'Relaciona cada prohibición con su descripción visual en la señal.',
    instruccion:'Selecciona un elemento de la izquierda y luego su par correcto.',
    columnaIzq:[
      {id:'v1', texto:'No girar en U'},
      {id:'v2', texto:'No tocar bocina'},
      {id:'v3', texto:'No circulan peatones'},
      {id:'v4', texto:'No ingresar'},
    ],
    columnaDer:[
      {id:'e1', texto:'Círculo rojo con silueta de persona tachada'},
      {id:'e2', texto:'Círculo rojo con flecha en U tachada'},
      {id:'e3', texto:'Círculo rojo con bocina tachada'},
      {id:'e4', texto:'Círculo rojo con barra horizontal blanca'},
    ],
    paresCorrectos:{ v1:'e2', v2:'e3', v3:'e1', v4:'e4' },
    explicacion:'Todas son señales circulares con borde rojo, pero el símbolo interior indica la prohibición específica.',
  },
  {
    id:'sr10', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Qué indica una señal circular con fondo blanco, borde rojo y una barra roja horizontal en el centro?',
    opciones:[
      {id:'a',texto:'Velocidad máxima en esa zona'},
      {id:'b',texto:'Prohibido el ingreso (calle en contravía)'},
      {id:'c',texto:'Solo buses permitidos'},
      {id:'d',texto:'Fin de zona de velocidad reducida'},
    ],
    correcta:'b',
    explicacion:'Esta señal indica "Prohibido el ingreso". Usualmente se coloca al inicio de vías de sentido único para indicar que no se puede ingresar por ese lado.',
  },
];

const PREGUNTAS_SENALES_INFORMATIVAS = [
  {
    id:'si01', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Cuál es el color de fondo de las señales informativas de destino en carreteras peruanas?',
    opciones:[
      {id:'a',texto:'Amarillo'},
      {id:'b',texto:'Azul'},
      {id:'c',texto:'Verde'},
      {id:'d',texto:'Marrón'},
    ],
    correcta:'c',
    explicacion:'Las señales informativas de destino tienen fondo verde con letras y bordes blancos en carreteras. El azul se usa para servicios y el marrón para sitios turísticos.',
  },
  {
    id:'si02', tipo:'relacionar', dificultad:'media',
    enunciado:'Relaciona cada color de señal informativa con su uso.',
    instruccion:'Selecciona un elemento de la izquierda y luego su par correcto.',
    columnaIzq:[
      {id:'c1', texto:'🟢 Fondo verde'},
      {id:'c2', texto:'🔵 Fondo azul'},
      {id:'c3', texto:'🟤 Fondo marrón'},
      {id:'c4', texto:'⬜ Fondo blanco'},
    ],
    columnaDer:[
      {id:'u1', texto:'Servicios (gasolinera, hospital, teléfono)'},
      {id:'u2', texto:'Sitios turísticos y culturales'},
      {id:'u3', texto:'Información urbana y de tránsito local'},
      {id:'u4', texto:'Destinos en carreteras (rutas y distancias)'},
    ],
    paresCorrectos:{ c1:'u4', c2:'u1', c3:'u2', c4:'u3' },
    explicacion:'Verde = destino de carretera. Azul = servicios. Marrón = turismo y cultura. Blanco = información urbana.',
  },
  {
    id:'si03', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Qué tipo de información brindan las señales informativas?',
    opciones:[
      {id:'a',texto:'Prohíben ciertas maniobras al conductor'},
      {id:'b',texto:'Advierten sobre condiciones peligrosas de la vía'},
      {id:'c',texto:'Guían sobre rutas, destinos, servicios y puntos de interés'},
      {id:'d',texto:'Indican el límite de velocidad máxima'},
    ],
    correcta:'c',
    explicacion:'Las señales informativas tienen como función orientar y guiar al usuario: rutas, distancias, destinos, servicios (gasolineras, hospitales) y lugares de interés.',
  },
  {
    id:'si04', tipo:'clasificar', dificultad:'media',
    enunciado:'Clasifica cada señal según si es informativa de DESTINO o de SERVICIOS.',
    instruccion:'Arrastra cada señal a la columna correcta.',
    categorias:[
      {id:'dest', label:'Destino / ruta',  color:'#16a34a'},
      {id:'serv', label:'Servicios',        color:'#2563eb'},
    ],
    items:[
      {id:'n1', texto:'Lima → 120 km',        emoji:'🗺️'},
      {id:'n2', texto:'Hospital próximo',      emoji:'🏥'},
      {id:'n3', texto:'Ruta Nacional 1S',      emoji:'🛣️'},
      {id:'n4', texto:'Gasolinera a 2 km',     emoji:'⛽'},
      {id:'n5', texto:'Desvío a Cusco',        emoji:'↪️'},
      {id:'n6', texto:'Estacionamiento',       emoji:'🅿️'},
    ],
    clasificacionCorrecta:{ n1:'dest', n2:'serv', n3:'dest', n4:'serv', n5:'dest', n6:'serv' },
    explicacion:'Destino: indican rutas, distancias y desvíos. Servicios: señalan gasolineras, hospitales, estacionamientos y otros servicios al usuario.',
  },
  {
    id:'si05', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'Una señal de fondo marrón con un símbolo de monumento indica:',
    opciones:[
      {id:'a',texto:'Una zona de construcción'},
      {id:'b',texto:'Un sitio de interés turístico o cultural'},
      {id:'c',texto:'Una zona arqueológica prohibida'},
      {id:'d',texto:'Un museo solo para vehículos oficiales'},
    ],
    correcta:'b',
    explicacion:'Las señales de fondo marrón se usan para señalizar sitios turísticos, culturales, históricos y naturales. Son señales informativas turísticas según el RNT.',
  },
  {
    id:'si06', tipo:'completar', dificultad:'media',
    enunciado:'Completa el texto sobre los colores de las señales informativas.',
    instruccion:'Haz clic en una palabra del banco y luego en el espacio donde va.',
    textoConHuecos:'Las señales de destino en carreteras tienen fondo {{h1}}. Los servicios al usuario (gasolineras, hospitales) se señalizan con fondo {{h2}}. Los sitios turísticos usan fondo {{h3}}. La información urbana local usa fondo {{h4}}.',
    palabrasDisponibles:['verde','azul','marrón','blanco','rojo','amarillo'],
    respuestasCorrectas:{ h1:'verde', h2:'azul', h3:'marrón', h4:'blanco' },
    explicacion:'Verde=carretera/destino, Azul=servicios, Marrón=turismo, Blanco=información urbana.',
  },
  {
    id:'si07', tipo:'opcion_multiple', dificultad:'dificil',
    enunciado:'¿Qué indica una señal de "DELINEADOR DE CURVA" (postes con franjas reflectivas)?',
    opciones:[
      {id:'a',texto:'Zona de descanso próxima'},
      {id:'b',texto:'Delimitan el borde de la vía y orientan visualmente en curvas'},
      {id:'c',texto:'Inicio de una zona urbana'},
      {id:'d',texto:'Distancia al próximo peaje'},
    ],
    correcta:'b',
    explicacion:'Los delineadores de curva son dispositivos informativos que marcan el borde de la calzada y guían visualmente al conductor en curvas, especialmente de noche.',
  },
  {
    id:'si08', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Qué señal indica el número de una ruta nacional en el Perú?',
    opciones:[
      {id:'a',texto:'Una señal circular roja'},
      {id:'b',texto:'Una señal con el escudo nacional y el número de la ruta'},
      {id:'c',texto:'Una señal triangular amarilla con número'},
      {id:'d',texto:'Una señal cuadrada verde con código de ruta'},
    ],
    correcta:'b',
    explicacion:'En el Perú, las rutas nacionales se identifican con señales especiales que incluyen el escudo nacional y el número de la ruta (ej. Ruta 1S = Panamericana Sur).',
  },
  {
    id:'si09', tipo:'relacionar', dificultad:'dificil',
    enunciado:'Relaciona cada símbolo informativo con el servicio que representa.',
    instruccion:'Selecciona un elemento de la izquierda y luego su par correcto.',
    columnaIzq:[
      {id:'sym1', texto:'🔵 Cruz roja'},
      {id:'sym2', texto:'🔵 Bombas de combustible'},
      {id:'sym3', texto:'🔵 Tenedor y cuchillo'},
      {id:'sym4', texto:'🔵 Cama (H mayúscula)'},
    ],
    columnaDer:[
      {id:'sv1', texto:'Restaurante o comedor'},
      {id:'sv2', texto:'Hospital o clínica'},
      {id:'sv3', texto:'Hotel u hospedaje'},
      {id:'sv4', texto:'Grifo o estación de combustible'},
    ],
    paresCorrectos:{ sym1:'sv2', sym2:'sv4', sym3:'sv1', sym4:'sv3' },
    explicacion:'Las señales de servicios usan símbolos internacionales reconocibles: cruz=salud, bomba=combustible, cubiertos=comida, cama=alojamiento.',
  },
  {
    id:'si10', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Cuál es la diferencia entre señales informativas "de servicio" y "de destino"?',
    opciones:[
      {id:'a',texto:'Solo el color las diferencia, su función es igual'},
      {id:'b',texto:'Las de servicio indican dónde obtener asistencia; las de destino indican rutas y direcciones'},
      {id:'c',texto:'Las de destino son solo para vehículos pesados'},
      {id:'d',texto:'No existen señales de servicio en el Perú'},
    ],
    correcta:'b',
    explicacion:'Señales de servicio (azul): indican gasolineras, hospitales, restaurantes, etc. Señales de destino (verde): muestran rutas, distancias y destinos geográficos.',
  },
];

const PREGUNTAS_NORMAS_TRANSITO = [
  {
    id:'nt01', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Cuál es la velocidad máxima permitida en zonas urbanas en Perú, salvo señal en contrario?',
    opciones:[
      {id:'a',texto:'40 km/h'},
      {id:'b',texto:'50 km/h'},
      {id:'c',texto:'60 km/h'},
      {id:'d',texto:'80 km/h'},
    ],
    correcta:'c',
    explicacion:'El Reglamento Nacional de Tránsito establece 60 km/h como velocidad máxima en zonas urbanas, salvo señalización específica que indique un límite diferente.',
  },
  {
    id:'nt02', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'En una intersección sin señalización, ¿quién tiene prioridad de paso entre dos vehículos?',
    opciones:[
      {id:'a',texto:'El vehículo más grande'},
      {id:'b',texto:'El que llegó primero'},
      {id:'c',texto:'El vehículo que viene por la derecha del otro'},
      {id:'d',texto:'El más rápido'},
    ],
    correcta:'c',
    explicacion:'En intersecciones sin señalización, entre vehículos que llegan al mismo tiempo, tiene prioridad el que viene por la derecha del otro conductor.',
  },
  {
    id:'nt03', tipo:'relacionar', dificultad:'media',
    enunciado:'Relaciona cada situación de tránsito con la norma aplicable.',
    instruccion:'Selecciona un elemento de la izquierda y luego su par correcto.',
    columnaIzq:[
      {id:'sit1', texto:'Zona escolar activa'},
      {id:'sit2', texto:'Carretera nacional (automóvil)'},
      {id:'sit3', texto:'Zona urbana sin señal'},
      {id:'sit4', texto:'Zona residencial'},
    ],
    columnaDer:[
      {id:'nor1', texto:'Máximo 30 km/h'},
      {id:'nor2', texto:'Máximo 60 km/h'},
      {id:'nor3', texto:'Máximo 100 km/h'},
      {id:'nor4', texto:'Máximo 30 km/h con especial atención a peatones'},
    ],
    paresCorrectos:{ sit1:'nor4', sit2:'nor3', sit3:'nor2', sit4:'nor1' },
    explicacion:'Zona escolar: 30 km/h con máxima atención. Carretera: 100 km/h (autos). Urbana: 60 km/h. Residencial: 30 km/h.',
  },
  {
    id:'nt04', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Es obligatorio el uso del cinturón de seguridad en el asiento trasero?',
    opciones:[
      {id:'a',texto:'No, solo en los asientos delanteros'},
      {id:'b',texto:'Solo en autopistas y carreteras'},
      {id:'c',texto:'Sí, es obligatorio para todos los ocupantes del vehículo'},
      {id:'d',texto:'Solo si el vehículo tiene más de 5 años de antigüedad'},
    ],
    correcta:'c',
    explicacion:'El cinturón de seguridad es obligatorio para TODOS los ocupantes del vehículo, incluidos los asientos traseros, en todo tipo de vía y en todo momento.',
  },
  {
    id:'nt05', tipo:'ordenar', dificultad:'media',
    enunciado:'Ordena los pasos correctos para realizar un adelantamiento seguro en carretera.',
    instruccion:'Arrastra los pasos hasta ordenarlos correctamente.',
    items:[
      {id:'ad1', texto:'Verificar que el carril contrario está libre', emoji:'👁️'},
      {id:'ad2', texto:'Activar el indicador de giro izquierdo', emoji:'↰'},
      {id:'ad3', texto:'Acelerar y adelantar con rapidez', emoji:'🚀'},
      {id:'ad4', texto:'Volver al carril derecho una vez adelantado', emoji:'↱'},
      {id:'ad5', texto:'Apagar el indicador de giro', emoji:'💡'},
    ],
    ordenCorrecto:['ad2','ad1','ad3','ad4','ad5'],
    explicacion:'Siempre señalizar primero, luego verificar, adelantar rápido (no quedarse al lado), volver al carril y desactivar la señal.',
  },
  {
    id:'nt06', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Cuándo se deben encender las luces del vehículo obligatoriamente?',
    opciones:[
      {id:'a',texto:'Solo de noche'},
      {id:'b',texto:'Solo en túneles'},
      {id:'c',texto:'De noche, en baja visibilidad (neblina, lluvia) y en túneles'},
      {id:'d',texto:'Solo en carreteras, nunca en ciudad'},
    ],
    correcta:'c',
    explicacion:'Las luces son obligatorias en tres situaciones: de noche, cuando la visibilidad es reducida (niebla, lluvia intensa) y al transitar por túneles.',
  },
  {
    id:'nt07', tipo:'clasificar', dificultad:'media',
    enunciado:'Clasifica cada norma: ¿corresponde al conductor o al peatón?',
    instruccion:'Arrastra cada norma a la columna correcta.',
    categorias:[
      {id:'cond', label:'Deber del conductor', color:'#6366f1'},
      {id:'peat', label:'Deber del peatón',    color:'#10b981'},
    ],
    items:[
      {id:'d1', texto:'Respetar los semáforos peatonales',   emoji:'🚶'},
      {id:'d2', texto:'Ceder el paso en cruces de cebra',    emoji:'🚗'},
      {id:'d3', texto:'Cruzar solo por pasos autorizados',   emoji:'🚶'},
      {id:'d4', texto:'No usar el celular mientras conduce', emoji:'🚗'},
      {id:'d5', texto:'Circular por las veredas',            emoji:'🚶'},
      {id:'d6', texto:'Respetar la señal de PARE',           emoji:'🚗'},
    ],
    clasificacionCorrecta:{ d1:'peat', d2:'cond', d3:'peat', d4:'cond', d5:'peat', d6:'cond' },
    explicacion:'El conductor cede el paso, no usa celular y respeta señales. El peatón usa semáforos peatonales, cruces autorizados y veredas.',
  },
  {
    id:'nt08', tipo:'completar', dificultad:'media',
    enunciado:'Completa las normas de velocidad del RNT.',
    instruccion:'Haz clic en una palabra del banco y luego en el espacio donde va.',
    textoConHuecos:'En zona urbana la velocidad máxima es {{h1}} km/h. En carreteras nacionales para autos es {{h2}} km/h. En zonas escolares se reduce a {{h3}} km/h. La distancia de seguridad se calcula con la regla de los {{h4}} segundos.',
    palabrasDisponibles:['60','100','30','2','5','80','50','120'],
    respuestasCorrectas:{ h1:'60', h2:'100', h3:'30', h4:'2' },
    explicacion:'60 km/h urbano, 100 km/h carretera, 30 km/h zona escolar, regla de los 2 segundos para distancia de seguridad.',
  },
  {
    id:'nt09', tipo:'opcion_multiple', dificultad:'dificil',
    enunciado:'¿En qué carril debe circular preferentemente un vehículo en una vía de tres carriles en el mismo sentido?',
    opciones:[
      {id:'a',texto:'En el izquierdo para mayor velocidad'},
      {id:'b',texto:'En el central siempre'},
      {id:'c',texto:'En el derecho, salvo para adelantar o girar'},
      {id:'d',texto:'En cualquiera según conveniencia'},
    ],
    correcta:'c',
    explicacion:'El carril derecho es de circulación normal. Los carriles central e izquierdo se usan para adelantar o girar y deben desocuparse una vez completada la maniobra.',
  },
  {
    id:'nt10', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Qué debe hacer el conductor al aproximarse a un cruce de ferrocarril sin barreras?',
    opciones:[
      {id:'a',texto:'Continuar si no ve ningún tren'},
      {id:'b',texto:'Reducir velocidad, mirar en ambas direcciones y cruzar con precaución'},
      {id:'c',texto:'Detener completamente, verificar y cruzar con precaución'},
      {id:'d',texto:'Tocar el claxon y acelerar'},
    ],
    correcta:'c',
    explicacion:'En cruces de ferrocarril sin barreras es obligatorio detenerse completamente, asegurarse que no viene ningún tren en ambas direcciones, y entonces cruzar.',
  },
];

const PREGUNTAS_INFRACCIONES = [
  {
    id:'inf01', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Cuál de las siguientes es una infracción MUY GRAVE según el RNT peruano?',
    opciones:[
      {id:'a',texto:'Estacionar en zona amarilla'},
      {id:'b',texto:'Conducir bajo la influencia del alcohol'},
      {id:'c',texto:'Circular sin cinturón de seguridad'},
      {id:'d',texto:'Exceder el límite en 5 km/h'},
    ],
    correcta:'b',
    explicacion:'Conducir bajo efectos del alcohol es infracción MUY GRAVE. Puede resultar en cancelación de licencia, multa elevada y responsabilidad penal.',
  },
  {
    id:'inf02', tipo:'relacionar', dificultad:'dificil',
    enunciado:'Relaciona cada infracción con su nivel de gravedad.',
    instruccion:'Selecciona un elemento de la izquierda y luego su par correcto.',
    columnaIzq:[
      {id:'g1', texto:'Conducir con alcohol en sangre'},
      {id:'g2', texto:'No usar cinturón de seguridad'},
      {id:'g3', texto:'Fuga del lugar del accidente'},
      {id:'g4', texto:'Estacionar en zona prohibida'},
    ],
    columnaDer:[
      {id:'niv1', texto:'Infracción leve (5 puntos)'},
      {id:'niv2', texto:'Infracción grave (12 puntos)'},
      {id:'niv3', texto:'Infracción muy grave (20 puntos)'},
      {id:'niv4', texto:'Infracción gravísima (cancelación)'},
    ],
    paresCorrectos:{ g1:'niv3', g2:'niv2', g3:'niv4', g4:'niv1' },
    explicacion:'Alcohol: muy grave (20 pts). Sin cinturón: grave (12 pts). Fuga de accidente: gravísima (cancelación). Mal estacionamiento: leve (5 pts).',
  },
  {
    id:'inf03', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Cuál es el límite de alcoholemia para conductores particulares en Perú?',
    opciones:[
      {id:'a',texto:'0.25 g/l de sangre'},
      {id:'b',texto:'0.5 g/l de sangre'},
      {id:'c',texto:'1.0 g/l de sangre'},
      {id:'d',texto:'0.0 g/l (tolerancia cero)'},
    ],
    correcta:'b',
    explicacion:'Para conductores particulares el límite es 0.5 g/l de sangre. Para conductores de transporte público y de carga el límite es 0.0 g/l (tolerancia cero).',
  },
  {
    id:'inf04', tipo:'clasificar', dificultad:'media',
    enunciado:'Clasifica cada conducta como infracción o comportamiento correcto.',
    instruccion:'Arrastra cada elemento a la columna correspondiente.',
    categorias:[
      {id:'bien', label:'Correcto ✅',   color:'#10b981'},
      {id:'mal',  label:'Infracción ❌', color:'#ef4444'},
    ],
    items:[
      {id:'c1', texto:'Usar el celular al manejar',          emoji:'📱'},
      {id:'c2', texto:'Respetar la señal de PARE',           emoji:'✅'},
      {id:'c3', texto:'Adelantar en curva cerrada',          emoji:'🚗'},
      {id:'c4', texto:'Mantener distancia de seguridad',     emoji:'↔️'},
      {id:'c5', texto:'Conducir sin licencia vigente',       emoji:'🚫'},
      {id:'c6', texto:'Encender luces en túnel',             emoji:'💡'},
    ],
    clasificacionCorrecta:{ c1:'mal', c2:'bien', c3:'mal', c4:'bien', c5:'mal', c6:'bien' },
    explicacion:'Correcto: respetar señales, distancia de seguridad, luces en túnel. Infracciones: celular al manejar, adelantar en curva, conducir sin licencia.',
  },
  {
    id:'inf05', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Qué ocurre al acumular el máximo de puntos de demérito en Perú?',
    opciones:[
      {id:'a',texto:'Se recibe solo una amonestación escrita'},
      {id:'b',texto:'Se paga una multa y se continúa conduciendo'},
      {id:'c',texto:'La licencia es cancelada definitivamente'},
      {id:'d',texto:'La licencia se suspende por 60 días'},
    ],
    correcta:'c',
    explicacion:'Al acumular 100 puntos de demérito (el máximo), la licencia de conducir es cancelada definitivamente. El conductor deberá obtener una nueva licencia.',
  },
  {
    id:'inf06', tipo:'completar', dificultad:'dificil',
    enunciado:'Completa el texto sobre el sistema de sanciones de tránsito en Perú.',
    instruccion:'Haz clic en una palabra del banco y luego en el espacio donde va.',
    textoConHuecos:'El máximo de puntos de demérito es {{h1}}. Al alcanzarlos la licencia es {{h2}}. El límite de alcohol para conductores particulares es {{h3}} g/l. Las infracciones graves acumulan más de {{h4}} puntos.',
    palabrasDisponibles:['100','50','cancelada','suspendida','0.5','1.0','10','5'],
    respuestasCorrectas:{ h1:'100', h2:'cancelada', h3:'0.5', h4:'10' },
    explicacion:'100 puntos = cancelación. Alcohol: 0.5 g/l. Infracciones graves: más de 10 puntos de demérito.',
  },
  {
    id:'inf07', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Qué documentos debe portar obligatoriamente el conductor de un vehículo particular?',
    opciones:[
      {id:'a',texto:'Solo la licencia de conducir'},
      {id:'b',texto:'Licencia, tarjeta de propiedad, SOAT vigente y revisión técnica'},
      {id:'c',texto:'Solo el DNI y el SOAT'},
      {id:'d',texto:'Solo la tarjeta de propiedad y la licencia'},
    ],
    correcta:'b',
    explicacion:'Es obligatorio portar: (1) Licencia de conducir vigente, (2) Tarjeta de propiedad del vehículo, (3) SOAT vigente, y (4) Certificado de revisión técnica cuando corresponda.',
  },
  {
    id:'inf08', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Qué implica la infracción de "omisión de socorro"?',
    opciones:[
      {id:'a',texto:'No prestar auxilio a una víctima de accidente pudiendo hacerlo'},
      {id:'b',texto:'No tener botiquín de primeros auxilios en el vehículo'},
      {id:'c',texto:'No llamar a los bomberos inmediatamente'},
      {id:'d',texto:'No llevar al herido al hospital personalmente'},
    ],
    correcta:'a',
    explicacion:'La omisión de socorro es un delito penal: no prestar ayuda a una víctima de accidente cuando se está en condición de hacerlo sin riesgo propio.',
  },
  {
    id:'inf09', tipo:'ordenar', dificultad:'dificil',
    enunciado:'Ordena los pasos del proceso sancionador cuando el conductor comete una infracción.',
    instruccion:'Arrastra los pasos hasta ordenarlos correctamente.',
    items:[
      {id:'s1', texto:'El agente de tránsito detecta la infracción', emoji:'👮'},
      {id:'s2', texto:'Se emite la papeleta de infracción', emoji:'📄'},
      {id:'s3', texto:'El conductor puede impugnar o pagar la multa', emoji:'⚖️'},
      {id:'s4', texto:'Se registran los puntos de demérito en el sistema', emoji:'💻'},
      {id:'s5', texto:'Si acumula el máximo, se cancela la licencia', emoji:'🚫'},
    ],
    ordenCorrecto:['s1','s2','s3','s4','s5'],
    explicacion:'El proceso es: detección → papeleta → pago o impugnación → registro de puntos → cancelación si se llega al máximo.',
  },
  {
    id:'inf10', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Cuál es la consecuencia inmediata de circular sin SOAT vigente en Perú?',
    opciones:[
      {id:'a',texto:'Solo una advertencia verbal del agente'},
      {id:'b',texto:'Multa económica y posible retención del vehículo'},
      {id:'c',texto:'Suspensión de la licencia por 15 días'},
      {id:'d',texto:'Ninguna consecuencia si no hay accidente'},
    ],
    correcta:'b',
    explicacion:'Circular sin SOAT es una infracción que resulta en multa económica y puede derivar en retención del vehículo hasta que el propietario regularice la documentación.',
  },
];

const PREGUNTAS_PRIMEROS_AUXILIOS = [
  {
    id:'pa01', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Cuál es el PRIMER paso al llegar a la escena de un accidente de tránsito?',
    opciones:[
      {id:'a',texto:'Mover a los heridos a un lugar seguro'},
      {id:'b',texto:'Asegurar la escena, protegerse y llamar al 911'},
      {id:'c',texto:'Iniciar reanimación a todos los heridos'},
      {id:'d',texto:'Administrar medicamentos de emergencia'},
    ],
    correcta:'b',
    explicacion:'Lo primero es asegurar la escena para evitar nuevos accidentes, protegerse a uno mismo y llamar al 911. Sin escena segura, puedes convertirte en otra víctima.',
  },
  {
    id:'pa02', tipo:'ordenar', dificultad:'media',
    enunciado:'Ordena los pasos correctos al llegar a un accidente de tránsito con víctimas.',
    instruccion:'Arrastra los pasos hasta ordenarlos correctamente.',
    items:[
      {id:'p1', texto:'Asegurar la escena y señalizar el área', emoji:'🚧'},
      {id:'p2', texto:'Llamar al 911 (emergencias)', emoji:'📞'},
      {id:'p3', texto:'Evaluar el estado de las víctimas sin moverlas', emoji:'🔍'},
      {id:'p4', texto:'Aplicar primeros auxilios básicos', emoji:'🩺'},
      {id:'p5', texto:'Dar información a los servicios de emergencia al llegar', emoji:'📋'},
    ],
    ordenCorrecto:['p1','p2','p3','p4','p5'],
    explicacion:'Asegurar → llamar → evaluar → actuar → informar. Nunca mover a una víctima sin evaluar primero posibles lesiones de columna.',
  },
  {
    id:'pa03', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Cuándo NO se debe mover a una víctima de accidente de tránsito?',
    opciones:[
      {id:'a',texto:'Cuando la víctima esté consciente'},
      {id:'b',texto:'Siempre se debe mover para atenderla mejor'},
      {id:'c',texto:'Cuando se sospecha lesión de columna, salvo peligro inminente'},
      {id:'d',texto:'Cuando ya pasaron 10 minutos del accidente'},
    ],
    correcta:'c',
    explicacion:'Si hay sospecha de lesión cervical o espinal, NO mover a la víctima. Un movimiento incorrecto puede causar parálisis permanente. Solo se mueve ante peligro de vida inmediato (incendio, inmersión).',
  },
  {
    id:'pa04', tipo:'relacionar', dificultad:'media',
    enunciado:'Relaciona cada situación de emergencia con la acción de primeros auxilios correcta.',
    instruccion:'Selecciona un elemento de la izquierda y luego su par correcto.',
    columnaIzq:[
      {id:'em1', texto:'Víctima inconsciente que respira'},
      {id:'em2', texto:'Hemorragia externa abundante'},
      {id:'em3', texto:'Víctima sin pulso ni respiración'},
      {id:'em4', texto:'Sospecha de fractura en pierna'},
    ],
    columnaDer:[
      {id:'acc1', texto:'Iniciar RCP (30 compresiones + 2 respiraciones)'},
      {id:'acc2', texto:'Inmovilizar sin mover y esperar ayuda'},
      {id:'acc3', texto:'Colocar en posición lateral de seguridad'},
      {id:'acc4', texto:'Aplicar presión directa con paño limpio'},
    ],
    paresCorrectos:{ em1:'acc3', em2:'acc4', em3:'acc1', em4:'acc2' },
    explicacion:'Inconsciente respira: posición lateral. Hemorragia: presión directa. Sin pulso: RCP. Fractura: inmovilizar.',
  },
  {
    id:'pa05', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Cuál es la frecuencia correcta de compresiones en la RCP para adultos?',
    opciones:[
      {id:'a',texto:'15 compresiones × 2 respiraciones'},
      {id:'b',texto:'30 compresiones × 2 respiraciones a 100-120/min'},
      {id:'c',texto:'20 compresiones continuas sin respiraciones'},
      {id:'d',texto:'10 compresiones × 1 respiración'},
    ],
    correcta:'b',
    explicacion:'El protocolo estándar de RCP para adultos: 30 compresiones torácicas seguidas de 2 respiraciones de rescate, a una frecuencia de 100-120 compresiones por minuto.',
  },
  {
    id:'pa06', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Cómo se controla correctamente una hemorragia externa grave?',
    opciones:[
      {id:'a',texto:'Aplicar hielo directamente sobre la herida'},
      {id:'b',texto:'Lavar con agua y dejar la herida expuesta al aire'},
      {id:'c',texto:'Aplicar presión directa y sostenida con un paño limpio'},
      {id:'d',texto:'Colocar un torniquete en todos los casos'},
    ],
    correcta:'c',
    explicacion:'La presión directa y sostenida con un paño limpio (o vendaje estéril si está disponible) es el método principal para controlar hemorragias externas.',
  },
  {
    id:'pa07', tipo:'completar', dificultad:'media',
    enunciado:'Completa el protocolo básico de atención a víctimas de accidente.',
    instruccion:'Haz clic en una palabra del banco y luego en el espacio donde va.',
    textoConHuecos:'Al llegar a un accidente, primero {{h1}} la escena. A una víctima inconsciente que respira se le coloca en posición {{h2}}. Para controlar hemorragias se aplica {{h3}} directa. El número de emergencias es el {{h4}}.',
    palabrasDisponibles:['asegurar','abandonar','lateral','boca arriba','presión','hielo','911','105'],
    respuestasCorrectas:{ h1:'asegurar', h2:'lateral', h3:'presión', h4:'911' },
    explicacion:'Asegurar la escena, posición lateral para inconscientes que respiran, presión directa para hemorragias, número de emergencias: 911.',
  },
  {
    id:'pa08', tipo:'opcion_multiple', dificultad:'dificil',
    enunciado:'¿Qué posición se debe usar para una víctima inconsciente que respira normalmente?',
    opciones:[
      {id:'a',texto:'Boca arriba con piernas elevadas'},
      {id:'b',texto:'Posición lateral de seguridad (decúbito lateral)'},
      {id:'c',texto:'Sentada con la cabeza entre las rodillas'},
      {id:'d',texto:'Boca abajo con la cabeza girada'},
    ],
    correcta:'b',
    explicacion:'La Posición Lateral de Seguridad (PLS) protege la vía aérea de una persona inconsciente que respira, evitando que se ahogue con vómito o secreciones.',
  },
  {
    id:'pa09', tipo:'clasificar', dificultad:'media',
    enunciado:'Clasifica cada acción: ¿es correcta o incorrecta en primeros auxilios?',
    instruccion:'Arrastra cada acción a la columna correspondiente.',
    categorias:[
      {id:'ok',  label:'Correcto ✅',    color:'#10b981'},
      {id:'mal', label:'Incorrecto ❌',  color:'#ef4444'},
    ],
    items:[
      {id:'a1', texto:'Asegurar la escena antes de acercarse', emoji:'🚧'},
      {id:'a2', texto:'Mover al herido si sospecha fractura',  emoji:'🦴'},
      {id:'a3', texto:'Llamar al 911 de inmediato',            emoji:'📞'},
      {id:'a4', texto:'Dar de beber a un accidentado inconsciente', emoji:'💧'},
      {id:'a5', texto:'Aplicar presión directa en hemorragia', emoji:'🩹'},
      {id:'a6', texto:'Retirar el casco a un motociclista accidentado solo', emoji:'⛑️'},
    ],
    clasificacionCorrecta:{ a1:'ok', a2:'mal', a3:'ok', a4:'mal', a5:'ok', a6:'mal' },
    explicacion:'Correcto: asegurar escena, llamar al 911, presión en hemorragia. Incorrecto: mover fracturas, dar líquidos a inconscientes, quitar casco sin ayuda.',
  },
  {
    id:'pa10', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Cuál es el número de emergencias para llamar al sistema de ayuda en Perú?',
    opciones:[
      {id:'a',texto:'105'},
      {id:'b',texto:'116'},
      {id:'c',texto:'911'},
      {id:'d',texto:'119'},
    ],
    correcta:'c',
    explicacion:'El número único de emergencias en Perú es el 911. Atiende Policía Nacional, bomberos y servicios médicos de emergencia de manera integrada.',
  },
];

const PREGUNTAS_MECANICA = [
  {
    id:'mb01', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Con qué frecuencia se recomienda revisar el nivel de aceite del motor?',
    opciones:[
      {id:'a',texto:'Una vez al año'},
      {id:'b',texto:'Solo cuando se enciende la luz de advertencia'},
      {id:'c',texto:'Mensualmente o antes de viajes largos'},
      {id:'d',texto:'Cada 10,000 km únicamente'},
    ],
    correcta:'c',
    explicacion:'Se recomienda revisar el nivel de aceite mensualmente o antes de viajes largos. Un nivel bajo puede causar daño grave al motor.',
  },
  {
    id:'mb02', tipo:'relacionar', dificultad:'media',
    enunciado:'Relaciona cada luz indicadora del tablero con su significado.',
    instruccion:'Selecciona un elemento de la izquierda y luego su par correcto.',
    columnaIzq:[
      {id:'l1', texto:'🔴 Aceite (lata con gota)'},
      {id:'l2', texto:'🔴 Batería'},
      {id:'l3', texto:'🟡 Check Engine (motor)'},
      {id:'l4', texto:'🔴 Temperatura (termómetro)'},
    ],
    columnaDer:[
      {id:'sig1', texto:'El sistema de carga eléctrica está fallando'},
      {id:'sig2', texto:'El motor está sobrecalentándose; detenerse'},
      {id:'sig3', texto:'La presión de aceite es insuficiente; parar de inmediato'},
      {id:'sig4', texto:'El sistema detectó una falla; llevar al mecánico'},
    ],
    paresCorrectos:{ l1:'sig3', l2:'sig1', l3:'sig4', l4:'sig2' },
    explicacion:'Aceite: falta presión (muy urgente). Batería: sistema de carga falla. Check Engine: falla detectada. Temperatura: motor caliente (parar inmediatamente).',
  },
  {
    id:'mb03', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Qué debe hacerse si los frenos fallan mientras el vehículo está en movimiento?',
    opciones:[
      {id:'a',texto:'Apagar el motor de inmediato'},
      {id:'b',texto:'Usar el freno de mano gradualmente, reducir marchas y buscar zona segura'},
      {id:'c',texto:'Abrir la puerta y saltar del vehículo'},
      {id:'d',texto:'Acelerar para llegar más rápido a un lugar seguro'},
    ],
    correcta:'b',
    explicacion:'Falla de frenos: reducir marchas progresivamente, usar el freno de mano con suavidad gradual y dirigir el vehículo hacia una zona de frenado (berma, cuesta arriba).',
  },
  {
    id:'mb04', tipo:'ordenar', dificultad:'media',
    enunciado:'Ordena los pasos correctos para cambiar un neumático pinchado en carretera.',
    instruccion:'Arrastra los pasos hasta ordenarlos correctamente.',
    items:[
      {id:'r1', texto:'Estacionar en zona segura y señalizar con triángulos', emoji:'🚧'},
      {id:'r2', texto:'Aflojar levemente los pernos antes de elevar', emoji:'🔧'},
      {id:'r3', texto:'Colocar el gato y elevar el vehículo', emoji:'⬆️'},
      {id:'r4', texto:'Retirar el neumático dañado y montar el de repuesto', emoji:'🔄'},
      {id:'r5', texto:'Ajustar pernos en estrella y bajar el vehículo', emoji:'✅'},
    ],
    ordenCorrecto:['r1','r2','r3','r4','r5'],
    explicacion:'Señalizar → aflojar pernos (más fácil con peso) → elevar → cambiar → ajustar en patrón de estrella para distribución uniforme.',
  },
  {
    id:'mb05', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Cuál es la presión correcta de los neumáticos?',
    opciones:[
      {id:'a',texto:'32 PSI para todos los vehículos'},
      {id:'b',texto:'La indicada por el fabricante en el manual o en la puerta del conductor'},
      {id:'c',texto:'La que se siente al pisar el neumático'},
      {id:'d',texto:'Siempre la presión máxima del neumático'},
    ],
    correcta:'b',
    explicacion:'La presión correcta varía según el modelo del vehículo y está indicada en el manual del propietario o en la etiqueta interior de la puerta del conductor.',
  },
  {
    id:'mb06', tipo:'clasificar', dificultad:'media',
    enunciado:'Clasifica cada componente del vehículo según el sistema al que pertenece.',
    instruccion:'Arrastra cada componente a la columna correcta.',
    categorias:[
      {id:'motor',  label:'Sistema de motor', color:'#f59e0b'},
      {id:'frenos', label:'Sistema de frenos', color:'#ef4444'},
    ],
    items:[
      {id:'comp1', texto:'Aceite de motor',    emoji:'🛢️'},
      {id:'comp2', texto:'Líquido de frenos',  emoji:'💧'},
      {id:'comp3', texto:'Bujías',             emoji:'⚡'},
      {id:'comp4', texto:'Pastillas de freno', emoji:'🔴'},
      {id:'comp5', texto:'Filtro de aire',     emoji:'💨'},
      {id:'comp6', texto:'Disco de freno',     emoji:'⭕'},
    ],
    clasificacionCorrecta:{ comp1:'motor', comp2:'frenos', comp3:'motor', comp4:'frenos', comp5:'motor', comp6:'frenos' },
    explicacion:'Motor: aceite, bujías, filtro de aire. Frenos: líquido de frenos, pastillas y discos de freno.',
  },
  {
    id:'mb07', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Qué indica la luz roja de temperatura en el tablero del vehículo?',
    opciones:[
      {id:'a',texto:'Que el motor está a temperatura de funcionamiento normal'},
      {id:'b',texto:'Que el motor se está sobrecalentando y hay que detener el vehículo'},
      {id:'c',texto:'Que el aire acondicionado está encendido'},
      {id:'d',texto:'Que se debe cambiar el refrigerante en el próximo servicio'},
    ],
    correcta:'b',
    explicacion:'La luz roja de temperatura indica sobrecalentamiento del motor. Se debe detener el vehículo de forma segura, apagar el motor y llamar a asistencia. No abrir el radiador en caliente.',
  },
  {
    id:'mb08', tipo:'completar', dificultad:'media',
    enunciado:'Completa el texto sobre el mantenimiento básico del vehículo.',
    instruccion:'Haz clic en una palabra del banco y luego en el espacio donde va.',
    textoConHuecos:'El aceite de motor debe revisarse {{h1}}. La presión de los neumáticos debe comprobarse cuando están {{h2}}. El líquido de frenos debe ser {{h3}} para garantizar su eficacia. Antes de un viaje largo es recomendable revisar {{h4}} el vehículo.',
    palabrasDisponibles:['mensualmente','anualmente','fríos','calientes','claro','oscuro','completamente','el motor'],
    respuestasCorrectas:{ h1:'mensualmente', h2:'fríos', h3:'claro', h4:'completamente' },
    explicacion:'Aceite: mensualmente. Neumáticos en frío (la presión sube en caliente). Líquido de frenos claro = bueno (oscuro = cambiar). Revisar todo antes de viaje largo.',
  },
  {
    id:'mb09', tipo:'opcion_multiple', dificultad:'dificil',
    enunciado:'¿Qué sistema del vehículo controla la estabilidad y evita el deslizamiento en curvas?',
    opciones:[
      {id:'a',texto:'El sistema de frenos ABS'},
      {id:'b',texto:'El control de tracción (TCS) y el control de estabilidad (ESC)'},
      {id:'c',texto:'El sistema de dirección hidráulica'},
      {id:'d',texto:'El catalizador del motor'},
    ],
    correcta:'b',
    explicacion:'El TCS (control de tracción) evita que las ruedas patinen al acelerar. El ESC (control de estabilidad) evita el derrape en curvas. Ambos complementan al ABS en la seguridad activa.',
  },
  {
    id:'mb10', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Qué función cumple el SOAT (Seguro Obligatorio de Accidentes de Tránsito)?',
    opciones:[
      {id:'a',texto:'Asegurar el vehículo contra robos'},
      {id:'b',texto:'Cubrir los daños al vehículo en cualquier accidente'},
      {id:'c',texto:'Cubrir los gastos médicos de las víctimas de accidente de tránsito'},
      {id:'d',texto:'Garantizar que el vehículo pase la revisión técnica'},
    ],
    correcta:'c',
    explicacion:'El SOAT es un seguro obligatorio que cubre los gastos médicos, de rehabilitación e indemnización de las víctimas de accidentes de tránsito, sin importar quién fue el responsable.',
  },
];

const PREGUNTAS_SEGURIDAD_VIAL = [
  {
    id:'sv01', tipo:'opcion_multiple', dificultad:'facil',
    enunciado:'¿Qué significa el concepto de "manejo defensivo"?',
    opciones:[
      {id:'a',texto:'Conducir de manera agresiva para protegerse'},
      {id:'b',texto:'Anticipar riesgos y actuar preventivamente para evitar accidentes'},
      {id:'c',texto:'Usar el claxon frecuentemente como señal de aviso'},
      {id:'d',texto:'Circular siempre por el carril izquierdo'},
    ],
    correcta:'b',
    explicacion:'El manejo defensivo es la técnica de conducción que consiste en anticipar situaciones peligrosas y tomar decisiones seguras para evitar accidentes, independientemente de otros conductores.',
  },
  {
    id:'sv02', tipo:'clasificar', dificultad:'media',
    enunciado:'Clasifica cada factor según si aumenta o reduce el riesgo de accidente.',
    instruccion:'Arrastra cada elemento a la columna correspondiente.',
    categorias:[
      {id:'reduce',  label:'Reduce el riesgo', color:'#10b981'},
      {id:'aumenta', label:'Aumenta el riesgo', color:'#ef4444'},
    ],
    items:[
      {id:'f1', texto:'Mantener distancia de seguridad', emoji:'↔️'},
      {id:'f2', texto:'Conducir con somnolencia',        emoji:'😴'},
      {id:'f3', texto:'Revisar espejos regularmente',    emoji:'🪞'},
      {id:'f4', texto:'Exceso de velocidad',              emoji:'💨'},
      {id:'f5', texto:'Cinturón de seguridad abrochado', emoji:'🔒'},
      {id:'f6', texto:'Usar el celular al manejar',      emoji:'📱'},
    ],
    clasificacionCorrecta:{ f1:'reduce', f2:'aumenta', f3:'reduce', f4:'aumenta', f5:'reduce', f6:'aumenta' },
    explicacion:'Reducen el riesgo: distancia, espejos, cinturón. Aumentan el riesgo: somnolencia, velocidad excesiva, celular.',
  },
  {
    id:'sv03', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Cuál es la acción correcta cuando el conductor siente sueño al volante?',
    opciones:[
      {id:'a',texto:'Bajar la ventana para que entre aire frío'},
      {id:'b',texto:'Tomar café y continuar conduciendo'},
      {id:'c',texto:'Detenerse en lugar seguro y descansar al menos 20 minutos'},
      {id:'d',texto:'Aumentar la velocidad para llegar más rápido al destino'},
    ],
    correcta:'c',
    explicacion:'La única solución efectiva contra la somnolencia es descansar. El café y el aire frío solo retrasan temporalmente el sueño sin eliminar el riesgo. Lo correcto es detener el vehículo y dormir.',
  },
  {
    id:'sv04', tipo:'relacionar', dificultad:'media',
    enunciado:'Relaciona cada factor de riesgo con su consecuencia principal.',
    instruccion:'Selecciona un elemento de la izquierda y luego su par correcto.',
    columnaIzq:[
      {id:'r1', texto:'Exceso de velocidad'},
      {id:'r2', texto:'Conducir bajo efectos del alcohol'},
      {id:'r3', texto:'Distracción con el celular'},
      {id:'r4', texto:'No respetar distancia de seguridad'},
    ],
    columnaDer:[
      {id:'con1', texto:'Accidentes por alcance trasero'},
      {id:'con2', texto:'Pérdida de reflejos y de control del vehículo'},
      {id:'con3', texto:'Mayor distancia de frenado y mayor impacto'},
      {id:'con4', texto:'Tiempo de reacción equivalente a manejar ebrio'},
    ],
    paresCorrectos:{ r1:'con3', r2:'con2', r3:'con4', r4:'con1' },
    explicacion:'Velocidad: mayor daño al frenar. Alcohol: pierde reflejos. Celular: tan peligroso como alcohol. Sin distancia: alcances traseros.',
  },
  {
    id:'sv05', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Cuál es la técnica correcta para maniobrar en una curva pronunciada?',
    opciones:[
      {id:'a',texto:'Frenar fuertemente dentro de la curva'},
      {id:'b',texto:'Reducir velocidad ANTES de entrar, mantener en la curva y acelerar al salir'},
      {id:'c',texto:'Mantener o aumentar velocidad para tener mayor control'},
      {id:'d',texto:'Soltar el volante y dejar que el auto siga su trayectoria'},
    ],
    correcta:'b',
    explicacion:'La técnica correcta es: frenar ANTES de la curva (no dentro), mantener velocidad constante en la curva y acelerar suavemente al salir. Frenar en la curva puede provocar derrape.',
  },
  {
    id:'sv06', tipo:'ordenar', dificultad:'media',
    enunciado:'Ordena las acciones correctas antes de iniciar un viaje largo.',
    instruccion:'Arrastra los pasos hasta ordenarlos correctamente.',
    items:[
      {id:'v1', texto:'Revisar el estado general del vehículo (aceite, neumáticos, luces)', emoji:'🔍'},
      {id:'v2', texto:'Planificar la ruta y estimar tiempo de llegada', emoji:'🗺️'},
      {id:'v3', texto:'Descansar adecuadamente la noche anterior', emoji:'😴'},
      {id:'v4', texto:'Hacer pausas cada 2 horas durante el viaje', emoji:'⏱️'},
      {id:'v5', texto:'Ajustar espejos y asiento antes de partir', emoji:'🪞'},
    ],
    ordenCorrecto:['v3','v1','v5','v2','v4'],
    explicacion:'Primero descansar bien, luego revisar el vehículo, ajustar posición, planificar ruta y hacer pausas regulares durante el viaje.',
  },
  {
    id:'sv07', tipo:'completar', dificultad:'media',
    enunciado:'Completa el texto sobre manejo defensivo.',
    instruccion:'Haz clic en una palabra del banco y luego en el espacio donde va.',
    textoConHuecos:'El manejo defensivo consiste en {{h1}} los riesgos antes de que ocurran. La distancia de seguridad se calcula con la regla de los {{h2}} segundos. Al sentir sueño, lo correcto es {{h3}} el vehículo. El factor de riesgo más común en accidentes urbanos es la {{h4}}.',
    palabrasDisponibles:['anticipar','ignorar','2','5','detener','acelerar','velocidad','distracción'],
    respuestasCorrectas:{ h1:'anticipar', h2:'2', h3:'detener', h4:'distracción' },
    explicacion:'Anticipar riesgos, regla de 2 segundos, detener ante sueño, y la distracción es la causa #1 en ciudad.',
  },
  {
    id:'sv08', tipo:'opcion_multiple', dificultad:'dificil',
    enunciado:'¿A qué distancia deben bajarse las luces altas al encontrarse con un vehículo en sentido contrario?',
    opciones:[
      {id:'a',texto:'100 metros'},
      {id:'b',texto:'150 metros'},
      {id:'c',texto:'200 metros'},
      {id:'d',texto:'Las luces altas nunca deben apagarse en carretera'},
    ],
    correcta:'c',
    explicacion:'Se deben cambiar las luces altas a bajas cuando se aproxime un vehículo en sentido contrario a 200 metros, para no encandilar al otro conductor.',
  },
  {
    id:'sv09', tipo:'opcion_multiple', dificultad:'media',
    enunciado:'¿Cuál es el principal beneficio del cinturón de seguridad en un accidente?',
    opciones:[
      {id:'a',texto:'Evita que el vehículo se dañe'},
      {id:'b',texto:'Retiene al ocupante evitando que salga despedido o golpee el interior'},
      {id:'c',texto:'Activa las bolsas de aire automáticamente'},
      {id:'d',texto:'Reduce el tiempo de frenado del vehículo'},
    ],
    correcta:'b',
    explicacion:'El cinturón retiene al ocupante en su asiento durante un impacto, evitando que sea proyectado hacia el parabrisas, el tablero o fuera del vehículo, reduciendo dramáticamente el riesgo de muerte.',
  },
  {
    id:'sv10', tipo:'clasificar', dificultad:'media',
    enunciado:'Clasifica cada situación: ¿es un comportamiento de manejo defensivo o un comportamiento de riesgo?',
    instruccion:'Arrastra cada situación a la columna correcta.',
    categorias:[
      {id:'def', label:'Manejo defensivo', color:'#10b981'},
      {id:'rie', label:'Conducta de riesgo', color:'#ef4444'},
    ],
    items:[
      {id:'m1', texto:'Anticipar el comportamiento de otros conductores', emoji:'🧠'},
      {id:'m2', texto:'Cambiar de carril sin verificar el espejo',        emoji:'🚗'},
      {id:'m3', texto:'Mantener velocidad acorde a las condiciones',      emoji:'🐢'},
      {id:'m4', texto:'Ignorar una señal de ceda el paso',               emoji:'🚫'},
      {id:'m5', texto:'Dejar espacio de seguridad al frenar',            emoji:'↔️'},
      {id:'m6', texto:'Circular con luces apagadas de noche',            emoji:'🌙'},
    ],
    clasificacionCorrecta:{ m1:'def', m2:'rie', m3:'def', m4:'rie', m5:'def', m6:'rie' },
    explicacion:'Manejo defensivo: anticipar, velocidad adecuada, espacio de seguridad. Riesgo: cambiar sin verificar, ignorar señales, circular sin luces.',
  },
];

/* ── Mapa de preguntas por categoría ── */
export const BANCO_PRACTICA = {
  senales_preventivas:    PREGUNTAS_SENALES_PREVENTIVAS,
  senales_reglamentarias: PREGUNTAS_SENALES_REGLAMENTARIAS,
  senales_informativas:   PREGUNTAS_SENALES_INFORMATIVAS,
  normas_transito:        PREGUNTAS_NORMAS_TRANSITO,
  infracciones:           PREGUNTAS_INFRACCIONES,
  primeros_auxilios:      PREGUNTAS_PRIMEROS_AUXILIOS,
  mecanica_basica:        PREGUNTAS_MECANICA,
  seguridad_vial:         PREGUNTAS_SEGURIDAD_VIAL,
};

/* ── Función: obtener preguntas de una categoría (aleatorias) ── */
export function obtenerPreguntasPorCategoria(categoriaId, cantidad = 10) {
  const preguntas = BANCO_PRACTICA[categoriaId] || [];
  return [...preguntas].sort(() => Math.random() - 0.5).slice(0, cantidad);
}

/* ── Evaluador (reutiliza el mismo evaluador del simulacro) ── */
export function evaluarRespuestaPractica(pregunta, respuestaUsuario) {
  if (respuestaUsuario === undefined || respuestaUsuario === null)
    return { correcta: false, puntajeParcial: 0 };

  switch (pregunta.tipo) {
    case 'opcion_multiple':
      return { correcta: respuestaUsuario === pregunta.correcta, puntajeParcial: respuestaUsuario === pregunta.correcta ? 1 : 0 };
    case 'relacionar': {
      const total = pregunta.columnaIzq.length;
      let aciertos = 0;
      Object.entries(pregunta.paresCorrectos).forEach(([izq, der]) => { if (respuestaUsuario[izq] === der) aciertos++; });
      return { correcta: aciertos === total, puntajeParcial: total > 0 ? aciertos / total : 0 };
    }
    case 'ordenar': {
      const correcto = pregunta.ordenCorrecto;
      const usuario  = Array.isArray(respuestaUsuario) ? respuestaUsuario : [];
      let aciertos = 0;
      correcto.forEach((id, i) => { if (usuario[i] === id) aciertos++; });
      return { correcta: aciertos === correcto.length, puntajeParcial: correcto.length > 0 ? aciertos / correcto.length : 0 };
    }
    case 'clasificar': {
      const total = Object.keys(pregunta.clasificacionCorrecta).length;
      let aciertos = 0;
      Object.entries(pregunta.clasificacionCorrecta).forEach(([item, cat]) => { if (respuestaUsuario[item] === cat) aciertos++; });
      return { correcta: aciertos === total, puntajeParcial: total > 0 ? aciertos / total : 0 };
    }
    case 'completar': {
      const total = Object.keys(pregunta.respuestasCorrectas).length;
      let aciertos = 0;
      Object.entries(pregunta.respuestasCorrectas).forEach(([hueco, val]) => { if (respuestaUsuario[hueco] === val) aciertos++; });
      return { correcta: aciertos === total, puntajeParcial: total > 0 ? aciertos / total : 0 };
    }
    default: return { correcta: false, puntajeParcial: 0 };
  }
}
