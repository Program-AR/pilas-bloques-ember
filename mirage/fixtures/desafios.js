export default [
  {
    id: 1,
    grupoId: 1,
    nombre: 'AlienTocaBoton',
    titulo: 'El alien toca el botón',
    enunciado: 'Ayudá a nuestro Alien a presionar el botón de su laboratorio. \n'+
               'Pistas: mirá las acciones disponibles. ¡Vas a tener que avanzar varias veces!',
    consignaInicial: 'Los bloques te permiten formar secuencias de acciones para resolver los desafíos que te proponemos en Pilas Bloques.',
    escena: 'AlienInicial',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'ApretarBoton']
  },
  {
    id: 2,
    grupoId: 1,
    nombre: 'ElGatoEnLaCalle', // sale de 'id' en 'app/actividades/actividadElGatoEnLaCalle.js'
    titulo: 'El gato en la calle', // sale de 'nombre' en 'app/actividades/actividadElGatoEnLaCalle.js'
    enunciado: 'Hacé que el gato avance un paso, se duerma, se despierte, salude y vuelva a su lugar.',
    consignaInicial: 'Se pueden crear nuevas acciones en Procedimientos definiendo nuevos bloques que incluyan otras acciones.',
    escena: 'ElGatoEnLaCalle',
    debeFelicitarse: true,
    bloques: ['Saludar', 'Avanzar', 'Volver', 'Abrirojos', 'Cerrarojos', 'Acostarse', 'Pararse', 'Soar', 'Procedimiento']
  },
  {
    id: 3,
    grupoId: 1,
    nombre: 'NoMeCansoDeSaltar',
    titulo: 'No me canso de saltar',
    enunciado: 'Ayudá al gato a quitarse la pereza saltando 30 veces seguidas. Pista: se puede resolver con menos de 30 bloques.',
    consignaInicial: 'El bloque Repetir permite elegir la cantidad de veces que se desea repetir una secuencia de acciones. Esto se llama "Repetición simple".',
    escena: 'NoMeCansoDeSaltar',
    debeFelicitarse: true,
    bloques:  ['saltar1', 'Procedimiento', 'repetir']
  },
  {
    id: 4,
    grupoId: 1,
    nombre: 'ElMarcianoEnElDesierto',
    titulo: 'El marciano en el desierto',
    enunciado: 'El marciano está perdido en el desierto y necesita alimentarse de su comida favorita: ¡las manzanas! Ayudalo a cumplir su objetivo. Pista: Crear un procedimiento (bloque) para cada conjunto de manzanas',
    consignaInicial: 'Hay muchas formas de comer las manzanas. Podés empezar por las de la derecha, ¡o podés empezar por arriba! ¿Se te ocurre otra estrategia? Pensala siempre antes de programar',
    escena: 'ElMarcianoEnElDesierto',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'ComerManzana', 'Procedimiento', 'repetir']
  },
  {
    id: 5,
    grupoId: 1,
    nombre: 'TitoEnciendeLuces',
    titulo: 'Tito enciende las luces',
    enunciado: 'Ayudá a Tito a encender todas las luces. \n'+
    'Pista: creá un procedimiento para prender todas las luces de una diagonal.',
    consignaInicial: 'Se puede crear un procedimiento una vez y usarlo todas las veces que quieras dentro de un programa.',
    escena: 'TitoEnciendeLuces',
    debeFelicitarse: true,
    bloques: ['EncenderLuz', 'MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'Procedimiento', 'repetir']
  },
  {
    id: 6,
    grupoId: 1,
    nombre: 'ElAlienYLasTuercas',
    titulo: 'El alien y las tuercas',
    enunciado: 'Definí un programa para que el alien junte todas las tuercas. Pista: ¿El alien no puede moverse en diagonal? Podés crear tu propio procedimiento para que lo haga',
    escena: 'AlienLevantaTuercas',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo',  'LevantaTuerca', 'Procedimiento', 'repetir']
  },
  {
    id: 7,
    grupoId: 1,
    nombre: 'ElRecolectorDeEstrellas',
    titulo: 'El recolector de estrellas',
    enunciado: 'Ayudá a nuestro personaje a recolectar todas las estrellas. Pista: podés hacer un procedimiento que tome una fila de estrellas.',
    consignaInicial: 'Usar muchas veces un procedimiento te ahorra trabajo.',
    escena: 'ElRecolectorDeEstrellas',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaArriba', 'VolverABordeIzquierdo', 'TomarEstrella', 'Procedimiento', 'repetir']
  },
  {
    id: 8,
    grupoId: 1,
    nombre: 'MariaLaComeSandias',
    titulo: 'María y las sandías',
    enunciado: 'María necesita comer todas las sandías de la cuadrícula. Pensá de qué manera puede hacerlo creando los bloques necesarios. Pista: la forma en que las sandías están distribuidas en la cuadrícula, es clave para crear la menor cantidad de procedimientos.',
    escena: 'MariaLaComeSandias',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo',  'MorderSandia', 'Procedimiento', 'repetir']
  },
  {
    id: 9,
    grupoId: 1,
    nombre: 'AlimentandoALosPeces',
    titulo: 'Alimentando a los peces',
    enunciado: 'Nuestro buzo debe alimentar con lombrices a los 7 peces que hay en esta escena. Buscá primero a las lombrices y luego pasá por cada pez alimentándolo. Pista: ¿Cuántas partes debería tener tu estrategia?',
    consignaInicial: '',
    escena: 'AlimentandoALosPeces',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo',  'AlimentarPez', 'AgarrarComida', 'Procedimiento', 'repetir']
  },
  {
    id: 10,
    grupoId: 1,
    nombre: 'InstalandoJuegos',
    titulo: 'Instalando juegos',
    enunciado: 'Ramiro tiene que instalar un juego en 3 compus para divertirse con sus amigos. Los pasos para instalarlo en cada una son: encenderla, escribir la contraseña ("ABC"), instalar el juego y apagar la máquina. Pista: aprovechá que en cada compu hay que hacer el mismo trabajo.',
    escena: 'InstalandoJuegos',
    debeFelicitarse: true,
    bloques: ['SiguienteCompu', 'PrenderCompu', 'ApagarCompu', 'EscribirC', 'EscribirB', 'EscribirA', 'InstalarJuego', 'repetir', 'Procedimiento'],
  },
  {
    id: 11,
    grupoId: 1,
    nombre: 'LaGranAventuraDelMarEncantado',
    titulo: 'La gran aventura del mar encantado',
    enunciado:  'Ayuda a la heroína a rescatar a su príncipe. Para ello debe superar en orden cada una de las siguientes pruebas:\n' +
              '1) Buscar la llave.\n'+
              '2) Abrir el cofre con la llave y tomar el sombrero mágico que está dentro.\n'+
              '3) Entregarle el sombrero al mago para recibir la espada a cambio.\n'+
              '4) Luchar con la espada contra el caballero oscuro.\n'+
              '5) Escapar en unicornio.',
    escena: 'LaGranAventuraDelMarEncantado',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'Agarrarllave', 'Abrircofre', 'Darsombrero', 'Atacarconespada', 'Escaparenunicornio', 'repetir', 'Procedimiento'],
  },
  {
    id: 12,
    grupoId: 1,
    nombre: 'ReparandoLaNave',
    titulo: 'Reparando la nave',
    enunciado: 'El marciano debe arreglar su nave para poder volver a su hogar. Para lograrlo debe llevar 3 unidades de carbón y 3 de hierro a la nave, pero no puede cargar más de una unidad a la vez.',
    escena: 'ReparandoLaNave',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'TomarHierro', 'TomarCarbon', 'Depositar', 'Escapar', 'repetir', 'Procedimiento'],
  },
  {
    id: 13,
    grupoId: 2,
    nombre: 'ElMonoYLasBananas',
    titulo: 'El mono y las bananas',
    enunciado:
    '¿Podés hacer que el mono avance al casillero de enfrente?'+
    ' Si hay una banana debe comérsela. Si no, es feliz con sólo llegar. \n '+
    'Ejecutá el programa varias veces para asegurarte que siempre funciona. \n' +
    'Pista: mirá la categoría "Sensores" y la categoría "Alternativas".',
    consignaInicial: 'El bloque "Si... Entonces" ejecuta una secuencia de instrucciones solamente cuando la condición es verdadera. Esto se llama "alternativa condicional".',
    escena: 'ElMonoYLasBananas',
    debeFelicitarse: true,
    bloques: ['ComerBanana', 'AvanzarMono', 'Tocandobanana', 'repetir', 'Procedimiento', 'si']
  },
  {
    id: 14,
    grupoId: 2,
    nombre: 'LaEleccionDelMono',
    titulo: 'La elección del mono',
    enunciado: '¿Podés ayudar nuevamente a nuestro mono? Esta vez tiene '+
     'que comer la fruta que aparece, ya sea banana ó manzana. \n'+
    'Ejecutá el programa varias veces para asegurarte que siempre funciona. \n' +
    'Pista: ésta vez no alcanza con el bloque "Si".',
    consignaInicial: 'Cuando sólo hay 2 opciones, alcanza con hacer una sola pregunta. En esos casos se puede usar el bloque "Si... si no".',
    escena: 'LaEleccionDelMono',
    debeFelicitarse: true,
    bloques: ['ComerBanana', 'ComerManzana', 'AvanzarMono', 'Procedimiento', 'repetir', 'si', 'sino', 'tocandoManzana', 'tocandoBanana']
  },
  {
    id: 15,
    grupoId: 2,
    nombre: 'LaberintoCorto',
    titulo: 'Laberinto corto',
    enunciado: 'Guiá al ratón para llegar a la meta. Para lograrlo, debe avanzar una casilla en la dirección que indica la flecha. Pista: mirá en la categoría "Sensores" qué preguntas podés hacer.',
    escena: 'LaberintoCorto',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'Repetir', 'Si', 'Sino', 'MoverACasillaDerecha',
              'MoverACasillaAbajo', 'TocandoAbajo', 'TocandoDerecha'],
  },
  {
    id: 16,
    grupoId: 2,
    nombre: 'TresNaranjas',
    titulo: 'Tres naranjas',
    enunciado: 'El alien debe comer todos los gajos de naranja que aparezcan en las casillas violetas. ¡Pero no siempre aparecen en los mismos lugares ni la misma cantidad de naranjas! Pista: pensá primero cómo harías un procedimiento para comer una sola naranja si es que la hay.',
    escena: 'TresNaranjas',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'ComerNaranja', 'Repetir', 'Si', 'Sino', 'TocandoNaranja']
  },
  {
    id: 17,
    grupoId: 2,
    nombre: 'TitoRecargado',
    titulo: 'Tito recargado',
    enunciado: 'Tito necesita encender las luces para poder conocer el camino... ¡Pero en cada ejecución cambian de lugar! Podés utlizar los procedimientos y bloques de control.',
    escena: 'TitoRecargado',
    debeFelicitarse: true,
    bloques: ['EncenderLuz', 'MoverACasillaAbajo', 'Procedimiento', 'Repetir', 'Si', 'Sino', 'TocandoLuz']
  },
  {
    id: 18,
    grupoId: 2,
    nombre: 'LaberintoLargo',
    titulo: 'Laberinto largo',
    enunciado: 'Ayudá al ratón a salir del laberinto. A diferencia del laberinto anterior, aquí la cantidad de casillas que debe avanzar son muchas. ¿Cuántas? ¿Es siempre la misma? Pista: pensá primero cómo avanzar una sola casilla.',
    escena: 'LaberintoLargo',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaAbajo',
              'Repetir', 'Si', 'Sino', 'TocandoAbajo', 'TocandoDerecha'],
  },
  {
    id: 19,
    grupoId: 3,
    nombre: 'SuperTito1',
    titulo: 'Súper Tito 1 ',
    enunciado: ' Ayudá a Tito a encender las luces. \n ¡Ojo! En todas las celdas hay una luz, pero no sabés cuántas celdas hay en cada ejecución.',
    consignaInicial: 'Hay nuevos bloques que pueden ayudarte a resolver el desafío de manera muy sencilla. ¡Aprovechalos!',
    escena: 'SuperTito1',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'EncenderLuz', 'MoverACasillaAbajo',
              'TocandoFinal', 'Repetir', 'Si', 'Sino', 'Hasta'],
  },
  {
    id: 20,
    grupoId: 3,
    nombre: 'SuperTito2',
    titulo: 'Súper Tito 2',
    enunciado: 'Súper Tito debe encender todas las luces, pero a diferencia del desafío anterior, hay celdas sin luz. ¿Podrás utilizar el mismo procedimiento que en Súper Tito 1? \n',
    consignaInicial: 'El bloque "repetir hasta que" repite una secuencia de acciones hasta que se cumple una condición. Esto se llama "repetición condicional".',
    escena: 'SuperTito2',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'TocandoFinal', 'TocandoLuz', 'EncenderLuz',
              'MoverACasillaAbajo', 'Repetir', 'Si', 'Sino', 'Hasta']
  },
  {
    id: 21,
    grupoId: 3,
    nombre: 'LaberintoConQueso',
    titulo: 'Laberinto con queso',
    enunciado: '¡El ratón está más hambriento que nunca! Guialo por el laberinto para que pueda comer todos los trozos de queso. Pista: antes de empezar, apretá varias veces el botón Ejecutar para conocer cómo varía el escenario.',
    consignaInicial: 'Es importante pensar si en algún momento se cumple la condición del bloque "Repetir hasta qué". Sino, ¡el programa podría no terminar nunca!',
    escena: 'LaberintoConQueso',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaAbajo',
              'ComerQueso', 'Repetir', 'Si', 'Sino', 'Hasta', 'TocandoAbajo',
              'TocandoDerecha', 'TocandoFinCamino', 'TocandoQueso'],
  },
  {
    id: 22,
    grupoId: 3,
    nombre: 'ElDetectiveChaparro',
    titulo: 'El detective Chaparro',
    enunciado: 'El detective debe descubrir al culpable de un crimen, quitándole el disfraz que lo camufla. Comenzando por el primero de la izquierda, ¡interrogá a cada uno de los sospechosos hasta encontrar al culpable!',
    consignaInicial: 'El bloque "Repetir hasta que" nos permite terminar el programa cuando encontramos al culpable sin tener que interrogar a todos los sospechosos de la fila.',
    escena: 'ElDetectiveChaparro',
    debeFelicitarse: true,
    bloques: ['Repetir', 'Si', 'Sino', 'Hasta', 'Procedimiento',
              'PrimerSospechoso', 'SiguienteSospechoso', 'SacarDisfraz',
              'EsCulpable'],
  },
  {
    id: 23,
    grupoId: 3,
    nombre: 'FutbolRobots',
    titulo: 'Fútbol para robots',
    enunciado: 'Ayudá a nuestro robot futbolista a patear todas las pelotas. ' +
    'Recordá siempre que una buena división en procedimientos puede ayudarte a encarar '+
    'mejor el problema.',
    consignaInicial: 'El procedimiento que se defina debe considerar el escenario variable y ofrecer una solución con poca cantidad de bloques. Es importante tener en cuenta que la acción se repite varias veces y que la longitud de las filas varía.',
    escena: 'FutbolRobots',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaIzquierda', 'SiguienteFila',
              'PatearPelota', 'TocandoInicio', 'TocandoPelota', 'Repetir', 'Si',
              'Sino', 'Hasta'],
  },
  {
    id: 24,
    grupoId: 3,
    nombre: 'PrendiendoLasCompus',
    titulo: 'Prendiendo las compus',
    enunciado:
    'Debemos prender todas las compus teniendo en cuenta que el ancho y el alto del escenario cambian en cada ejecución. Pista: pensá cómo harías para prender las compus de un solo lado del rectángulo y después repetilo para el resto de los lados.',
    escena: 'PrendiendoLasCompus',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'Repetir', 'Si', 'Sino', 'Hasta',
              'MoverACasillaDerecha', 'MoverACasillaArriba',
              'MoverACasillaAbajo', 'MoverACasillaIzquierda',
              'PrenderCompuConColision', 'EstoyEnEsquina'],
  },
  {
    id: 25,
    grupoId: 3,
    nombre: 'ElMonoQueSabeContar',
    titulo: 'El mono que sabe contar',
    enunciado: 'El mono debe recorrer todas las casillas y contar cuántas bananas y manzanas hay en total. Pista: primero pensá cómo contarías si hay una manzana o una banana en una casilla determinada. Luego pensá cómo harías para contar todas las frutas de una sola columna.',
    consignaInicial: 'Subdividir un problema grande en problemas más pequeños ayuda a comprender mejor cada una de las partes que lo componen. Además nos permite concentrarnos en resolver cuestiones más sencillas al problema original.',
    escena: 'ElMonoQueSabeContar',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaArriba', 'MoverACasillaAbajo',
              'SiguienteColumna', 'ContarBanana', 'ContarManzana',
              'TocandoBanana', 'TocandoManzana', 'Repetir', 'Si', 'Sino',
              'Hasta', 'EstoyAlInicio', 'EstoyAlFin']
  },
  {
    id: 26,
    grupoId: 4,
    nombre: 'ElSuperviaje',
    titulo: 'El Superviaje',
    enunciado: 'Nuestro superhéroe debe realizar su súper paseo matutino que consiste en recorrer una cierta cantidad de kilómetros que varía día a día (entre 15 y 45 km). ¡Lográ que nuestro súper amigo llegue siempre a destino sin pasarse! Pista: mirá en la categoría "Sensores" si hay algo que te pueda servir.',
    consignaInicial: 'Se puede usar un bloque "Repetir" con el valor de un sensor. Esto permite repetir una secuencia de código la cantidad de veces que indique el sensor',
    escena: 'SuperViaje',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'KmsTotales', 'Avanzar1km', 'RepetirVacio',
              'Repetir', 'Si', 'Sino', 'Hasta'],
  },
  {
    id: 27,
    grupoId: 4,
    nombre: 'ElMonoCuentaDeNuevo',
    titulo: 'El mono cuenta de nuevo',
    enunciado: 'El mono tiene que contar otra vez las frutas, ¡pero ahora no puede verificar si ya llegó al final de una columna! ¿Habrá algún sensor que lo pueda ayudar?',
    consignaInicial: 'Una sensor nos permite obtener información que puede cambiar en cada ejecución del programa, incluso en una misma ejecución. Por ejemplo, el largo de cada columna varía dependiendo en qué columna esté parado el mono.',
    escena: 'ElMonoCuentaDeNuevo',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaArriba', 'MoverACasillaAbajo',
              'SiguienteColumna',
              'ContarBanana', 'ContarManzana', 'TocandoBanana',
              'TocandoManzana','RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta',
              'EstoyAlInicio',  'LargoColumnaActual']
  },
  {
    id: 28,
    grupoId: 5,
    nombre: 'ElPlanetaDeNano',
    titulo: 'El planeta de Nano',
    escena: 'ElPlanetaDeNano',
    enunciado: 'Ayudá a Nano a comer todas sus bananas. ¡Cuidado! No se puede bajar... \n ¡Tené en cuenta que el escenario no cambia, las bananas están siempre en las mismas casillas!',
    consignaInicial: 'A los procedimientos se les pueden agregar parámetros para que resulten más generales. Por ejemplo, si creamos los procedimientos "Comer 2 bananas a la derecha", "Comer 3 bananas a la derecha" y "Comer 4 bananas a la derecha", podemos reemplazar a los tres por un solo procedimiento que reciba como parámetro la cantidad de bananas que queremos comer a la derecha: "Comer a la derecha esta cantidad: [cantidad]". \n Para agregar un parámetro a un procedimiento nuevo, hay que hacer clic en la estrella que aparece al lado de "Definir" y luego arrastrar el bloque "nombre de entrada" a "entradas".',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaArriba',
              'VolverAlBordeIzquierdo', 'ComerBananaNano', 'RepetirVacio', 'Repetir', 'Si',
              'Sino', 'Hasta', 'Numero'],
  },
  {
    id: 29,
    grupoId: 5,
    nombre: 'DibujandoAlCuadrado',
    titulo: 'Dibujando: Al cuadrado',
    enunciado: 'Dibujá un cuadrado que tenga 100 de lado.',
    consignaInicial: '',
    escena: 'DibujandoCuadrado',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero']
  },
  {
    id: 30,
    grupoId: 5,
    nombre: 'DibujandoRayuelaRobotica',
    titulo: 'Dibujando: Rayuela robótica',
    enunciado: 'Dibujá 5 cuadrados en fila, cada uno de lado 50, como muestra la figura sombreada.',
    consignaInicial: '',
    escena: 'Dibujando5CuadradosHorizontal',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero']
  },
  {
    id: 31,
    grupoId: 5,
    nombre: 'DibujandoCortoPorLaDiagonal',
    titulo: 'Dibujando: Corto por la diagonal',
    enunciado: 'Dibujá 5 cuadrados en diagonal, cada uno de lado 50, como muestra la figura sombreada.',
    consignaInicial: '',
    escena: 'Dibujando5CuadradosDiagonal',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero']
  },
  {
    id: 32,
    grupoId: 5,
    nombre: 'DibujandoMamushkaCuadrada',
    titulo: 'Dibujando: Mamushka cuadrada',
    enunciado: 'Dibujá 4 cuadrados de lados 50, 100, 150 y 200, como muestra la figura sombreada. Pista: creá un procedimiento nuevo para dibujar cuadrados de cualquier longitud de lado.',
    consignaInicial: 'Incluir parámetros en los procedimientos permite generalizar un concepto. Por ejemplo, la longitud del lado de un cuadrado.',
    escena: 'Dibujando4CuadradosInteriores',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero']
  },
  {
    id: 33,
    grupoId: 5,
    nombre: 'DibujandoEscaleraCuadrada',
    titulo: 'Dibujando: Escalera cuadrada',
    enunciado: 'Dibujá 5 cuadros de lado 50 y uno de 100, como muestra la figura sombreada.',
    consignaInicial: 'Al crear un procedimiento con parámetros, sus valores no están definidos (por ej. "longitud de lado"). Al usar los procedimientos hay que darles un valor concreto a esos parámetros (50, 100, etc.).',
    escena: 'DibujandoCabezaElefante',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero']
  },
  {
    id: 34,
    grupoId: 5,
    nombre: 'DibujandoHexagono',
    titulo: 'Dibujando: Hexágono',
    enunciado: 'Dibujá un hexágono de lado 100, como muestra la figura sombreada. Pista: pensá cuántos grados debe girar el robot sabiendo cuánto miden los ángulos internos del hexágono.',
    consignaInicial: 'En los polígonos, el valor de un ángulo externo es igual a 180 menos el valor de un ángulo interno.',
    escena: 'DibujandoHexagono',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero', 'OpAritmetica']
  },
  {
    id: 35,
    grupoId: 5,
    nombre: 'DibujandoPiramideInvertida',
    titulo: 'Dibujando: Pirámide invertida',
    enunciado: 'Dibujá un triángulo equilátero de lado 100, como muestra la figura sombreada. Pista: pensá si existe una relación entre los ángulos y la cantidad de lados.',
    consignaInicial: 'En los polígonos, la suma de todos los ángulos externos es 360',
    escena: 'DibujandoTrianguloEquilatero',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero', 'OpAritmetica']
  },
  {
    id: 36,
    grupoId: 5,
    nombre: 'DibujandoFigurasDentroDeFiguras',
    titulo: 'Dibujando: Figuras dentro de figuras',
    enunciado: 'Dibujá un triángulo, un cuadrado y un pentágono de lado 100, como muestra la figura sombreada. Pista: creá un procedimiento con un parámetro para la cantidad de lados. ',
    consignaInicial: 'Ahora tenemos Operadores: estos bloques nos van a permitir realizar algunas cuentas automáticamente ¡Como una calculadora!... ¿Cuántos grados tiene un giro completo? ¿Por qué número debemos dividirlo?',
    escena: 'DibujandoPoligonosInteriores',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero', 'OpAritmetica']
  },
  {
    id: 37,
    grupoId: 5,
    nombre: 'DibujandoLaCuevaDeEstalagtitas',
    titulo: 'Dibujando: La cueva de estalagtitas',
    enunciado: 'Dibujá 3 triángulos de lados 40, 60 y 100, y un cuadrado de lado 200, como muestra la figura sombreada. Pista: creá un procedimiento con 2 parámetros, uno para la cantidad de lados y otro para la longitud de los lados.',
    consignaInicial: 'Para poder usar los parámetros en un nuevo procedimiento, hay que hacer clic derecho en el bloque que define dicho procedimiento.',
    escena: 'DibujandoCuevaEstalagtitas',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero', 'OpAritmetica']
  },
  {
    id: 130,
    grupoId: 5,
    nombre: 'LaFiestaDeDracula',
    titulo: 'La fiesta de Drácula',
    escena: 'LaFiestaDeDracula',
    enunciado: 'Para que la fiesta de Drácula comience debemos cambiar el color de los 3 focos una cierta cantidad de veces: 5 veces el primero, 8 el segundo y 12 el tercero.',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'Numero',
              'OpAritmetica', 'CambiarColor', 'SiguienteFoco', 'EmpezarFiesta'],
  },
  {
    id: 131,
    grupoId: 5,
    nombre: 'SalvandoLaNavidad',
    titulo: 'Salvando la Navidad',
    escena: 'SalvandoLaNavidad',
    enunciado: 'Ayudá a Papá Noel a dejar un regalo al final de cada fila. ¡Tené en cuenta que el escenario no cambia de una ejecución a la otra! Pista: si tuvieses que elegir un parámetro para tu procedimiento... ¿Cuál eligirías? ¿Qué varía de fila a fila?',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'MoverACasillaDerecha', 'DejarRegalo', 'SiguienteFilaTotal', 'Numero', 'OpAritmetica'],
  },
  {
    id: 132,
    grupoId: 5,
    nombre: 'PrendiendoLasCompusParametrizado',
    titulo: 'Prendiendo las compus parametrizado',
    escena: 'PrendiendoLasCompus',
    enunciado: 'Al igual que antes, debemos prender todas las compus. Pero esta vez tenés que definir un único procedimiento que prenda cualquiera de los lados.',
    consignaInicial: 'Los parámetros pueden ser direcciones, no siempre deben ser números. Por ejemplo, un parámetro podría ser la dirección en que el autómata debe moverse.',
    deshabilitado: false,
    debeFelicitarse: true,
    bloques: ['ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo',
              'MoverA', 'Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta',
              'PrenderCompuConColision', 'EstoyEnEsquina', 'Numero',
              'OpAritmetica'],
  },
  {
    id: 133,
    grupoId: 5,
    nombre: 'TitoCuadrado',
    titulo: 'Tito cuadrado',
    escena: 'TitoCuadrado',
    enunciado: 'Tito debe encender todas las luces del cuadrado pero en cada ejecución están distribuidas de una manera diferente. Tené en cuenta que las casillas de la esquina nunca se prenden y que el tamaño del cuadrado no varía de una ejecución a la otra.',
    debeFelicitarse: true,
    bloques: ['ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo',
              'MoverA', 'Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta',
              'TocandoLuz', 'EncenderLuz', 'Numero', 'OpAritmetica'],
  },
  {
    id: 134,
    grupoId: 5,
    nombre: 'ElCangrejoAguafiestas',
    titulo: 'El cangrejo aguafiestas',
    escena: 'ElCangrejoAguafiestas',
    enunciado: 'El cangrejo quiere pinchar todos los globos de la fiesta. Tené en cuenta que estos no cambian de lugar. Pista: ¿la cantidad de globos y la dirección podrían ser parámetros?',
    consignaInicial: 'Se pueden combinar parámetros numéricos (cantidades, longitudes) con parámetros de texto (direcciones, nombres).',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta',
              'ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo', 'MoverA',
              'ExplotarGlobo', 'Numero', 'OpAritmetica']
  },
  {
    id: 135,
    grupoId: 5,
    nombre: 'PrendiendoLasFogatas',
    titulo: 'Prendiendo las fogatas',
    escena: 'PrendiendoLasFogatas',
    enunciado: 'En este caso debemos encender todas las fogatas del cuadrado pero en cada ejecución están distribuidas de una manera diferente. Tené en cuenta que las casillas de la esquina nunca se prenden y que el tamaño del cuadrado no varía de una ejecución a la otra.',
		consignaInicial: 'Si no tenés un procedimiento con parámetros para mover en cualquier direccion... ¡Podés crearlo!',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'si', 'SiNo', 'Hasta',
      'TocandoFogata', 'PrenderFogata',
      'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha',
      'Numero', 'OpComparacion', 'OpAritmetica',
      'ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo'
    ]
  },
  {
    id: 151,
    grupoId: 6,
    nombre: '3.2.1a',
    titulo: 'Desafío 3.2.1a',
    escena: `new EscenaCoty(0,100,
      [{x:100,y:95},{x:100,y:90},{x:100,y:85},{x:100,y:80},{x:100,y:75},{x:100,y:70},{x:100,y:65},{x:100,y:60},{x:100,y:55},{x:100,y:50},{x:100,y:45},{x:100,y:40},{x:100,y:35},{x:100,y:30},{x:100,y:25},{x:100,y:20},{x:100,y:15},{x:100,y:10},{x:100,y:5},{x:100,y:0},{x:100,y:-5},{x:100,y:-10},{x:100,y:-15},{x:100,y:-20},{x:100,y:-25},{x:100,y:-30},{x:100,y:-35},{x:100,y:-40},{x:100,y:-45},{x:100,y:-50},{x:100,y:-55},{x:100,y:-60},{x:100,y:-65},{x:100,y:-70},{x:100,y:-75},{x:100,y:-80},{x:100,y:-85},{x:100,y:-90},{x:100,y:-95},{x:100,y:-100},{x:100,y:-105},{x:100,y:-110},{x:100,y:-115},{x:100,y:-120},{x:100,y:-125},{x:100,y:-130},{x:100,y:-135},{x:100,y:-140},{x:100,y:-145},{x:100,y:-150},{x:95,y:-150},{x:90,y:-150},{x:85,y:-150},{x:80,y:-150},{x:75,y:-150},{x:70,y:-150},{x:65,y:-150},{x:60,y:-150},{x:55,y:-150},{x:50,y:-150},{x:45,y:-150},{x:40,y:-150},{x:35,y:-150},{x:30,y:-150},{x:25,y:-150},{x:20,y:-150},{x:15,y:-150},{x:10,y:-150},{x:5,y:-150},{x:0,y:-150},{x:-5,y:-150},{x:-10,y:-150},{x:-15,y:-150},{x:-20,y:-150},{x:-25,y:-150},{x:-30,y:-150},{x:-35,y:-150},{x:-40,y:-150},{x:-45,y:-150},{x:-50,y:-150},{x:-50,y:-145},{x:-50,y:-140},{x:-50,y:-135},{x:-50,y:-130},{x:-50,y:-125},{x:-50,y:-120},{x:-50,y:-115},{x:-50,y:-110},{x:-50,y:-105},{x:-50,y:-100},{x:-50,y:-95},{x:-50,y:-90},{x:-50,y:-85},{x:-50,y:-80},{x:-50,y:-75},{x:-50,y:-70},{x:-50,y:-65},{x:-50,y:-60},{x:-50,y:-55},{x:-50,y:-50},{x:-45,y:-50},{x:-40,y:-50},{x:-35,y:-50},{x:-30,y:-50},{x:-25,y:-50},{x:-20,y:-50},{x:-15,y:-50},{x:-10,y:-50},{x:-5,y:-50},{x:0,y:-50},{x:0,y:-55},{x:0,y:-60},{x:0,y:-65},{x:0,y:-70},{x:0,y:-75},{x:0,y:-80},{x:0,y:-85},{x:0,y:-90},{x:0,y:-95},{x:0,y:-100},{x:0,y:-105},{x:0,y:-110},{x:0,y:-115},{x:0,y:-120},{x:0,y:-125},{x:0,y:-130},{x:0,y:-135},{x:0,y:-140},{x:0,y:-145},{x:0,y:-150},{x:-5,y:-150},{x:-10,y:-150},{x:-15,y:-150},{x:-20,y:-150},{x:-25,y:-150},{x:-30,y:-150},{x:-35,y:-150},{x:-40,y:-150},{x:-45,y:-150},{x:-50,y:-150},{x:-55,y:-150},{x:-60,y:-150},{x:-65,y:-150},{x:-70,y:-150},{x:-75,y:-150},{x:-80,y:-150},{x:-85,y:-150},{x:-90,y:-150},{x:-95,y:-150},{x:-100,y:-150},{x:-105,y:-150},{x:-110,y:-150},{x:-115,y:-150},{x:-120,y:-150},{x:-125,y:-150},{x:-130,y:-150},{x:-135,y:-150},{x:-140,y:-150},{x:-145,y:-150},{x:-150,y:-150},{x:-150,y:-145},{x:-150,y:-140},{x:-150,y:-135},{x:-150,y:-130},{x:-150,y:-125},{x:-150,y:-120},{x:-150,y:-115},{x:-150,y:-110},{x:-150,y:-105},{x:-150,y:-100},{x:-150,y:-95},{x:-150,y:-90},{x:-150,y:-85},{x:-150,y:-80},{x:-150,y:-75},{x:-150,y:-70},{x:-150,y:-65},{x:-150,y:-60},{x:-150,y:-55},{x:-150,y:-50},{x:-150,y:-45},{x:-150,y:-40},{x:-150,y:-35},{x:-150,y:-30},{x:-150,y:-25},{x:-150,y:-20},{x:-150,y:-15},{x:-150,y:-10},{x:-150,y:-5},{x:-150,y:0},{x:-150,y:5},{x:-150,y:10},{x:-150,y:15},{x:-150,y:20},{x:-150,y:25},{x:-150,y:30},{x:-150,y:35},{x:-150,y:40},{x:-150,y:45},{x:-150,y:50},{x:-150,y:55},{x:-150,y:60},{x:-150,y:65},{x:-150,y:70},{x:-150,y:75},{x:-150,y:80},{x:-150,y:85},{x:-150,y:90},{x:-150,y:95},{x:-150,y:100},{x:-150,y:105},{x:-150,y:110},{x:-150,y:115},{x:-150,y:120},{x:-150,y:125},{x:-150,y:130},{x:-150,y:135},{x:-150,y:140},{x:-150,y:145},{x:-150,y:150},{x:-145,y:150},{x:-140,y:150},{x:-135,y:150},{x:-130,y:150},{x:-125,y:150},{x:-120,y:150},{x:-115,y:150},{x:-110,y:150},{x:-105,y:150},{x:-100,y:150},{x:-100,y:145},{x:-100,y:140},{x:-100,y:135},{x:-100,y:130},{x:-100,y:125},{x:-100,y:120},{x:-100,y:115},{x:-100,y:110},{x:-100,y:105},{x:-100,y:100},{x:-95,y:100},{x:-90,y:100},{x:-85,y:100},{x:-80,y:100},{x:-75,y:100},{x:-70,y:100},{x:-65,y:100},{x:-60,y:100},{x:-55,y:100},{x:-50,y:100},{x:-50,y:105},{x:-50,y:110},{x:-50,y:115},{x:-50,y:120},{x:-50,y:125},{x:-50,y:130},{x:-50,y:135},{x:-50,y:140},{x:-50,y:145},{x:-50,y:150},{x:-45,y:150},{x:-40,y:150},{x:-35,y:150},{x:-30,y:150},{x:-25,y:150},{x:-20,y:150},{x:-15,y:150},{x:-10,y:150},{x:-5,y:150},{x:0,y:150},{x:0,y:145},{x:0,y:140},{x:0,y:135},{x:0,y:130},{x:0,y:125},{x:0,y:120},{x:0,y:115},{x:0,y:110},{x:0,y:105},{x:0,y:100}],
      [{x:5,y:100},{x:10,y:100},{x:15,y:100},{x:20,y:100},{x:25,y:100},{x:30,y:100},{x:35,y:100},{x:40,y:100},{x:45,y:100},{x:50,y:100},{x:50,y:105},{x:50,y:110},{x:50,y:115},{x:50,y:120},{x:50,y:125},{x:50,y:130},{x:50,y:135},{x:50,y:140},{x:50,y:145},{x:50,y:150},{x:55,y:150},{x:60,y:150},{x:65,y:150},{x:70,y:150},{x:75,y:150},{x:80,y:150},{x:85,y:150},{x:90,y:150},{x:95,y:150},{x:100,y:150},{x:100,y:145},{x:100,y:140},{x:100,y:135},{x:100,y:130},{x:100,y:125},{x:100,y:120},{x:100,y:115},{x:100,y:110},{x:100,y:105},{x:100,y:100}]
    )`,
    enunciado: 'COMPLETAR 1',
    consignaInicial: 'COMPLETAR 2',
    debeFelicitarse: true,
    bloques: ['MoverArribaDibujando','MoverAbajoDibujando','MoverDerechaDibujando','MoverIzquierdaDibujando']
  },
  {
    id: 153,
    grupoId: 6,
    nombre: '3.2.1b',
    titulo: 'Desafío 3.2.1b',
    escena: `new EscenaCoty(-50,0,
      [ [{x:-55,y:50},{x:-60,y:50},{x:-65,y:50},{x:-70,y:50},{x:-75,y:50},{x:-80,y:50},{x:-85,y:50},{x:-90,y:50},{x:-95,y:50},{x:-100,y:50},{x:-105,y:50},{x:-110,y:50},{x:-115,y:50},{x:-120,y:50},{x:-125,y:50},{x:-130,y:50},{x:-135,y:50},{x:-140,y:50},{x:-145,y:50},{x:-150,y:50},{x:-150,y:45},{x:-150,y:40},{x:-150,y:35},{x:-150,y:30},{x:-150,y:25},{x:-150,y:20},{x:-150,y:15},{x:-150,y:10},{x:-150,y:5},{x:-150,y:0},{x:-145,y:0},{x:-140,y:0},{x:-135,y:0},{x:-130,y:0},{x:-125,y:0},{x:-120,y:0},{x:-115,y:0},{x:-110,y:0},{x:-105,y:0},{x:-100,y:0},{x:-95,y:0},{x:-90,y:0},{x:-85,y:0},{x:-80,y:0},{x:-75,y:0},{x:-70,y:0},{x:-65,y:0},{x:-60,y:0},{x:-55,y:0},{x:-50,y:0},{x:-102,y:0},{x:-105,y:0},{x:-107,y:0},{x:-110,y:0},{x:-112,y:0},{x:-115,y:0},{x:-117,y:0},{x:-120,y:0},{x:-122,y:0},{x:-125,y:0},{x:-120,y:0},{x:-115,y:0},{x:-110,y:0},{x:-105,y:0},{x:-100,y:0},{x:-95,y:0},{x:-90,y:0},{x:-85,y:0},{x:-80,y:0},{x:-75,y:0},{x:-75,y:-5},{x:-75,y:-10},{x:-75,y:-15},{x:-75,y:-20},{x:-75,y:-25},{x:-75,y:-30},{x:-75,y:-35},{x:-75,y:-40},{x:-75,y:-45},{x:-75,y:-50},{x:-75,y:-55},{x:-75,y:-60},{x:-75,y:-65},{x:-75,y:-70},{x:-75,y:-75},{x:-75,y:-80},{x:-75,y:-85},{x:-75,y:-90},{x:-75,y:-95},{x:-75,y:-100},{x:-80,y:-100},{x:-85,y:-100},{x:-90,y:-100},{x:-95,y:-100},{x:-100,y:-100},{x:-105,y:-100},{x:-110,y:-100},{x:-115,y:-100},{x:-120,y:-100},{x:-125,y:-100},{x:-125,y:-95},{x:-125,y:-90},{x:-125,y:-85},{x:-125,y:-80},{x:-125,y:-75},{x:-125,y:-70},{x:-125,y:-65},{x:-125,y:-60},{x:-125,y:-55},{x:-125,y:-50},{x:-125,y:-45},{x:-125,y:-40},{x:-125,y:-35},{x:-125,y:-30},{x:-125,y:-25},{x:-125,y:-20},{x:-125,y:-15},{x:-125,y:-10},{x:-125,y:-5},{x:-125,y:0}],
        [{x:-25,y:0},{x:-20,y:0},{x:-15,y:0},{x:-10,y:0},{x:-5,y:0},{x:0,y:0},{x:5,y:0},{x:10,y:0},{x:15,y:0},{x:20,y:0},{x:25,y:0},{x:25,y:-5},{x:25,y:-10},{x:25,y:-15},{x:25,y:-20},{x:25,y:-25},{x:25,y:-30},{x:25,y:-35},{x:25,y:-40},{x:25,y:-45},{x:25,y:-50},{x:25,y:-55},{x:25,y:-60},{x:25,y:-65},{x:25,y:-70},{x:25,y:-75},{x:25,y:-80},{x:25,y:-85},{x:25,y:-90},{x:25,y:-95},{x:25,y:-100},{x:20,y:-100},{x:15,y:-100},{x:10,y:-100},{x:5,y:-100},{x:0,y:-100},{x:-5,y:-100},{x:-10,y:-100},{x:-15,y:-100},{x:-20,y:-100},{x:-25,y:-100},{x:-25,y:-95},{x:-25,y:-90},{x:-25,y:-85},{x:-25,y:-80},{x:-25,y:-75},{x:-25,y:-70},{x:-25,y:-65},{x:-25,y:-60},{x:-25,y:-55},{x:-25,y:-50},{x:-25,y:-45},{x:-25,y:-40},{x:-25,y:-35},{x:-25,y:-30},{x:-25,y:-25},{x:-25,y:-20},{x:-25,y:-15},{x:-25,y:-10},{x:-25,y:-5},{x:-25,y:0}],
        [{x:80,y:0},{x:85,y:0},{x:90,y:0},{x:95,y:0},{x:100,y:0},{x:105,y:0},{x:110,y:0},{x:115,y:0},{x:120,y:0},{x:125,y:0},{x:125,y:-5},{x:125,y:-10},{x:125,y:-15},{x:125,y:-20},{x:125,y:-25},{x:125,y:-30},{x:125,y:-35},{x:125,y:-40},{x:125,y:-45},{x:125,y:-50},{x:125,y:-55},{x:125,y:-60},{x:125,y:-65},{x:125,y:-70},{x:125,y:-75},{x:125,y:-80},{x:125,y:-85},{x:125,y:-90},{x:125,y:-95},{x:125,y:-100},{x:120,y:-100},{x:115,y:-100},{x:110,y:-100},{x:105,y:-100},{x:100,y:-100},{x:95,y:-100},{x:90,y:-100},{x:85,y:-100},{x:80,y:-100},{x:75,y:-100},{x:75,y:-95},{x:75,y:-90},{x:75,y:-85},{x:75,y:-80},{x:75,y:-75},{x:75,y:-70},{x:75,y:-65},{x:75,y:-60},{x:75,y:-55},{x:75,y:-50},{x:75,y:-45},{x:75,y:-40},{x:75,y:-35},{x:75,y:-30},{x:75,y:-25},{x:75,y:-20},{x:75,y:-15},{x:75,y:-10},{x:75,y:-5},{x:75,y:0},{x:73,y:0},{x:70,y:0},{x:68,y:0},{x:65,y:0},{x:63,y:0},{x:60,y:0},{x:58,y:0},{x:55,y:0},{x:53,y:0},{x:50,y:0},{x:55,y:0},{x:60,y:0},{x:65,y:0},{x:70,y:0},{x:75,y:0},{x:80,y:0},{x:85,y:0},{x:90,y:0},{x:95,y:0},{x:100,y:0},{x:105,y:0},{x:110,y:0},{x:115,y:0},{x:120,y:0},{x:125,y:0},{x:130,y:0},{x:135,y:0},{x:140,y:0},{x:145,y:0},{x:150,y:0},{x:150,y:5},{x:150,y:10},{x:150,y:15},{x:150,y:20},{x:150,y:25},{x:150,y:30},{x:150,y:35},{x:150,y:40},{x:150,y:45},{x:150,y:50},{x:145,y:50},{x:140,y:50},{x:135,y:50},{x:130,y:50},{x:125,y:50},{x:120,y:50},{x:115,y:50},{x:110,y:50},{x:105,y:50},{x:100,y:50},{x:95,y:50},{x:90,y:50},{x:85,y:50},{x:80,y:50},{x:75,y:50},{x:70,y:50},{x:65,y:50},{x:60,y:50},{x:55,y:50},{x:50,y:50}]
      ],
      [{x:-45,y:0},{x:-40,y:0},{x:-35,y:0},{x:-30,y:0},{x:-25,y:0},{x:-20,y:0},{x:-15,y:0},{x:-10,y:0},{x:-5,y:0},{x:0,y:0},{x:5,y:0},{x:10,y:0},{x:15,y:0},{x:20,y:0},{x:25,y:0},{x:30,y:0},{x:35,y:0},{x:40,y:0},{x:45,y:0},{x:50,y:0},{x:50,y:5},{x:50,y:10},{x:50,y:15},{x:50,y:20},{x:50,y:25},{x:50,y:30},{x:50,y:35},{x:50,y:40},{x:50,y:45},{x:50,y:50},{x:45,y:50},{x:40,y:50},{x:35,y:50},{x:30,y:50},{x:25,y:50},{x:20,y:50},{x:15,y:50},{x:10,y:50},{x:5,y:50},{x:0,y:50},{x:-5,y:50},{x:-10,y:50},{x:-15,y:50},{x:-20,y:50},{x:-25,y:50},{x:-30,y:50},{x:-35,y:50},{x:-40,y:50},{x:-45,y:50},{x:-50,y:50},{x:-50,y:45},{x:-50,y:40},{x:-50,y:35},{x:-50,y:30},{x:-50,y:25},{x:-50,y:20},{x:-50,y:15},{x:-50,y:10},{x:-50,y:5},{x:-50,y:0}]
    )`,
    enunciado: 'COMPLETAR 1',
    consignaInicial: 'COMPLETAR 2',
    debeFelicitarse: true,
    bloques: ['MoverArribaDibujando','MoverAbajoDibujando','MoverDerechaDibujando','MoverIzquierdaDibujando']
  },
  {
    id: 154,
    grupoId: 6,
    nombre: '3.2.2a',
    titulo: 'Desafío 3.2.2a',
    escena: `new EscenaCoty(0,100,
      [],
      []
    )`,
    enunciado: 'COMPLETAR 1',
    consignaInicial: 'COMPLETAR 2',
    debeFelicitarse: true,
    bloques: ['MoverArribaDibujando','MoverAbajoDibujando','MoverDerechaDibujando','MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda']
  },
  {
    id: 152,
    grupoId: 6,
    nombre: 'CotyDibujoLibre',
    titulo: '¡Coty dibuja libre!',
    escena: `new EscenaCoty(-50,50,[],[])`,
    enunciado: 'En esta actividad vas a poder realizar el dibujo que más te guste',
    consignaInicial: 'Incluímos todos los bloques posibles, para que puedas dar rienda suelta a tus conocimientos.',
    debeFelicitarse: true,
    bloques: ['MoverArribaDibujando','MoverAbajoDibujando','MoverDerechaDibujando','MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda', 'Procedimiento', 'Repetir', 'DibujarLado', 'GirarGrados', 'Numero', 'OpAritmetica']
  },


