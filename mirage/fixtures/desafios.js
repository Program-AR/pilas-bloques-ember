/**
 * Una actividad se define con el siguiente diccionario:
 * id: <obligatorio> Es el número por el cual se accederá al desafío en la URL.
 * nombre: <obligatorio> Es un segundo identificador único. Se usa para cosas como para chequear que la solución cargada sea de este desafío y no otro.
 * título: <obligatorio> Es el título visible del desafío en la lista del libro y en la pantalla principal del desafío.
 * enunciado: <obligatorio> Es el enunciado del desafío. Es la descripción del objetivo del programa que debe realizar el alumno.
 * consignaInicial: Es una posible pista, el "Sabías qué". En general en Pilas Bloques suele aparecer cuando el desafío introduce un concepto nuevo.
 * escena: <obligatorio> Es un String que puede indicar o bien un nombre de clase, o bien EL STRING con un "new Escena..." que luego se PARSEARÁ como javascript para construir la escena de pilas-bloques-exercises asociada a este desafío.
 * debeFelicitarse: Es un booleano que indica si tiene sentido que el desafío chequee e informe al alumno la concreción exitosa de su programa. En una actividad de dibujo libre estaría en false.
 * bloques: <obligatorio> Es la lista de ids de bloque de Blockly que habrá en el toolbox de la actividad.
 * estiloToolbox: Tiene tres valores: 
 * * * "sinCategorias", lo que hace un toolbox aplanado, con los bloques directamente en el toolbox sin títulos ni clasificaciones. 
 * * * "desplegable", lo que hace un toolbox con categorías que al clickearlas muestra los bloques. Es el valor por defecto.
 * * * "aplanado", produce el mismo toolbox aplanado con los bloques visibles que "sinCategorias", pero con las categorías en labels. Al momento está sin implementar.
 */

/*jshint esversion: 6 */