/*  {
    id: 136,
    grupoId: 5,
    nombre: '',
    titulo: 'Próximamente: más actividades',
    deshabilitado: true,
  },*/

	{
		id: 201,
		grupoId: 11,
		nombre: '2.1.2a',
		titulo: 'Desafío 2.1.2a (Duba)',
		escena: `new EscenaDuba([
      [
        ['O', 'O', 'O', 'O', 'O', 'O'],
        ['O', ' ', ' ', ' ', 'O', ' '],
        [' ', 'A', ' ', ' ', 'P', ' '],
        [' ', ' ', ' ', 'O', ' ', ' '],
        ['O', 'O', 'O', 'O', ' ', 'O'],      
      ],
		])`,
		enunciado: '[Completar]',
		consignaInicial: '[Completar]',
		debeFelicitarse: true,
		bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ]
	},
	{
		id: 202,
		grupoId: 11,
		nombre: '2.1.2b',
		titulo: 'Desafío 2.1.2b (Duba)',
		escena: `new EscenaDuba([
      [
        ['O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O'],
        ['O', ' ', 'O', ' ', 'P', 'O'],
        ['O', ' ', 'A', ' ', 'O', 'O'],
        ['O', 'O', ' ', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O'],
      ],
		])`,
		enunciado: '[Completar]',
		consignaInicial: '[Completar]',
		debeFelicitarse: true,
		bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ]
	},
	{
		id: 203,
		grupoId: 11,
		nombre: '2.1.2c',
		titulo: 'Desafío 2.1.2c (Duba)',
		escena: `new EscenaDuba([
      [
        ['O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'A', 'O', ' ', ' ', 'O'],
        ['O', ' ', ' ', ' ', 'P', 'O'],
        ['O', ' ', 'O', ' ', ' ', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O'],
      ],
		])`,
		enunciado: '[Completar]',
		consignaInicial: '[Completar]',
		debeFelicitarse: true,
		bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ]
  },
  {
		id: 204,
		grupoId: 11,
		nombre: '2.1.2d',
		titulo: 'Desafío 2.1.2d (Duba)',
		escena: `new EscenaDuba([
      [
        ['O', 'O', 'O', 'O', 'O', 'O'],
        ['O', ' ', 'A', 'O', 'O', 'O'],
        ['O', 'O', ' ', 'O', 'O', 'O'],
        ['O', 'O', ' ', ' ', ' ', 'O'],
        ['O', 'O', 'O', 'P', ' ', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O'],      
      ],
		])`,
		enunciado: '[Completar]',
		consignaInicial: '[Completar]',
		debeFelicitarse: true,
		bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ]
  },
  {
		id: 205,
		grupoId: 11,
		nombre: '2.1.2e',
		titulo: 'Desafío 2.1.2e (Duba)',
		escena: `new EscenaDuba([
      [
        ['O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', ' ', 'O', ' ', 'O'],
        ['O', ' ', 'A', ' ', ' ', 'O'],
        ['O', ' ', ' ', 'O', ' ', 'O'],
        ['O', 'O', ' ', ' ', 'P', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O'],
      ]
		])`,
		enunciado: '[Completar]',
		consignaInicial: '[Completar]',
		debeFelicitarse: true,
		bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ]
  },
  {
		id: 206,
		grupoId: 11,
		nombre: '2.1.2f',
		titulo: 'Desafío 2.1.2f (Duba)',
		escena: `new EscenaDuba([
      [
        ['O', 'O', 'O', 'O', 'O', 'O'],
        ['O', ' ', ' ', ' ', ' ', 'O'],
        ['O', ' ', 'O', 'P', ' ', 'O'],
        ['O', 'A', 'O', ' ', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O'],
      ],
		])`,
		enunciado: '[Completar]',
		consignaInicial: '[Completar]',
		debeFelicitarse: true,
		bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ]
  },
  {
		id: 207,
		grupoId: 11,
		nombre: '2.2.3a',
		titulo: 'Desafío 2.2.3a (Duba)',
		escena: `new EscenaDuba([
      [
        ['O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'P', 'O', ' ', ' ', 'O'],
        ['O', ' ', 'O', ' ', ' ', ' '],
        ['O', ' ', ' ', ' ', 'O', 'A'],
        ['O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O'],
      ],
		])`,
		enunciado: '[Completar]',
		consignaInicial: '[Completar]',
		debeFelicitarse: true,
		bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ],
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaAbajo">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`,
  },
  {
		id: 208,
		grupoId: 11,
		nombre: '2.2.3b',
		titulo: 'Desafío 2.2.3b (Duba)',
		escena: `new EscenaDuba([
      [
        ['O', 'O', 'O', 'O', 'O', 'O'],
        ['O', ' ', ' ', 'O', 'O', 'O'],
        ['O', ' ', 'P', 'O', 'O', 'O'],
        ['O', ' ', ' ', 'O', 'O', 'O'],
        ['O', ' ', ' ', ' ', 'A', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O'],      
      ],
		])`,
		enunciado: '[Completar]',
		consignaInicial: '[Completar]',
		debeFelicitarse: true,
		bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ],
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`,
  },
  {
		id: 209,
		grupoId: 11,
		nombre: '2.2.3c',
		titulo: 'Desafío 2.2.3c (Duba)',
		escena: `new EscenaDuba([
      [
        ['O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'P', 'O', 'A', 'O', 'O'],
        ['O', ' ', 'O', ' ', 'O', 'O'],
        ['O', ' ', ' ', ' ', 'O', 'O'],
        ['O', ' ', ' ', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O'],
      ],
		])`,
		enunciado: '[Completar]',
		consignaInicial: '[Completar]',
		debeFelicitarse: true,
		bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ],
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaAbajo">
      <next>
      <block type="MoverACasillaAbajo">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`,
  },
  {
		id: 210,
		grupoId: 11,
		nombre: '2.2.3d',
		titulo: 'Desafío 2.2.3d (Duba)',
		escena: `new EscenaDuba([
      [
        ['O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', ' ', ' ', ' ', 'O'],
        ['O', ' ', 'P', ' ', ' ', 'O'],
        ['O', ' ', 'O', 'O', 'O', 'O'],
        ['O', ' ', ' ', 'A', ' ', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O'],  
      ],
		])`,
		enunciado: '[Completar]',
		consignaInicial: '[Completar]',
		debeFelicitarse: true,
		bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ],
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaDerecha">
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`,
  },
  {
    id: 211,
    grupoId: 12,
    nombre: '3.1.3a',
    titulo: 'Desafío 3.1.3a (Duba)',
    escena: `new EscenaDuba([
      [
        [' ', 'O', 'O', 'O', ' ', ' ', ' ', ' '],
        [' ', 'O', 'O', 'O', 'O', ' ', ' ', ' '],
        ['O', 'O', ' ', 'O', 'O', ' ', ' ', ' '],
        ['O', 'O', ' ', ' ', ' ', ' ', ' ', ' '],
        ['A', ' ', ' ', ' ', ' ', ' ', ' ', 'P'],
        [' ', ' ', 'O', ' ', 'O', ' ', ' ', ' '],
        [' ', ' ', 'O', 'O', 'O', 'O', 'O', 'O'],
        [' ', ' ', ' ', 'O', 'O', 'O', 'O', 'O'],
      ],
		])`,
    enunciado: '[Completar]',
    consignaInicial: '[Completar]',
    debeFelicitarse: true,
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'repetir'
    ]
  },
  {
    id: 212,
    grupoId: 12,
    nombre: '3.1.3b',
    titulo: 'Desafío 3.1.3b (Duba)',
    escena: `new EscenaDuba([
      [
        ['O', 'O', ' ', 'O', 'O', ' ', ' ', ' '],
        ['O', 'P', ' ', 'O', 'O', ' ', ' ', ' '],
        ['O', ' ', ' ', 'O', ' ', ' ', ' ', ' '],
        ['O', ' ', 'O', 'O', ' ', ' ', ' ', ' '],
        ['O', ' ', 'O', 'O', 'O', ' ', ' ', ' '],
        [' ', ' ', 'O', 'O', 'O', 'O', ' ', ' '],
        [' ', ' ', 'O', 'O', 'O', 'O', 'O', 'O'],
        [' ', ' ', 'A', 'O', 'O', 'O', 'O', 'O'],
      ],
		])`,
    enunciado: '[Completar]',
    consignaInicial: '[Completar]',
    debeFelicitarse: true,
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'repetir'
    ]
  },
  {
    id: 213,
    grupoId: 12,
    nombre: '3.1.3c',
    titulo: 'Desafío 3.1.3c (Duba)',
    escena: `new EscenaDuba([
      [
        [' ', ' ', ' ', 'O', 'O', ' ', ' ', 'O'],
        ['O', 'O', ' ', 'O', ' ', ' ', ' ', 'O'],
        ['A', 'O', 'O', 'O', ' ', ' ', 'O', 'O'],
        [' ', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        [' ', 'O', 'O', 'O', ' ', 'O', 'O', 'O'],
        [' ', ' ', ' ', ' ', ' ', ' ', 'P', 'O'],
        ['O', 'O', ' ', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', ' ', ' ', 'O', 'O', 'O', 'O'],
      ],
		])`,
    enunciado: '[Completar]',
    consignaInicial: '[Completar]',
    debeFelicitarse: true,
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'repetir'
    ]
  },
  {
    id: 214,
    grupoId: 12,
    nombre: '3.2.3a',
    titulo: 'Desafío 3.2.3a (Duba)',
    escena: `new EscenaDuba([
      [
        [' ', ' ', ' ', ' ', 'O', 'O', 'O', 'O'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'O'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'P', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', 'O', 'A', ' '],
        [' ', ' ', ' ', ' ', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'], 
      ],
		])`,
    enunciado: '[Completar]',
    consignaInicial: '[Completar]',
    debeFelicitarse: true,
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'repetir'
    ],
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaArriba">
      <next>
      <block type="repetir">
        <value name="count">
          <block type="math_number">
            <field name="NUM">4</field>
          </block>
        </value>
        <statement name="block">
          <block type="MoverACasillaIzquierda">
          </block>
        </statement>
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`,
  },
  {
    id: 215,
    grupoId: 12,
    nombre: '3.2.3b',
    titulo: 'Desafío 3.2.3b (Duba)',
    escena: `new EscenaDuba([
      [
        ['O', ' ', ' ', ' ', 'O', 'O', 'O', 'O'],
        [' ', 'A', ' ', ' ', ' ', ' ', 'O', ' '],
        ['O', 'O', ' ', ' ', ' ', ' ', ' ', ' '],
        ['O', 'O', 'O', ' ', ' ', ' ', ' ', ' '],
        ['O', 'O', 'O', ' ', ' ', ' ', ' ', ' '],
        ['O', 'O', 'O', 'O', 'O', ' ', 'P', ' '],
        ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      ],
		])`,
    enunciado: '[Completar]',
    consignaInicial: '[Completar]',
    debeFelicitarse: true,
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'repetir'
    ],
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="repetir">
        <value name="count">
          <block type="math_number">
            <field name="NUM">5</field>
          </block>
        </value>
        <statement name="block">
          <block type="MoverACasillaDerecha">
          <next>
          <block type="MoverACasillaAbajo">
          </block>
          </next>
          </block>
        </statement>
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`,
  },
  {
    id: 216,
    grupoId: 13,
    nombre: '4.1.3a',
    titulo: 'Desafío 4.1.3a (Duba)',
    escena: `new EscenaDuba([
      [
        ['A', 'P?'], 
      ],
		], 0, 1)`,
    enunciado: '[Completar]',
    consignaInicial: '[Completar]',
    debeFelicitarse: true,
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'si',
      'HayChurrasco'
    ],
  },
  {
    id: 217,
    grupoId: 13,
    nombre: '4.1.3b',
    titulo: 'Desafío 4.1.3b (Duba)',
    escena: `new EscenaDuba([
      [
        ['A', 'P?', 'P?'], 
      ],
		], 0, 2)`,
    enunciado: '[Completar]',
    consignaInicial: '[Completar]',
    debeFelicitarse: true,
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'si',
      'HayChurrasco'
    ],
  },
  {
    id: 218,
    grupoId: 13,
    nombre: '4.1.4b',
    titulo: 'Desafío 4.1.4b (Duba)',
    escena: `new EscenaDuba([
      [
        ['O', 'O', 'O', 'O', 'O'],
        ['O', 'A', ' ', 'P', 'O'],
        ['O', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O'],
      ],
      [
        ['O', 'O', 'O', 'O', 'O'],
        ['O', 'A', 'O', 'O', 'O'],
        ['O', ' ', 'O', 'O', 'O'],
        ['O', 'P', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O'],
      ],
		])`,
    enunciado: '[Completar]',
    consignaInicial: '[Completar]',
    debeFelicitarse: true,
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'si',
      'sino',
      'HayObstaculoArriba',
      'HayObstaculoAbajo',
      'HayObstaculoIzquierda',
      'HayObstaculoDerecha'                  
    ],
  },
  {
    id: 219,
    grupoId: 13,
    nombre: '4.1.4c',
    titulo: 'Desafío 4.1.4c (Duba)',
    escena: `new EscenaDuba([
      [
        ['O', 'O', 'O', 'O', 'O'],
        [' ', ' ', 'O', ' ', ' '],
        ['A', ' ', ' ', ' ', 'P'],
        ['O', 'O', 'O', 'O', 'O'],
      ],
      [
        ['O', 'O', 'O', 'O', 'O'],
        [' ', ' ', ' ', ' ', ' '],
        ['A', ' ', 'O', ' ', 'P'],
        ['O', 'O', 'O', 'O', 'O'],
      ],
		])`,
    enunciado: '[Completar]',
    consignaInicial: '[Completar]',
    debeFelicitarse: true,
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'si',
      'sino',
      'HayObstaculoArriba',
      'HayObstaculoAbajo',
      'HayObstaculoIzquierda',
      'HayObstaculoDerecha'
    ],
  },
  {
    id: 220,
    grupoId: 13,
    nombre: '4.2.1a',
    titulo: 'Desafío 4.2.1a (Duba)',
    escena: `new EscenaDuba([
      [
        ['A', ' ', ' ', ' ', ' ', ' ', ' ', 'P?'], 
      ],
    ], 0, 7)`,
    enunciado: '[Completar]',
    consignaInicial: '[Completar]',
    debeFelicitarse: true,
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'repetir',
      'si',
      'sino',
      'HayChurrasco'
    ],
  },
  {
    id: 221,
    grupoId: 13,
    nombre: '4.2.1b',
    titulo: 'Desafío 4.2.1b (Duba)',
    escena: `new EscenaDuba([
      [
        ['A', 'P?', 'P?', 'P?', 'P?', 'P?', 'P?', 'P?'], 
      ]
    ], 0, 7)`,
    enunciado: '[Completar]',
    consignaInicial: '[Completar]',
    debeFelicitarse: true,
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'repetir',
      'si',
      'sino',
      'HayChurrasco'
    ],
  },
];