export default [
  {
    id: 1,
    nombre: 'AlienTocaBoton',
    titulo: 'El alien toca el botón',
    enunciado: 'Ayudá a nuestro Alien a presionar el botón de su laboratorio. \r' +
      'Pistas: mirá las _primitivas_ disponibles. ¡Vas a tener que avanzar varias veces! :wink:',
    consignaInicial: 'Los bloques te permiten formar secuencias de acciones para resolver los desafíos que te proponemos en Pilas Bloques.',
    escena: 'AlienInicial',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'ApretarBoton']
  },
  {
    id: 2,
    nombre: 'ElGatoEnLaCalle', // sale de 'id' en 'app/actividades/actividadElGatoEnLaCalle.js'
    titulo: 'El gato en la calle', // sale de 'nombre' en 'app/actividades/actividadElGatoEnLaCalle.js'
    enunciado: 'Hacé que el gato avance un paso, se duerma, se despierte, salude y vuelva a su lugar.',
    consignaInicial: 'Se pueden crear nuevas acciones en Procedimientos definiendo nuevos bloques que incluyan otras acciones.',
    escena: 'ElGatoEnLaCalle',
    debeFelicitarse: true,
    bloques: ['Saludar', 'Avanzar', 'Volver', 'AbrirOjos', 'CerrarOjos', 'Acostarse', 'Pararse', 'Soniar', 'Procedimiento']
  },
  {
    id: 3,
    nombre: 'NoMeCansoDeSaltar',
    titulo: 'No me canso de saltar',
    enunciado: 'Ayudá al gato a quitarse la pereza saltando 30 veces seguidas. Pista: se puede resolver con menos de 30 bloques.',
    consignaInicial: 'El bloque Repetir permite elegir la cantidad de veces que se desea repetir una secuencia de acciones. Esto se llama "Repetición simple".',
    escena: 'NoMeCansoDeSaltar',
    debeFelicitarse: true,
    bloques: ['SaltarHablando', 'Procedimiento', 'Repetir']
  },
  {
    id: 4,
    nombre: 'ElMarcianoEnElDesierto',
    titulo: 'El marciano en el desierto',
    enunciado: 'El marciano está perdido en el desierto y necesita alimentarse de su comida favorita: ¡las manzanas! Ayudalo a cumplir su objetivo. Pista: Crear un procedimiento (bloque) para cada conjunto de manzanas',
    consignaInicial: 'Hay muchas formas de comer las manzanas. Podés empezar por las de la derecha, ¡o podés empezar por arriba! ¿Se te ocurre otra estrategia? Pensala siempre antes de programar',
    escena: 'ElMarcianoEnElDesierto',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'ComerManzana', 'Procedimiento', 'Repetir']
  },
  {
    id: 5,
    nombre: 'TitoEnciendeLuces',
    titulo: 'Tito enciende las luces',
    enunciado: 'Ayudá a Tito a encender todas las luces. \n' +
      'Pista: creá un procedimiento para prender todas las luces de una diagonal.',
    consignaInicial: 'Se puede crear un procedimiento una vez y usarlo todas las veces que quieras dentro de un programa.',
    escena: 'TitoEnciendeLuces',
    debeFelicitarse: true,
    bloques: ['EncenderLuz', 'MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'Procedimiento', 'Repetir']
  },
  {
    id: 6,
    nombre: 'ElAlienYLasTuercas',
    titulo: 'El alien y las tuercas',
    enunciado: 'Definí un programa para que el alien junte todas las tuercas. Pista: ¿El alien no puede moverse en diagonal? Podés crear tu propio procedimiento para que lo haga',
    escena: 'AlienLevantaTuercas',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'LevantaTuerca', 'Procedimiento', 'Repetir']
  },
  {
    id: 7,
    nombre: 'ElRecolectorDeEstrellas',
    titulo: 'El recolector de estrellas',
    enunciado: 'Ayudá a nuestro personaje a recolectar todas las estrellas. Pista: podés hacer un procedimiento que tome una fila de estrellas.',
    consignaInicial: 'Usar muchas veces un procedimiento te ahorra trabajo.',
    escena: 'ElRecolectorDeEstrellas',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaArriba', 'VolverABordeIzquierdo', 'TomarEstrella', 'Procedimiento', 'Repetir']
  },
  {
    id: 8,
    nombre: 'MariaLaComeSandias',
    titulo: 'María y las sandías',
    enunciado: 'María necesita comer todas las sandías de la cuadrícula. Pensá de qué manera puede hacerlo creando los bloques necesarios. Pista: la forma en que las sandías están distribuidas en la cuadrícula, es clave para crear la menor cantidad de procedimientos.',
    escena: 'MariaLaComeSandias',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'MorderSandia', 'Procedimiento', 'Repetir']
  },
  {
    id: 9,
    nombre: 'AlimentandoALosPeces',
    titulo: 'Alimentando a los peces',
    enunciado: 'Nuestro buzo debe alimentar con lombrices a los 7 peces que hay en esta escena. Buscá primero a las lombrices y luego pasá por cada pez alimentándolo. Pista: ¿Cuántas partes debería tener tu estrategia?',
    consignaInicial: '',
    escena: 'AlimentandoALosPeces',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'AlimentarPez', 'AgarrarComida', 'Procedimiento', 'Repetir']
  },
  {
    id: 10,
    nombre: 'InstalandoJuegos',
    titulo: 'Instalando juegos',
    enunciado: 'Ramiro tiene que instalar un juego en 3 compus para divertirse con sus amigos. Los pasos para instalarlo en cada una son: encenderla, escribir la contraseña ("ABC"), instalar el juego y apagar la máquina. Pista: aprovechá que en cada compu hay que hacer el mismo trabajo.',
    escena: 'InstalandoJuegos',
    debeFelicitarse: true,
    bloques: ['PasarASiguienteComputadora', 'PrenderComputadora', 'ApagarComputadora', 'EscribirC', 'EscribirB', 'EscribirA', 'InstalarJuego', 'Repetir', 'Procedimiento'],
  },
  {
    id: 11,
    nombre: 'LaGranAventuraDelMarEncantado',
    titulo: 'La gran aventura del mar encantado',
    enunciado: 'Ayuda a la heroína a rescatar a su príncipe. Para ello debe superar en orden cada una de las siguientes pruebas:\n' +
      '1) Buscar la llave.\n' +
      '2) Abrir el cofre con la llave y tomar el sombrero mágico que está dentro.\n' +
      '3) Entregarle el sombrero al mago para recibir la espada a cambio.\n' +
      '4) Luchar con la espada contra el caballero oscuro.\n' +
      '5) Escapar en unicornio.',
    escena: 'LaGranAventuraDelMarEncantado',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'AgarrarLlave', 'AbrirCofre', 'DarSombrero', 'AtacarConEspada', 'EscaparEnUnicornio', 'Repetir', 'Procedimiento'],
  },
  {
    id: 12,
    nombre: 'ReparandoLaNave',
    titulo: 'Reparando la nave',
    enunciado: 'El marciano debe arreglar su nave para poder volver a su hogar. Para lograrlo debe llevar 3 unidades de carbón y 3 de hierro a la nave, pero no puede cargar más de una unidad a la vez.',
    escena: 'ReparandoLaNave',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'TomarHierro', 'TomarCarbon', 'Depositar', 'Escapar', 'Repetir', 'Procedimiento'],
  },
  {
    id: 13,
    nombre: 'ElMonoYLasBananas',
    titulo: 'El mono y las bananas',
    enunciado:
      '¿Podés hacer que el mono avance al casillero de enfrente?' +
      ' Si hay una banana debe comérsela. Si no, es feliz con sólo llegar. \n ' +
      'Ejecutá el programa varias veces para asegurarte que siempre funciona. \n' +
      'Pista: mirá la categoría "Sensores" y la categoría "Alternativas".',
    consignaInicial: 'El bloque "Si... Entonces" ejecuta una secuencia de instrucciones solamente cuando la condición es verdadera. Esto se llama "alternativa condicional".',
    escena: 'ElMonoYLasBananas',
    debeFelicitarse: true,
    bloques: ['ComerBanana', 'AvanzarMono', 'TocandoBanana', 'Repetir', 'Procedimiento', 'Si']
  },
  {
    id: 14,
    nombre: 'LaEleccionDelMono',
    titulo: 'La elección del mono',
    enunciado: '¿Podés ayudar nuevamente a nuestro mono? Esta vez tiene ' +
      'que comer la fruta que aparece, ya sea banana o manzana. \n' +
      'Ejecutá el programa varias veces para asegurarte que siempre funciona. \n' +
      'Pista: ésta vez no alcanza con el bloque "Si".',
    consignaInicial: 'Cuando sólo hay 2 opciones, alcanza con hacer una sola pregunta. En esos casos se puede usar el bloque "Si... si no".',
    escena: 'LaEleccionDelMono',
    debeFelicitarse: true,
    bloques: ['ComerBanana', 'ComerManzana', 'AvanzarMono', 'Procedimiento', 'Repetir', 'Si', 'SiNo', 'TocandoManzana', 'TocandoBanana']
  },
  {
    id: 15,
    nombre: 'LaberintoCorto',
    titulo: 'Laberinto corto',
    enunciado: 'Guiá al ratón para llegar a la meta. Para lograrlo, debe avanzar una casilla en la dirección que indica la flecha. Pista: mirá en la categoría "Sensores" qué preguntas podés hacer.',
    escena: 'LaberintoCorto',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'Repetir', 'Si', 'SiNo', 'MoverACasillaDerecha',
      'MoverACasillaAbajo', 'TocandoAbajo', 'TocandoDerecha'],
  },
  {
    id: 16,
    nombre: 'TresNaranjas',
    titulo: 'Tres naranjas',
    enunciado: 'El alien debe comer todos los gajos de naranja que aparezcan en las casillas violetas. ¡Pero no siempre aparecen en los mismos lugares ni la misma cantidad de naranjas! Pista: pensá primero cómo harías un procedimiento para comer una sola naranja si es que la hay.',
    escena: 'TresNaranjas',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'ComerNaranja', 'Repetir', 'Si', 'SiNo', 'TocandoNaranja']
  },
  {
    id: 17,
    nombre: 'TitoRecargado',
    titulo: 'Tito recargado',
    enunciado: 'Tito necesita encender las luces para poder conocer el camino... ¡Pero en cada ejecución cambian de lugar! Podés utlizar los procedimientos y bloques de control.',
    escena: 'TitoRecargado',
    debeFelicitarse: true,
    bloques: ['EncenderLuz', 'MoverACasillaAbajo', 'Procedimiento', 'Repetir', 'Si', 'SiNo', 'TocandoLuz']
  },
  {
    id: 18,
    nombre: 'LaberintoLargo',
    titulo: 'Laberinto largo',
    enunciado: 'Ayudá al ratón a salir del laberinto. A diferencia del laberinto anterior, aquí la cantidad de casillas que debe avanzar son muchas. ¿Cuántas? ¿Es siempre la misma? Pista: pensá primero cómo avanzar una sola casilla.',
    escena: 'LaberintoLargo',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaAbajo',
      'Repetir', 'Si', 'SiNo', 'TocandoAbajo', 'TocandoDerecha'],
  },
  {
    id: 19,
    nombre: 'SuperTito1',
    titulo: 'Súper Tito 1 ',
    enunciado: ' Ayudá a Tito a encender las luces. \n ¡Ojo! En todas las celdas hay una luz, pero no sabés cuántas celdas hay en cada ejecución.',
    consignaInicial: 'Hay nuevos bloques que pueden ayudarte a resolver el desafío de manera muy sencilla. ¡Aprovechalos!',
    escena: 'SuperTito1',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'EncenderLuz', 'MoverACasillaAbajo',
      'TocandoFinal', 'Repetir', 'Si', 'SiNo', 'Hasta'],
  },
  {
    id: 20,
    nombre: 'SuperTito2',
    titulo: 'Súper Tito 2',
    enunciado: 'Súper Tito debe encender todas las luces, pero a diferencia del desafío anterior, hay celdas sin luz. ¿Podrás utilizar el mismo procedimiento que en Súper Tito 1? \n',
    consignaInicial: 'El bloque "repetir hasta que" repite una secuencia de acciones hasta que se cumple una condición. Esto se llama "repetición condicional".',
    escena: 'SuperTito2',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'TocandoFinal', 'TocandoLuz', 'EncenderLuz',
      'MoverACasillaAbajo', 'Repetir', 'Si', 'SiNo', 'Hasta']
  },
  {
    id: 21,
    nombre: 'LaberintoConQueso',
    titulo: 'Laberinto con queso',
    enunciado: '¡El ratón está más hambriento que nunca! Guialo por el laberinto para que pueda comer todos los trozos de queso. Pista: antes de empezar, apretá varias veces el botón Ejecutar para conocer cómo varía el escenario.',
    consignaInicial: 'Es importante pensar si en algún momento se cumple la condición del bloque "Repetir hasta qué". Sino, ¡el programa podría no terminar nunca!',
    escena: 'LaberintoConQueso',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaAbajo',
      'ComerQueso', 'Repetir', 'Si', 'SiNo', 'Hasta', 'TocandoAbajo',
      'TocandoDerecha', 'TocandoFinCamino', 'TocandoQueso'],
  },
  {
    id: 22,
    nombre: 'ElDetectiveChaparro',
    titulo: 'El detective Chaparro',
    enunciado: 'El detective debe descubrir al culpable de un crimen. Comenzando por el primero de la izquierda, ¡interrogá a cada uno de los sospechosos hasta encontrar al culpable!',
    consignaInicial: 'El bloque "Repetir hasta que" nos permite terminar el programa cuando encontramos al culpable sin tener que interrogar a todos los sospechosos de la fila.',
    escena: 'ElDetectiveChaparro',
    debeFelicitarse: true,
    bloques: ['Repetir', 'Si', 'SiNo', 'Hasta', 'Procedimiento',
      'IrAlPrimerSospechoso', 'IrAlSiguienteSospechoso', 'InterrogarSospechoso',
      'EsCulpable'],
  },
  {
    id: 23,
    nombre: 'FutbolRobots',
    titulo: 'Fútbol para robots',
    enunciado: 'Ayudá a nuestro robot futbolista a patear todas las pelotas. ' +
      'Recordá siempre que una buena división en procedimientos puede ayudarte a encarar ' +
      'mejor el problema.',
    consignaInicial: 'El procedimiento que se defina debe considerar el escenario variable y ofrecer una solución con poca cantidad de bloques. Es importante tener en cuenta que la acción se repite varias veces y que la longitud de las filas varía.',
    escena: 'FutbolRobots',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaIzquierda', 'SiguienteFila',
      'PatearPelota', 'TocandoInicio', 'TocandoPelota', 'Repetir', 'Si',
      'SiNo', 'Hasta'],
  },
  {
    id: 24,
    nombre: 'PrendiendoLasCompus',
    titulo: 'Prendiendo las compus',
    enunciado:
      'Debemos prender todas las compus teniendo en cuenta que el ancho y el alto del escenario cambian en cada ejecución. Pista: pensá cómo harías para prender las compus de un solo lado del rectángulo y después repetilo para el resto de los lados.',
    escena: 'PrendiendoLasCompus',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'MoverACasillaDerecha', 'MoverACasillaArriba',
      'MoverACasillaAbajo', 'MoverACasillaIzquierda',
      'PrenderComputadora', 'EstoyEnEsquina'],
  },
  {
    id: 25,
    nombre: 'ElMonoQueSabeContar',
    titulo: 'El mono que sabe contar',
    enunciado: 'El mono debe recorrer todas las casillas y contar cuántas bananas y manzanas hay en total. Pista: primero pensá cómo contarías si hay una manzana o una banana en una casilla determinada. Luego pensá cómo harías para contar todas las frutas de una sola columna.',
    consignaInicial: 'Subdividir un problema grande en problemas más pequeños ayuda a comprender mejor cada una de las partes que lo componen. Además nos permite concentrarnos en resolver cuestiones más sencillas al problema original.',
    escena: 'ElMonoQueSabeContar',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaArriba', 'MoverACasillaAbajo',
      'SiguienteColumna', 'ContarBanana', 'ContarManzana',
      'TocandoBanana', 'TocandoManzana', 'Repetir', 'Si', 'SiNo',
      'Hasta', 'EstoySobreElInicio', 'EstoySobreElFinal']
  },
  {
    id: 26,
    nombre: 'ElSuperviaje',
    titulo: 'El Superviaje',
    enunciado: 'Nuestro superhéroe debe realizar su súper paseo matutino que consiste en recorrer una cierta cantidad de kilómetros que varía día a día (entre 15 y 45 km). ¡Lográ que nuestro súper amigo llegue siempre a destino sin pasarse! Pista: mirá en la categoría "Sensores" si hay algo que te pueda servir.',
    consignaInicial: 'Se puede usar un bloque "Repetir" con el valor de un sensor. Esto permite repetir una secuencia de código la cantidad de veces que indique el sensor',
    escena: 'SuperViaje',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'KmsTotales', 'Avanzar1km', 'RepetirVacio',
      'Repetir', 'Si', 'SiNo', 'Hasta'],
  },
  {
    id: 27,
    nombre: 'ElMonoCuentaDeNuevo',
    titulo: 'El mono cuenta de nuevo',
    enunciado: 'El mono tiene que contar otra vez las frutas, ¡pero ahora no puede verificar si ya llegó al final de una columna! ¿Habrá algún sensor que lo pueda ayudar?',
    consignaInicial: 'Una sensor nos permite obtener información que puede cambiar en cada ejecución del programa, incluso en una misma ejecución. Por ejemplo, el largo de cada columna varía dependiendo en qué columna esté parado el mono.',
    escena: 'ElMonoCuentaDeNuevo',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaArriba', 'MoverACasillaAbajo',
      'SiguienteColumna',
      'ContarBanana', 'ContarManzana', 'TocandoBanana',
      'TocandoManzana', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'EstoySobreElInicio', 'LargoColumnaActual']
  },
  {
    id: 28,
    nombre: 'ElPlanetaDeNano',
    titulo: 'El planeta de Nano',
    escena: 'ElPlanetaDeNano',
    enunciado: 'Ayudá a Nano a comer todas sus bananas. ¡Cuidado! No se puede bajar... \n ¡Tené en cuenta que el escenario no cambia, las bananas están siempre en las mismas casillas!',
    consignaInicial: 'A los procedimientos se les pueden agregar parámetros para que resulten más generales. Por ejemplo, si creamos los procedimientos "Comer 2 bananas a la derecha", "Comer 3 bananas a la derecha" y "Comer 4 bananas a la derecha", podemos reemplazar a los tres por un solo procedimiento que reciba como parámetro la cantidad de bananas que queremos comer a la derecha: "Comer a la derecha esta cantidad: [cantidad]". \n Para agregar un parámetro a un procedimiento nuevo, hay que hacer clic en la estrella que aparece al lado de "Definir" y luego arrastrar el bloque "nombre de entrada" a "entradas".',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaArriba',
      'VolverAlBordeIzquierdo', 'ComerBanana', 'RepetirVacio', 'Repetir', 'Si',
      'SiNo', 'Hasta', 'Numero'],
  },
  {
    id: 29,
    nombre: 'DibujandoAlCuadrado',
    titulo: 'Dibujando: Al cuadrado',
    enunciado: 'Dibujá un cuadrado que tenga 100 de lado.',
    consignaInicial: '',
    escena: 'DibujandoCuadrado',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero']
  },
  {
    id: 30,
    nombre: 'DibujandoRayuelaRobotica',
    titulo: 'Dibujando: Rayuela robótica',
    enunciado: 'Dibujá 5 cuadrados en fila, cada uno de lado 50, como muestra la figura sombreada.',
    consignaInicial: '',
    escena: 'Dibujando5CuadradosHorizontal',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'SaltarHaciaAdelante']
  },
  {
    id: 31,
    nombre: 'DibujandoCortoPorLaDiagonal',
    titulo: 'Dibujando: Corto por la diagonal',
    enunciado: 'Dibujá 5 cuadrados en diagonal, cada uno de lado 50, como muestra la figura sombreada.',
    consignaInicial: '',
    escena: 'Dibujando5CuadradosDiagonal',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'SaltarHaciaAdelante']
  },
  {
    id: 32,
    nombre: 'DibujandoMamushkaCuadrada',
    titulo: 'Dibujando: Mamushka cuadrada',
    enunciado: 'Dibujá 4 cuadrados de lados 50, 100, 150 y 200, como muestra la figura sombreada. Pista: creá un procedimiento nuevo para dibujar cuadrados de cualquier longitud de lado.',
    consignaInicial: 'Incluir parámetros en los procedimientos permite generalizar un concepto. Por ejemplo, la longitud del lado de un cuadrado.',
    escena: 'Dibujando4CuadradosInteriores',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'SaltarHaciaAdelante']
  },
  {
    id: 33,
    nombre: 'DibujandoEscaleraCuadrada',
    titulo: 'Dibujando: Escalera cuadrada',
    enunciado: 'Dibujá 5 cuadrados: 4 de lado 50 y uno de 100, como muestra la figura sombreada.',
    consignaInicial: 'Al crear un procedimiento con parámetros, sus valores no están definidos (por ej. "longitud de lado"). Al usar los procedimientos hay que darles un valor concreto a esos parámetros (50, 100, etc.).',
    escena: 'DibujandoCabezaElefante',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'SaltarHaciaAdelante']
  },
  {
    id: 34,
    nombre: 'DibujandoHexagono',
    titulo: 'Dibujando: Hexágono',
    enunciado: 'Dibujá un hexágono de lado 100, como muestra la figura sombreada. Pista: pensá cuántos grados debe girar el robot sabiendo cuánto miden los ángulos internos del hexágono.',
    consignaInicial: 'En los polígonos, el valor de un ángulo externo es igual a 180 menos el valor de un ángulo interno.',
    escena: 'DibujandoHexagono',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante']
  },
  {
    id: 35,
    nombre: 'DibujandoPiramideInvertida',
    titulo: 'Dibujando: Pirámide invertida',
    enunciado: 'Dibujá un triángulo equilátero de lado 100, como muestra la figura sombreada. Pista: pensá si existe una relación entre los ángulos y la cantidad de lados.',
    consignaInicial: 'En los polígonos, la suma de todos los ángulos externos es 360',
    escena: 'DibujandoTrianguloEquilatero',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante']
  },
  {
    id: 36,
    nombre: 'DibujandoFigurasDentroDeFiguras',
    titulo: 'Dibujando: Figuras dentro de figuras',
    enunciado: 'Dibujá un triángulo, un cuadrado y un pentágono de lado 100, como muestra la figura sombreada. Pista: creá un procedimiento con un parámetro para la cantidad de lados. ',
    consignaInicial: 'Ahora tenemos Operadores: estos bloques nos van a permitir realizar algunas cuentas automáticamente ¡Como una calculadora!... ¿Cuántos grados tiene un giro completo? ¿Por qué número debemos dividirlo?',
    escena: 'DibujandoPoligonosInteriores',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante']
  },
  {
    id: 37,
    nombre: 'DibujandoLaCuevaDeEstalagtitas',
    titulo: 'Dibujando: La cueva de estalactitas',
    enunciado: 'Dibujá 3 triángulos de lados 40, 60 y 100, y un cuadrado de lado 200, como muestra la figura sombreada. Pista: creá un procedimiento con 2 parámetros, uno para la cantidad de lados y otro para la longitud de los lados.',
    consignaInicial: 'Para poder usar los parámetros en un nuevo procedimiento, hay que hacer clic derecho en el bloque que define dicho procedimiento.',
    escena: 'DibujandoCuevaEstalagtitas',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante']
  },
  {
    id:130,
    nombre: 'LaFiestaDeDracula',
    titulo: 'La fiesta de Drácula',
    escena: 'LaFiestaDeDracula',
    enunciado: 'Para que la fiesta de Drácula comience debemos cambiar el color de los 3 focos una cierta cantidad de veces: 5 veces el primero, 8 el segundo y 12 el tercero.',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'Numero',
      'OpAritmetica', 'CambiarColor', 'SiguienteFoco', 'EmpezarFiesta'],
  },
  {
    id: 131,
    nombre: 'SalvandoLaNavidad',
    titulo: 'Salvando la Navidad',
    escena: 'SalvandoLaNavidad',
    enunciado: 'Ayudá a Papá Noel a dejar un regalo al final de cada fila. ¡Tené en cuenta que el escenario no cambia de una ejecución a la otra! Pista: si tuvieses que elegir un parámetro para tu procedimiento... ¿Cuál eligirías? ¿Qué varía de fila a fila?',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'MoverACasillaDerecha', 'DejarRegalo', 'SiguienteFilaTotal', 'Numero', 'OpAritmetica'],
  },
  {
    id:132,
    nombre: 'PrendiendoLasCompusParametrizado',
    titulo: 'Prendiendo las compus parametrizado',
    escena: 'PrendiendoLasCompus',
    enunciado: 'Al igual que antes, debemos prender todas las compus. Pero esta vez tenés que definir un único procedimiento que prenda cualquiera de los lados.',
    consignaInicial: 'Los parámetros pueden ser direcciones, no siempre deben ser números. Por ejemplo, un parámetro podría ser la dirección en que el autómata debe moverse.',
    deshabilitado: false,
    debeFelicitarse: true,
    bloques: ['ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo',
      'MoverA', 'Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'PrenderComputadora', 'EstoyEnEsquina', 'Numero',
      'OpAritmetica'],
  },
  {
    id: 133,
    nombre: 'TitoCuadrado',
    titulo: 'Tito cuadrado',
    escena: 'TitoCuadrado',
    enunciado: 'Tito debe encender todas las luces del cuadrado pero en cada ejecución están distribuidas de una manera diferente. Tené en cuenta que las casillas de la esquina nunca se prenden y que el tamaño del cuadrado no varía de una ejecución a la otra.',
    debeFelicitarse: true,
    bloques: ['ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo',
      'MoverA', 'Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'TocandoLuz', 'EncenderLuz', 'Numero', 'OpAritmetica'],
  },
  {
    id: 134,
    nombre: 'ElCangrejoAguafiestas',
    titulo: 'El cangrejo aguafiestas',
    escena: 'ElCangrejoAguafiestas',
    enunciado: 'El cangrejo quiere pinchar todos los globos de la fiesta. Tené en cuenta que estos no cambian de lugar. Pista: ¿la cantidad de globos y la dirección podrían ser parámetros?',
    consignaInicial: 'Se pueden combinar parámetros numéricos (cantidades, longitudes) con parámetros de texto (direcciones, nombres).',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo', 'MoverA',
      'ExplotarGlobo', 'Numero', 'OpAritmetica']
  },
  {
    id: 135,
    nombre: 'PrendiendoLasFogatas',
    titulo: 'Prendiendo las fogatas',
    escena: 'PrendiendoLasFogatas',
    enunciado: 'En este caso debemos encender todas las fogatas del cuadrado pero en cada ejecución están distribuidas de una manera diferente. Tené en cuenta que las casillas de la esquina nunca se prenden y que el tamaño del cuadrado no varía de una ejecución a la otra.',
    consignaInicial: 'Si no tenés un procedimiento con parámetros para mover en cualquier direccion... ¡Podés crearlo!',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'TocandoFogata', 'PrenderFogata',
      'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha',
      'Numero', 'OpComparacion', 'OpAritmetica',
      'ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo'
    ]
  },
  {
    id: 136,
    nombre: 'DibujoLibre',
    titulo: '¡Dibujo libre!',
    imagen: 'DibujoLibre',
    escena: `new DibujandoLibremente()`,
    enunciado: 'En esta actividad vas a poder realizar el dibujo que más te guste',
    consignaInicial: 'Incluímos todos los bloques posibles, para que puedas dar rienda suelta a tus conocimientos.',
    debeFelicitarse: false,
    bloques: ['Procedimiento', 'Repetir', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante']
  },

  {
    id: 201,
    nombre: '3.1.2a',
    titulo: 'Desafío 1',
    escena: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,-,-,-,O,-],\
      [-,A,-,-,P,-],\
      [-,-,-,O,-,-],\
      [O,O,O,O,-,O],\
		")`,
    enunciado: 'Ayudá a la puma Duba a comer su churrasco. Evitá los obstáculos.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
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
    nombre: '3.1.2b',
    titulo: 'Desafío 2',
    escena: `new EscenaDuba("\
        [O,O,O,O,O,O],\
        [O,O,O,O,O,O],\
        [O,-,O,-,P,O],\
        [O,-,A,-,O,O],\
        [O,O,-,O,O,O],\
        [O,O,O,O,O,O],\
		")`,
    enunciado: 'Duba quiere comer su churrasco. ¡Ayudala!',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
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
    nombre: '3.1.2c',
    titulo: 'Desafío 3',
    escena: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O],\
      [O,A,O,-,-,O],\
      [O,-,-,-,P,O],\
      [O,-,O,-,-,O],\
      [O,O,O,O,O,O],\
		")`,
    enunciado: '¿Ayudás a la puma a comer su churrasco? Evitá los obstáculos.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
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
    nombre: '3.1.2d',
    titulo: 'Desafío 4',
    escena: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,-,A,O,O,O],\
      [O,O,-,O,O,O],\
      [O,O,-,-,-,O],\
      [O,O,O,P,-,O],\
      [O,O,O,O,O,O],\
		")`,
    enunciado: 'Duba quiere comer churrasco. ¿Cómo lo puede hacer sin chocarse con los obstáculos?',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
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
    nombre: '3.1.2e',
    titulo: 'Desafío 5',
    escena: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,O,-,O,-,O],\
      [O,-,A,-,-,O],\
      [O,-,-,O,-,O],\
      [O,O,-,-,P,O],\
      [O,O,O,O,O,O],\
		")`,
    enunciado: 'Ayudá a la puma Duba a saciar su hambre, evitando los obstáculos.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
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
    nombre: '3.1.2f',
    titulo: 'Desafío 6',
    escena: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,-,-,-,-,O],\
      [O,-,O,P,-,O],\
      [O,A,O,-,O,O],\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O],\
		")`,
    enunciado: 'Duba quiere devorar su churrasco. ¿Cómo lo puede lograr?',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
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
    nombre: '3.1.3a',
    titulo: 'Desafío 1',
    escena: `new EscenaCoty(
      [{x:125,y:75},{x:125,y:-175},{x:-25,y:-175},{x:-25,y:-75},{x:25,y:-75},{x:25,y:-175},{x:-125,y:-175},{x:-125,y:125},{x:-75,y:125},{x:-75,y:75},{x:-25,y:75},{x:-25,y:125},{x:25,y:125},{x:25,y:75}],
      [{x:25,y:75},{x:75,y:75},{x:75,y:125},{x:125,y:125},{x:125,y:75}],
      {xCoty: 25, yCoty: 75}
    )`,
    enunciado: 'Ayudá a la llama a completar la torre.',
    consignaInicial: 'Para completar el dibujo, Coty debe dibujar sobre las líneas grises.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando']
  },
  {
    id: 208,
    nombre: '3.1.3b',
    titulo: 'Desafío 2',
    escena: `new EscenaCoty(
      [{x:-50,y:25},{x:0,y:100},{x:50,y:25}],
      [{x:-50,y:25},{x:0,y:25},{x:50,y:25},{x:50,y:-25},{x:50,y:-75},{x:0,y:-75},{x:-50,y:-75},{x:-50,y:-25},{x:-50,y:25}],
      {xCoty: -50, yCoty: 25}
    )`,
    enunciado: '¡Coty quiere dibujar la casa! ¿La ayudás?',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando']
  },
  {
    id: 209,
    nombre: '3.1.3c',
    titulo: 'Desafío 3',
    escena: `new EscenaCoty(
      [],
      [[ {x:-125,y:0}, {x:-75,y:0}],[ {x:-25,y:0}, {x:25,y:0}],[ {x:75,y:0}, {x:125,y:0}]],
      {xCoty: 125, yCoty: 0}
    )`,
    enunciado: 'La llama quiere solo dibujar tres rayas. ¿Cómo puede hacerlo?',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda']
  },
  {
    id: 210,
    nombre: '3.1.3d',
    titulo: 'Desafío 4',
    escena: `new EscenaCotySonrisa()`,
    enunciado: '¿Ayudás a la llama a completar la carita feliz?',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda'
    ]
  },
  {
    id: 211,
    nombre: '3.1.3e',
    titulo: 'Desafío 5',
    escena: `new EscenaCoty(
      [[{x:-55,y:50},{x:-150,y:50},{x:-150,y:0},{x:-50,y:0}],[{x:-75,y:0},{x:-75,y:-100},{x:-125,y:-100},{x:-125,y:0}],[{x:-25,y:0},{x:25,y:0},{x:25,y:-100},{x:-25,y:-100},{x:-25,y:0}],[{x:125,y:0},{x:125,y:-100},{x:75,y:-100},{x:75,y:0}],[{x:50,y:0},{x:150,y:0},{x:150,y:50},{x:50,y:50}]],
      [{x:-50,y:0},{x:0,y:0},{x:50,y:0},{x:50,y:50},{x:0,y:50},{x:-50,y:50},{x:-50,y:0}],
      {xCoty: -50, yCoty: 100}      
    )`,
    enunciado: '¿Cómo puede hacer la llama para terminar de dibujar el puente?',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda'
    ]
  },
  {
    id: 212,
    nombre: '3.1.3f',
    titulo: 'Desafío 6',
    escena: `new EscenaCotyCactus()`,
    enunciado: '¿Cómo puede hacer la llama para completar el cardo?',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda']
  },
  {
    id: 213,
    nombre: '3.1.3g',
    titulo: 'Desafío 7',
    escena: `new EscenaCotyMate()`,
    enunciado: 'Es hora de un buen mate. Ayudá a la llama a terminar de dibujarlo.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda']
  },
  {
    id: 214,
    nombre: '3.1.4a',
    titulo: 'Desafío 1',
    escena: `new EscenaLita("\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O],\
      [O,A,-,T,L,-],\
      [O,O,O,O,O,E],\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O]\
    ")`,
    enunciado: 'Ayudá a la mulita a preparar la ensalada mixta.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
    ],
  },
  {
    id: 215,
    nombre: '3.1.4b',
    titulo: 'Desafío 2',
    escena: `new EscenaLita("\
      [O,O,O,O,O],\
      [O,O,O,O,O],\
      [-,-,T,-,-],\
      [-,-,L,-,-],\
      [A,O,O,O,E],\
      [O,O,O,O,O]\
    ")`,
    enunciado: 'Hoy Lita quiere comer una ensaladita. ¡Ayudala a prepararla!',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
    ],
  },
  {
    id: 216,
    nombre: '3.2.2a',
    titulo: 'Desafío 1',
    escena: `new EscenaLita("\
      [-,-,-],\
      [-,L,-],\
      [A,-,E],\
      [-,T,-]\
    ")`,
    enunciado: 'Tomate, lechuga y listo. Ayudá a Lita a preparar su ensalada.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
    ],
  },
  {
    id: 217,
    nombre: '3.2.2b',
    titulo: 'Desafío 2',
    escena: `new EscenaLita("\
      [-,-,-,-],\
      [-,L,T,-],\
      [A,-,-,E],\
      [-,-,-,-]\
    ")`,
    enunciado: 'Ayudá a Lita a preparar su plato favorito.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
    ],
  },
  {
    id: 218,
    nombre: '3.2.2c',
    titulo: 'Desafío 3',
    escena: `new EscenaLita("\
      [-,A,-],\
      [L,E,T],\
      [-,-,-],\
      [-,-,-]\
    ")`,
    enunciado: '¿Agarra primero el tomate o la lechuga? Ayudá a Lita a preparar su plato predilecto.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
    ],
  },
  {
    id: 219,
    nombre: '3.2.2d',
    titulo: 'Desafío 4',
    escena: `new EscenaLita("\
      [-,-,A],\
      [-,L,T],\
      [-,-,E]\
    ")`,
    enunciado: '¿Qué pasos puede dar la mulita para preparar su plato favorito?',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
    ],
  },
  {
    id: 220,
    nombre: '3.2.3a',
    titulo: 'Desafío 1',
    escena: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,P,O,-,-,O],\
      [O,-,O,-,-,-],\
      [O,-,-,-,O,A],\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O],\
		")`,
    enunciado: '¿Cuál es el error de problema? Encontralo y ayudá a Duba a comer su churrasco.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
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
    id: 221,
    nombre: '3.2.3b',
    titulo: 'Desafío 2',
    escena: `new EscenaDuba("\
        [O,O,O,O,O,O],\
        [O,-,-,O,O,O],\
        [O,-,P,O,O,O],\
        [O,-,-,O,O,O],\
        [O,-,-,-,A,O],\
        [O,O,O,O,O,O],\
		")`,
    enunciado: '¿Qué pasa con Duba que no logra comer su comida? Corregí el programa para que la puma sacie su hambre.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
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
    id: 222,
    nombre: '3.2.3c',
    titulo: 'Desafío 3',
    escena: `new EscenaDuba("\
        [O,O,O,O,O,O],\
        [O,P,O,A,O,O],\
        [O,-,O,-,O,O],\
        [O,-,-,-,O,O],\
        [O,-,-,O,O,O],\
        [O,O,O,O,O,O],\
		")`,
    enunciado: 'Descubrí el problema del programa y corregilo así Duba puede comer su churrasco.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
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
    id: 223,
    nombre: '3.2.3d',
    titulo: 'Desafío 4',
    escena: `new EscenaDuba("\
        [O,O,O,O,O,O],\
        [O,O,-,-,-,O],\
        [O,-,P,-,-,O],\
        [O,-,O,O,O,O],\
        [O,-,-,A,-,O],\
        [O,O,O,O,O,O],\
		")`,
    enunciado: '¿Hay instrucciones de más o falta alguna? Mirá el programa, descubrí el error y ayudá a Duba a comer su plato predilecto.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
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
    id: 224,
    nombre: '3.2.3e',
    titulo: 'Desafío 5',
    escena: `new EscenaLita("\
      [O,O,O,O,O,O,O],\
      [O,O,O,O,O,O,O],\
      [O,O,O,O,-,T,O],\
      [O,A,-,-,L,E,O],\
      [O,O,O,O,O,O,O],\
      [O,O,O,O,O,O,O]\
    ")`,
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
        <next>
        <block type="MoverACasillaDerecha">
        <next>
        <block type="MoverACasillaDerecha">
        <next>
        <block type="AgarrarLechuga">
        <next>
        <block type="MoverACasillaArriba">
        <next>
        <block type="MoverACasillaDerecha">
        <next>
        <block type="MoverACasillaAbajo">
        <next>
        <block type="PrepararEnsalada">
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
    enunciado: '¿Qué error encontrás en este programa? Corregilo y ayudá a la mulita a preparar su almuerzo.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
    ],
  },
  {
    id: 225,
    nombre: '3.I1a',
    titulo: 'Desafío 1',
    escena: `new EscenaTotoLector([
        ['A', 'r', 'e'],
        ['t', 'o', 'j'],
        ['i', 't', 'o'],
    ], "toto")`,
    enunciado: 'Ayudá al zorro a leer su nombre: TOTO.',
    consignaInicial: 'TOTO lee las letras por las que se mueve.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
  },
  {
    id: 226,
    nombre: '3.I1b',
    titulo: 'Desafío 2',
    escena: `new EscenaTotoLector([
        ['r', 'h', 'j', 'a'],
        ['z', 'A', 'a', 'm'],
        ['y', 'l', 'l', 'q']
    ], "llama")`,
    enunciado: 'El zorro está pensando en su amiga de la Puna, Coty. Ayudalo a leer LLAMA.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
  },
  {
    id: 227,
    nombre: '3.I1c',
    titulo: 'Desafío 3',
    escena: `new EscenaTotoLector([
        ['a', 'm', 'A'],
        ['f', 'u', 'p'],
        ['r', 'y', 'a'],
    ], "puma")`,
    enunciado: '¡Adiviná en quién está pensando el zorro! Una ayuda: es un animal al que le gusta mucho comer churrasco.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
  },
  {
    id: 228,
    nombre: '3.I1d',
    titulo: 'Desafío 4',
    escena: `new EscenaTotoLector([
        ['A', 'c', 'a', 'b'],
        ['o', 'l', 'l', 'e'],
    ], "caballo")`,
    enunciado: '¿Qué quiso leer el zorro y qué terminó leyendo? ¡Descubrí el error y corregilo!',
    consignaInicial: 'Toto está volviendo. Va a demorar un poco porque está andando a ...',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverLeyendoDerecha">
        <next>
        <block type="MoverLeyendoDerecha">
        <next>
        <block type="MoverLeyendoDerecha">
        <next>
        <block type="MoverLeyendoAbajo">
        <next>
        <block type="MoverLeyendoIzquierda">
        <next>
        <block type="MoverLeyendoIzquierda">
        <next>
        <block type="MoverLeyendoIzquierda">
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
    id: 229,
    nombre: '3.I1e',
    titulo: 'Desafío 5',
    escena: `new EscenaTotoLector([
        ['w', 'a', 'r'],
        ['u', 'n', 'e'],
        ['l', 'A', 's'],
    ], "lunes", 7)`,
    enunciado: 'El zorro está distraído. Ayudalo a leer correctamente qué día llega a Humahuaca.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverLeyendoIzquierda">
        <next>
        <block type="MoverLeyendoArriba">
        <next>
        <block type="MoverLeyendoDerecha">
        <next>
        <block type="MoverLeyendoArriba">
        <next>
        <block type="MoverLeyendoDerecha">
        <next>
        <block type="MoverLeyendoAbajo">
        <next>
        <block type="MoverLeyendoAbajo">
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
    id: 230,
    nombre: '4.1.3a',
    titulo: 'Desafío 1',
    escena: `new EscenaDuba("\
        [-,O,O,O,-,-,-,-],\
        [-,O,O,O,O,-,-,-],\
        [O,O,-,O,O,-,-,-],\
        [O,O,-,-,-,-,-,-],\
        [A,-,-,-,-,-,-,P],\
        [-,-,O,-,O,-,-,-],\
        [-,-,O,O,O,O,O,O],\
        [-,-,-,O,O,O,O,O],\
		")`,
    enunciado: '¿Puede la puma llegar al churrasco usando solo una vez el bloque mover?',
    consignaInicial: 'Podés usar el nuevo bloque “Repetir”',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ]
  },
  {
    id: 231,
    nombre: '4.1.3b',
    titulo: 'Desafío 2',
    escena: `new EscenaDuba("\
        [O,O,-,O,O,-,-,-],\
        [O,P,-,O,O,-,-,-],\
        [O,-,-,O,-,-,-,-],\
        [O,-,O,O,-,-,-,-],\
        [O,-,O,O,O,-,-,-],\
        [-,-,O,O,O,O,-,-],\
        [-,-,O,O,O,O,O,O],\
        [-,-,A,O,O,O,O,O],\
		")`,
    enunciado: 'La puma tiene hambre y está lejos del churrasco. ¡Pero ahora sabe repetir!',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ]
  },
  {
    id: 232,
    nombre: '4.1.3c',
    titulo: 'Desafío 3',
    escena: `new EscenaDuba("\
      [-,-,-,O,O,-,-,O],\
      [O,O,-,O,-,-,-,O],\
      [A,O,O,O,-,-,O,O],\
      [-,O,O,O,O,O,O,O],\
      [-,O,O,O,-,O,O,O],\
      [-,-,-,-,-,-,P,O],\
      [O,O,-,O,O,O,O,O],\
      [O,O,-,-,O,O,O,O],\
		")`,
    enunciado: '¿Cómo puede hacer la puma para llegar a su comida sin tener que usar muchos bloques mover?',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ]
  },
  {
    id: 233,
    nombre: '4.1.4a',
    titulo: 'Desafío 1',
    escena: `new EscenaCoty(
      [],
      [[{x:-130,y:20},{x:-90,y:20}], [{x:-50,y:20},{x:-10,y:20}], [{x:30,y:20},{x:70,y:20}], [{x:110,y:20},{x:150,y:20}]],
      {xCoty: -130, yCoty: 20, longitudSegmento: 40}     
    )`,
    enunciado: 'La llama quiere dibujar cuatro líneas. ¿Qué es lo que se repite esta vez?',
    consignaInicial: 'Puede haber más de un bloque dentro del Repetir',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Repetir'
    ]
  },
  {
    id: 234,
    nombre: '4.1.4b',
    titulo: 'Desafío 2',
    escena: `new EscenaCoty(
      [],
      [[{x:-130,y:20},{x:-90,y:20}], [{x:-50,y:20},{x:-10,y:20}], [{x:30,y:20},{x:70,y:20}], [{x:110,y:20},{x:150,y:20},{x:150,y:-20}]],
      {xCoty: -130, yCoty: 20, longitudSegmento: 40}      
    )`,
    enunciado: '¡Ahora además hay que dibujar para abajo! ¿Será tan fácil como agregar un bloque a lo que hiciste antes? ¿Cuántas repeticiones son necesarias ahora?',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Repetir'
    ]
  },
  {
    id: 235,
    nombre: '4.1.4c',
    titulo: 'Desafío 3',
    escena: `new EscenaCoty(
      [],
      [[{x:-120,y:-60},{x:-120,y:-20},{x:-80,y:-20},{x:-40,y:-20},{x:-40,y:20},{x:0,y:20},{x:40,y:20},{x:40,y:60},{x:80,y:60},{x:120,y:60}]],
      {xCoty: -120, yCoty: -60, longitudSegmento: 40}
    )`,
    enunciado: 'La llama tiene ganas de dibujar una escalera. ¿Encontrás el patrón que se repite? ¿Cuántas veces se repite? ',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Repetir'
    ]
  },
  {
    id: 236,
    nombre: '4.2.3a',
    titulo: 'Desafío 1',
    escena: `new EscenaDuba("\
      [-,-,-,-,O,O,O,O],\
      [-,-,-,-,-,-,-,O],\
      [-,-,-,-,-,-,-,-],\
      [-,P,-,-,-,-,-,-],\
      [-,-,-,-,-,O,A,-],\
      [-,-,-,-,O,O,O,O],\
      [O,O,O,O,O,O,O,O],\
      [O,O,O,O,O,O,O,O],\
		")`,
    enunciado: '¡Qué bueno, ya tenés una solución! ¿La probás?',
    consignaInicial: 'Podés probar los programas paso a paso para descubrir los errores',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaArriba">
      <next>
      <block type="Repetir">
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
    id: 237,
    nombre: '4.2.3b',
    titulo: 'Desafío 2',
    escena: `new EscenaDuba("\
      [O,-,-,-,O,O,O,O],\
      [-,A,-,-,-,-,O,-],\
      [O,O,-,-,-,-,-,-],\
      [O,O,O,-,-,-,-,-],\
      [O,O,O,-,-,-,-,-],\
      [O,O,O,O,O,-,P,-],\
      [O,O,O,O,O,O,O,O],\
      [O,O,O,O,O,O,O,O],\
		")`,
    enunciado: '¿Qué pasa que Duba no llega a comer su plato preferido? Sacá, modificá y/o agregá los bloques que falten para que logre su cometido.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="Repetir">
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
    id: 238,
    nombre: '4.2.3c',
    titulo: 'Desafío 3',
    escena: `new EscenaCoty(
      [],
      [[{x:-100,y:-100},{x:-100,y:-50},{x:-50,y:-50},{x:-50,y:0},{x:0,y:0},{x:0,y:50},{x:50,y:50},{x:50,y:100},{x:100,y:100}]],
      {xCoty: -100, yCoty: -100}      
    )`,
    enunciado: '¿Qué patrón debe repetir Coty esta vez? ¿Es correcta la solución propuesta?',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Repetir'
    ],
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
        <statement name="program">
          <block type="Repetir">
            <value name="count">
              <block type="math_number">
                <field name="NUM">4</field>
              </block>
            </value>
            <statement name="block">
              <block type="MoverArribaDibujando"></block>
            </statement>
            <next>
              <block type="Repetir">
                <value name="count">
                  <block type="math_number">
                    <field name="NUM">4</field>
                  </block>
                </value>
                <statement name="block">
                  <block type="MoverDerechaDibujando"></block>
                </statement>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`
  },
  {
    id: 239,
    nombre: '4.2.3d',
    titulo: 'Desafío 4',
    escena: `new EscenaCoty(
      [],
      [[{x:-120,y:-60},{x:-120,y:-20},{x:-80,y:-20},{x:-80,y:20},{x:-40,y:20},{x:-40,y:60},{x:0,y:60},{x:40,y:60},{x:40,y:20},{x:80,y:20},{x:80,y:-20},{x:120,y:-20},{x:120,y:-60}]],
      {xCoty: -120, yCoty: -60, longitudSegmento: 40}      
    )`,
    enunciado: '¡Otra vez Coty está en cualquiera! ¿Podés encontrar los errores y corregirlos? La llama te lo va a agradecer.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Repetir'
    ],
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
        <statement name="program">
          <block type="Repetir">
            <value name="count">
              <block type="math_number">
                <field name="NUM">2</field>
              </block>
            </value>
            <statement name="block">
              <block type="MoverArribaDibujando">
                <next>
                  <block type="MoverDerechaDibujando"></block>
                </next>
              </block>
            </statement>
            <next>
              <block type="Repetir">
                <value name="count">
                  <block type="math_number">
                    <field name="NUM">3</field>
                  </block>
                </value>
                <statement name="block">
                  <block type="MoverDerechaDibujando"></block>
                </statement>
                <next>
                  <block type="Repetir">
                    <value name="count">
                      <block type="math_number">
                        <field name="NUM">3</field>
                      </block>
                    </value>
                    <statement name="block">
                      <block type="MoverAbajoDibujando"></block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`
  },
  {
    id: 240,
    nombre: '4.I1a',
    titulo: 'Desafío 1',
    escena: `new EscenaLita("\
      [O,-,-,-,O,-,A],\
      [-,-,-,O,O,-,O],\
      [O,O,O,O,-,-,O],\
      [O,O,O,O,-,O,O],\
      [O,-,O,-,-,O,O],\
      [-,-,O,-,O,O,O],\
      [E,L,T,-,O,O,O]\
    ")`,
    enunciado: '¿Encontrás pasos que se repiten? ¿Cuáles son? Creá el programa que ayuda a Lita a preparar su ensalada del día.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir',
    ],
  },
  {
    id: 241,
    nombre: '4.I1b',
    titulo: 'Desafío 2',
    escena: `new EscenaLita("\
      [L,-,-,-,-,T,E],\
      [-,O,-,-,O,-,O],\
      [-,O,O,O,O,-,O],\
      [-,O,O,O,-,-,O],\
      [-,-,-,O,-,-,-],\
      [A,-,-,-,-,-,-],\
      [-,O,O,-,-,O,O]\
    ")`,
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="Repetir">
          <value name="count">
            <block type="math_number">
              <field name="NUM">4</field>
            </block>
          </value>
          <statement name="block">
            <block type="MoverACasillaArriba">
            </block>
          </statement>
        <next>
        <block type="AgarrarLechuga">
        <next>
        <block type="Repetir">
          <value name="count">
            <block type="math_number">
              <field name="NUM">5</field>
            </block>
          </value>
          <statement name="block">
            <block type="MoverACasillaDerecha">
            <next>
            <block type="AgarrarTomate">
            </block>
            </next>
            </block>
          </statement>
        <next>
        <block type="MoverACasillaDerecha">
        <next>
        <block type="PrepararEnsalada">
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
    enunciado: '¡Así como está, la mulita no puede preparar su ensalada! ¿Cuántas veces Lita repite los pasos para llegar a la lechuga? ¿Qué habría que modificar? ¿Qué sucede cuando pretende agarrar el tomate?',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir',
    ],
  },
  {
    id: 242,
    nombre: '5.1.3a',
    titulo: 'Desafío 1',
    escena: `new EscenaDuba("[A,P?(0.6)]", {}, [0,1])`,
    enunciado: '¡A veces hay churrasco y a veces no! ¿Podés hacer un solo programa para que Duba avance siempre y coma solo si hay un churrasco?',
    consignaInicial: 'El bloque "Si" sirve para a veces hacer algo y a veces no. ¡Sirve para preguntar!',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Si',
      'HayChurrasco'
    ],
  },
  {
    id: 243,
    nombre: '5.1.3b',
    titulo: 'Desafío 2',
    escena: `new EscenaDuba(["[A,-,-]","[A,P,-]","[A,-,P]","[A,P,P]"], {}, [0,2])`,
    enunciado: 'Ahora Duba debe avanzar dos veces. ¡tiene que comerse todos los churrascos que aparecen! ...Pero sólo si aparecen',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Si',
      'HayChurrasco'
    ],
  },
  {
    id: 244,
    nombre: '5.1.3c',
    titulo: 'Desafío 3',
    escena: `new EscenaCoty(
      [],
      [{x:-120,y:50},{x:20,y:50},{x:20,y:-90},{x:-120,y:-90},{x:-120,y:50}],
      {xCoty: -120, yCoty: 50, puedeHaberCharco: true, longitudSegmento: 140}
    )`,
    enunciado: 'Coty debe dibujar un cuadrado, pero... ¡Cuidado, que a veces aparece un charco!',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Si',
      'HayCharco'
    ]
  },
  {
    id: 245,
    nombre: '5.1.4a',
    titulo: 'Desafío 1',
    escena: `new EscenaLita("[A,-,L|T]")`,
    enunciado: 'Lita quiere agarrar cualquier verdura. ¡Pero debe ser la correcta!',
    consignaInicial: 'El bloque Si/Sino permite elegir entre dos alternativas. Sólo hay que elegir bien la pregunta',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Si',
      'SiNo',
      'HayTomate',
      'HayLechuga',
    ],
  },
  {
    id: 246,
    nombre: '5.1.4b',
    titulo: 'Desafío 2',
    escena: `new EscenaDuba(["\
      [O,O,O,O,O],\
      [O,A,-,P,O],\
      [O,O,O,O,O],\
      [O,O,O,O,O],\
      [O,O,O,O,O],\
    ","\
      [O,O,O,O,O],\
      [O,A,O,O,O],\
      [O,-,O,O,O],\
      [O,P,O,O,O],\
      [O,O,O,O,O],\
		"])`,
    enunciado: 'No siempre debe avanzar a la derecha... ¿Qué pregunta le sirve a Duba para decidir?',
    consignaInicial: 'También se puede poner más de una instrucción en el bloque Si/Sino',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Si',
      'SiNo',
      'HayObstaculoArriba',
      'HayObstaculoAbajo',
      'HayObstaculoIzquierda',
      'HayObstaculoDerecha'
    ],
  },
  {
    id: 247,
    nombre: '5.1.4c',
    titulo: 'Desafío 3',
    escena: `new EscenaDuba("\
      [O,O,O,O,O],\
      [-,-,*,-,-],\
      [A,-,*,-,P],\
      [O,O,O,O,O],\
		", { coleccion: ["O"] })`,
    enunciado: '¡Cuidado, Duba! ¿Dónde puede aparecer un obstáculo? ¡Vamos a tener que decidir el camino a tomar!',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Si',
      'SiNo',
      'HayObstaculoArriba',
      'HayObstaculoAbajo',
      'HayObstaculoIzquierda',
      'HayObstaculoDerecha'
    ],
  },
  {
    id: 248,
    nombre: '5.2.1a',
    titulo: 'Desafío 1',
    escena: `new EscenaDuba("[A,-,-,-,-,-,-,P?]", {}, [0,7])`,
    enunciado: 'Ahora Duba está lejos, y tiene que decidir si comer o no. ¿La ayudamos con los bloques que aprendimos?',
    consignaInicial: 'Es importante apretar ejecutar varias veces para entender el problema',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir',
      'Si',
      'SiNo',
      'HayChurrasco'
    ],
  },
  {
    id: 249,
    nombre: '5.2.1b',
    titulo: 'Desafío 2',
    escena: `new EscenaDuba("[A,#P,#P,#P,#P,#P,#P,#P]", { macros: { "P": "*>P?" }, coleccion: ["P"] }, [0,7])`,
    enunciado: '¡Cuántos churrascos! ¿Qué patrón debe repetir Duba? ¿Cuántas preguntas tiene que hacer?',
    consignaInicial: 'Es importante apretar ejecutar varias veces para entender el problema',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir',
      'Si',
      'SiNo',
      'HayChurrasco'
    ],
  },
  {
    id: 250,
    nombre: '5.2.1c',
    titulo: 'Desafío 3',
    escena: `new EscenaLita("[A],[*>L|T],[*>L|T],[*>L|T],[*>L|T],[*>L|T],[*>L|T],[E]", { coleccion: ["T", "L"] })`,
    enunciado: '¡Lita también debe repetir su decisión varias veces! Siempre hay una verdura, sólo debe decidir cuál agarrar en cada paso.',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir',
      'Si',
      'SiNo',
      'HayTomate',
      'HayLechuga',
    ],
  },
  {
    id: 251,
    nombre: '5.I1a',
    titulo: 'Desafío 1',
    escena: `new EscenaTotoEscritor(new ObjetivoCopiar())`,
    enunciado: '¡Ahora Toto sabe escribir! Hacé que copie toda la palabra.',
    consignaInicial: 'Toto sabe escribir la letra que está tocando',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'EscribirLetraActualEnOtraCuadricula',
      'Repetir',
      'Si',
      'SiNo'
    ],
  },

  {
    id: 252,
    nombre: '5.I1b',
    titulo: 'Desafío 2',
    escena: `new EscenaTotoEscritor(new ObjetivoX())`,
    enunciado: 'Ahora Toto quiere escribir una X por cada letra. ¡Sin importar lo que lea! ¿Cuantas X debe escribir?',
    consignaInicial: 'Toto también sabe escribir una letra que le digas',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'EscribirLetraActualEnOtraCuadricula',
      'EscribirTextoDadoEnOtraCuadricula',
      'Repetir',
      'Si',
      'SiNo'
    ],
  },

  {
    id: 253,
    nombre: '5.I1c',
    titulo: 'Desafío 3',
    escena: `new EscenaTotoEscritor(new ObjetivoMicha())`,
    enunciado: 'A Toto le gusta jugar con las letras: hacé que copie la palabra, pero cuando llegue a la M, que agregue "ICH"',
    consignaInicial: 'Cuando copia "Cemento" escribe "Cemichento"',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'EscribirLetraActualEnOtraCuadricula',
      'EscribirTextoDadoEnOtraCuadricula',
      'Repetir',
      'Si',
      'SiNo',
      'hayVocalRMT'
    ],
  },

  {
    id: 254,
    nombre: '5.I1d',
    titulo: 'Desafío 4',
    escena: `new EscenaTotoEscritor(new ObjetivoJeringozo())`,
    enunciado: 'Hacé que Toto copie la palabra hablando en Jeringozo. Si la palabra fuera "DUBA" él tiene que copiar "DUPUBAPA"',
    consignaInicial: 'El idioma Jeringozo agrega "PA" después de una A, "PE" después de una E, y así con todas las vocales',
    debeFelicitarse: true,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'EscribirLetraActualEnOtraCuadricula',
      'EscribirTextoDadoEnOtraCuadricula',
      'Repetir',
      'Si',
      'SiNo',
      'hayVocalRMT'
    ],
  },

  {
    id: 255,
    nombre: 'CotyDibujoLibre',
    titulo: '¡Coty dibuja libre!',
    imagen: 'Coty',
    escena: `new EscenaCoty([],[],{xCoty: -50, yCoty: 50})`,
    enunciado: 'En esta actividad vas a poder realizar el dibujo que más te guste',
    consignaInicial: 'Incluímos todos los bloques posibles, para que puedas dar rienda suelta a tus conocimientos.',
    debeFelicitarse: false,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda', 'Repetir', 'DibujarLado', 'GirarGrados', 'Numero', 'OpAritmetica']
  },

  // Los desafíos a partir de acá (id paracapturaXX) se crearon únicamente para tomar capturas
  // para el manual de Tandil y no están pensados para ser usados por los alumnos.
  {
    id: 'paracaptura01',
    nombre: '3.2.1a',
    titulo: 'Cap. 3 / SD2 / A1 a',
    imagen: 'Duba',
    escena: `new EscenaDubaFondoBlanco("\
      [O,O,O,O],\
      [O,-,A,O],\
      [O,P,O,O],\
      [O,O,O,O],\
		")`,
    estiloToolbox: 'sinCategorias',
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco']
  },
  {
    id: 'paracaptura02',
    nombre: '3.2.1b-1',
    titulo: 'Cap. 3 / SD2 / A1 b-1',
    imagen: 'Duba',
    escena: `new EscenaDubaFondoBlanco("\
      [O,O,O],\
      [O,P,O],\
      [A,-,O],\
		")`,
    estiloToolbox: 'sinCategorias',
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco']
  },
  {
    id: 'paracaptura03',
    nombre: '3.2.1b-2',
    titulo: 'Cap. 3 / SD2 / A1 b-2',
    imagen: 'Duba',
    escena: `new EscenaDubaFondoBlanco("\
      [O,O,O],\
      [O,-,P],\
      [A,-,O],\
		")`,
    estiloToolbox: 'sinCategorias',
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco']
  },
  {
    id: 'paracaptura04',
    nombre: '3.2.1b-3',
    titulo: 'Cap. 3 / SD2 / A1 b-3',
    imagen: 'Duba',
    escena: `new EscenaDubaFondoBlanco("\
      [O,O,O],\
      [P,-,A],\
      [O,O,O],\
		")`,
    estiloToolbox: 'sinCategorias',
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco']
  },
  {
    id: 'paracaptura05',
    nombre: '3.2.1b-4',
    titulo: 'Cap. 3 / SD2 / A1 b-4',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,A,O],\
      [-,O,O],\
      [P,O,O],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco']
  },
  {
    id: 'paracaptura06',
    nombre: '3.2.1 c',
    titulo: 'Cap. 3 / SD2 / A1 c',
    imagen: 'Coty',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaCotyFondoBlanco(
      [],
      [[{x:-30,y:60},{x:30,y:60},{x:30,y:0},{x:30,y:-60}]],
      {xCoty: -30, yCoty: 60, longitudSegmento: 60}
    )`,
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda', 'Repetir', 'Si', 'SiNo', 'HayCharco']
  },
  {
    id: 'paracaptura07',
    nombre: '3.2.1 d',
    titulo: 'Cap. 3 / SD2 / A1 d',
    imagen: 'Coty',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaCotyFondoBlanco(
      [],
      [[{x:-40,y:-40},{x:-40,y:40},{x:40,y:40},{x:40,y:-40},{x:-40,y:-40}]],
      {xCoty: -40, yCoty: -40, longitudSegmento: 80}
    )`,
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda', 'Repetir', 'Si', 'SiNo', 'HayCharco']
  },
  {
    id: 'paracaptura08',
    nombre: '3.I1 a',
    titulo: 'Cap. 3 / Integradora / A1 a',
    imagen: 'Toto',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaTotoLectorFondoBlanco([
      ['n', 'A'],
      ['a', 'b'],
    ], "banana")`,
    bloques: ['MoverLeyendoArriba', 'MoverLeyendoAbajo', 'MoverLeyendoDerecha', 'MoverLeyendoIzquierda', 'Repetir', 'Si', 'SiNo']
  },
  {
    id: 'paracaptura09',
    nombre: '3.I1 b',
    titulo: 'Cap. 3 / Integradora / A1 b',
    imagen: 'Toto',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaTotoLectorFondoBlanco([
      ['f', 'A'],
      ['a', 'h'],
      ['m', 'u'],
      ['c', 'a'],
    ], "humahuaca")`,
    bloques: ['MoverLeyendoArriba', 'MoverLeyendoAbajo', 'MoverLeyendoDerecha', 'MoverLeyendoIzquierda', 'Repetir', 'Si', 'SiNo']
  },
  {
    id: 'paracaptura10',
    nombre: '3.I1 a',
    titulo: 'Cap. 3 / Integradora / A1 a V2',
    imagen: 'Toto',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaTotoLectorFondoBlanco([
      ['a', 'v', 'u'],
      ['j', 'n', 'A'],
      ['n', 'a', 'b'],
      ['a', 'r', 'e'],
    ], "banana")`,
    bloques: ['MoverLeyendoArriba', 'MoverLeyendoAbajo', 'MoverLeyendoDerecha', 'MoverLeyendoIzquierda', 'Repetir', 'Si', 'SiNo']
  },
  {
    id: 'paracaptura11',
    nombre: '3.I1 b',
    titulo: 'Cap. 3 / Integradora / A1 b V2',
    imagen: 'Toto',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaTotoLectorFondoBlanco([
      ['f', 'A', 'p'],
      ['a', 'h', 'e'],
      ['m', 'u', 'o'],
      ['c', 'a', 'j'],
    ], "humahuaca")`,
    bloques: ['MoverLeyendoArriba', 'MoverLeyendoAbajo', 'MoverLeyendoDerecha', 'MoverLeyendoIzquierda', 'Repetir', 'Si', 'SiNo']
  },
  {
    id: 'paracaptura12',
    nombre: '4.2.1a',
    titulo: 'Cap. 4 / SD2 / A1 a',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [O,-,-,A,O],\
      [O,O,O,-,O],\
      [O,-,-,-,-],\
      [O,-,-,-,-],\
      [O,O,-,P,-],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco']
  },
  {
    id: 'paracaptura13',
    nombre: '4.2.1b',
    titulo: 'Cap. 4 / SD2 / A1 b',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,-,-,-,P],\
      [-,-,O,O,-],\
      [-,-,O,O,-],\
      [-,-,O,-,-],\
      [A,O,O,-,O],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco']
  },
  {
    id: 'paracaptura14',
    nombre: '4.2.1c',
    titulo: 'Cap. 4 / SD2 / A1 c',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [A,O,O,O,O],\
      [-,-,O,O,O],\
      [-,-,-,O,-],\
      [O,-,-,-,-],\
      [O,-,O,-,P],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco']
  },
  {
    id: 'paracaptura15',
    nombre: '4.2.2a',
    titulo: 'Cap. 4 / SD2 / A1 a',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,-,-,-,-,O,O,O],\
      [-,A,-,-,-,-,O,O],\
      [-,-,-,-,-,-,-,O],\
      [O,O,-,-,P,-,-,O],\
      [O,-,-,-,-,-,-,O],\
      [O,-,-,-,-,-,-,-],\
      [O,O,-,-,-,O,-,O],\
      [O,O,O,O,O,O,O,O],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco']
  },
  {
    id: 'paracaptura16',
    nombre: '4.2.2b',
    titulo: 'Cap. 4 / SD2 / A1 b',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [O,O,-,-,-,-,-,-],\
      [O,-,-,-,-,-,-,-],\
      [-,-,P,-,-,-,-,-],\
      [-,-,-,-,-,-,-,-],\
      [-,-,O,O,-,-,-,-],\
      [O,-,O,O,-,-,-,-],\
      [O,O,O,O,-,A,-,O],\
      [O,O,O,O,O,O,O,O],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco']
  },
  {
    id: 'paracaptura17',
    nombre: '4.2.2c',
    titulo: 'Cap. 4 / SD2 / A1 c',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,-,-,P,-,-,-,O],\
      [-,-,-,-,-,-,-,-],\
      [-,-,-,-,-,-,-,-],\
      [-,-,-,-,-,-,-,-],\
      [O,O,O,-,-,-,-,-],\
      [O,O,O,O,-,-,-,-],\
      [O,O,O,O,-,O,-,A],\
      [O,O,O,O,O,O,-,-],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco']
  },
  {
    id: 'paracaptura18',
    nombre: '5SD2A2a',
    titulo: 'Cap. 5 / SD2 / A2 a',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,-,-,-,-],\
      [A,O,-,-,P],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco', 'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha']
  },
  {
    id: 'paracaptura19',
    nombre: '5SD2A2b',
    titulo: 'Cap. 5 / SD2 / A2 b',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,-,-,-,-],\
      [A,-,-,O,P],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco', 'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha']
  },
  {
    id: 'paracaptura20',
    nombre: '5SD2A2c',
    titulo: 'Cap. 5 / SD2 / A2 c',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,-,O,-,-],\
      [A,-,-,-,P],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco', 'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha']
  },
  {
    id: 'paracaptura21',
    nombre: '5SD2A2d',
    titulo: 'Cap. 5 / SD2 / A2 d',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,O,-,-,-],\
      [A,-,-,-,P],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco', 'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha']
  },
  {
    id: 'paracaptura22',
    nombre: '5SD2A2e',
    titulo: 'Cap. 5 / SD2 / A2 e',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,-,-,-,O],\
      [A,-,-,-,P],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco', 'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha']
  },
  {
    id: 'paracaptura23',
    nombre: '5SD2A2f',
    titulo: 'Cap. 5 / SD2 / A2 f',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,-,-,O,-],\
      [A,-,-,-,P],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco', 'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha']
  },
  {
    id: 'paracaptura24',
    nombre: '5SD2A2g',
    titulo: 'Cap. 5 / SD2 / A2 g',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,O,-,-,-],\
      [A,-,-,O,P],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco', 'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha']
  },
  {
    id: 'paracaptura25',
    nombre: '5SD2A2h',
    titulo: 'Cap. 5 / SD2 / A2 h',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,-,-,-,-],\
      [A,-,-,O,P],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco', 'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha']
  },
  {
    id: 'paracaptura26',
    nombre: '5SD2A2i',
    titulo: 'Cap. 5 / SD2 / A2 i',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,-,O,-,-],\
      [A,-,-,-,P],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco', 'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha']
  },
  {
    id: 'paracaptura27',
    nombre: '5SD2A2j',
    titulo: 'Cap. 5 / SD2 / A2 j',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,-,-,-,-],\
      [A,O,-,-,P],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco', 'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha']
  },
  {
    id: 'paracaptura28',
    nombre: '5SD2A2k',
    titulo: 'Cap. 5 / SD2 / A2 k',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,-,-,O,-],\
      [A,-,-,-,P],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco', 'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha']
  },
  {
    id: 'paracaptura29',
    nombre: '5SD2A2l',
    titulo: 'Cap. 5 / SD2 / A2 l',
    imagen: 'Duba',
    estiloToolbox: 'sinCategorias',
    escena: `new EscenaDubaFondoBlanco("\
      [-,-,-,-,-],\
      [A,-,-,-,P],\
		")`,
    bloques: ['Repetir', 'Si', 'SiNo', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'HayChurrasco', 'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha']
  },
];
