/**
 * Una actividad se define con el siguiente diccionario:
 * id: <obligatorio> Es el número por el cual se accederá al desafío en la URL.
 * nombre: <obligatorio> Es un segundo identificador único. Se usa para cosas como para chequear que la solución cargada sea de este desafío y no otro.
 * título: <obligatorio> Es el título visible del desafío en la lista del libro y en la pantalla principal del desafío.
 * enunciado: <obligatorio> Es el enunciado del desafío. Es la descripción del objetivo del programa que debe realizar el alumno.
 * consignaInicial: Es una posible pista, el "Sabías qué". En general en Pilas Bloques suele aparecer cuando el desafío introduce un concepto nuevo.
 * escena: <obligatorio> Es un String que puede indicar o bien un nombre de clase, o bien EL STRING con un "new Escena..." que luego se PARSEARÁ como javascript para construir la escena de pilas-bloques-exercises asociada a este desafío.
 * hasAutomaticGrading: Es un booleano que indica si tiene sentido que el desafío chequee e informe al alumno la concreción exitosa de su programa. En una actividad de dibujo libre estaría en false.
 * bloques: <obligatorio> Es la lista de ids de bloque de Blockly que habrá en el toolbox de la actividad.
 * estiloToolbox: Tiene tres valores: 
 * * * "sinCategorias", lo que hace un toolbox aplanado, con los bloques directamente en el toolbox sin títulos ni clasificaciones. 
 * * * "desplegable", lo que hace un toolbox con categorías que al clickearlas muestra los bloques. Es el valor por defecto.
 * * * "aplanado", produce el mismo toolbox aplanado con los bloques visibles que "sinCategorias", pero con las categorías en labels. Al momento está sin implementar.
 */

/*jshint esversion: 6 */

export const desafios = [
  {
    id: 1,
    nombre: 'AlienTocaBoton',
    escena: 'AlienInicial',
    bloques: ['MoverACasillaDerecha', 'ApretarBoton'],
    expectations: {
      decomposition: false,
      simpleRepetition: false
    }
  },
  {
    id: 46,
    nombre: 'NuevosComandos',
    escena: 'NuevosComandos',
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'ApretarBoton', 'Procedimiento'],
    expectations: {
      simpleRepetition: false,
      decomposition: false,
      decomposition9: true
    }
  },
  {
    id: 2,
    nombre: 'ElGatoEnLaCalle', // sale de 'id' en 'app/actividades/actividadElGatoEnLaCalle.js'
    escena: 'ElGatoEnLaCalle',
    bloques: ['Saludar', 'Avanzar', 'Volver', 'AbrirOjos', 'CerrarOjos', 'Acostarse', 'Pararse', 'Soniar', 'Procedimiento'],
    expectations: {
      simpleRepetition: false
    }
  },
  {
    id: 3,
    nombre: 'NoMeCansoDeSaltar',
    escena: 'NoMeCansoDeSaltar',
    bloques: ['SaltarHablando', 'Procedimiento', 'Repetir'],
    expectations: {
      decomposition: false
    }
  },
  {
    id: 4,
    nombre: 'ElMarcianoEnElDesierto',
    escena: 'ElMarcianoEnElDesierto',
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'ComerManzana', 'Procedimiento', 'Repetir']
  },
  {
    id: 5,
    nombre: 'TitoEnciendeLuces',
    escena: 'TitoEnciendeLuces',
    bloques: ['EncenderLuz', 'MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'Procedimiento', 'Repetir']
  },
  {
    id: 6,
    nombre: 'ElAlienYLasTuercas',
    escena: 'AlienLevantaTuercas',
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'LevantaTuerca', 'Procedimiento', 'Repetir']
  },
  {
    id: 7,
    nombre: 'ElRecolectorDeEstrellas',
    escena: 'ElRecolectorDeEstrellas',
    bloques: ['MoverACasillaDerecha', 'MoverACasillaArriba', 'VolverABordeIzquierdo', 'TomarEstrella', 'Procedimiento', 'Repetir']
  },
  {
    id: 8,
    nombre: 'MariaLaComeSandias',
    escena: 'MariaLaComeSandias',
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'MorderSandia', 'Procedimiento', 'Repetir']
  },
  {
    id: 9,
    nombre: 'AlimentandoALosPeces',
    escena: 'AlimentandoALosPeces',
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'AlimentarPez', 'AgarrarComida', 'Procedimiento', 'Repetir']
  },
  {
    id: 10,
    nombre: 'InstalandoJuegos',
    escena: 'InstalandoJuegos',
    bloques: ['PasarASiguienteComputadora', 'PrenderComputadora', 'ApagarComputadora', 'EscribirC', 'EscribirB', 'EscribirA', 'InstalarJuego', 'Repetir', 'Procedimiento'],
  },
  {
    id: 11,
    nombre: 'LaGranAventuraDelMarEncantado',
    escena: 'LaGranAventuraDelMarEncantado',
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'AgarrarLlave', 'AbrirCofre', 'DarSombrero', 'AtacarConEspada', 'EscaparEnUnicornio', 'Repetir', 'Procedimiento'],
    expectations: {
      decomposition: true,
    },
  },
  {
    id: 12,
    nombre: 'ReparandoLaNave',
    escena: 'ReparandoLaNave',
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'TomarHierro', 'TomarCarbon', 'Depositar', 'Escapar', 'Repetir', 'Procedimiento'],
  },
  {
    id: 13,
    nombre: 'ElMonoYLasBananas',
    escena: 'ElMonoYLasBananas',
    bloques: ['ComerBanana', 'AvanzarMono', 'TocandoBanana', 'Repetir', 'Procedimiento', 'Si'],
    expectations: {
      conditionalAlternative: true,
      decomposition: false
    },
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 14,
    nombre: 'LaEleccionDelMono',
    escena: 'LaEleccionDelMono',
    bloques: ['ComerBanana', 'ComerManzana', 'AvanzarMono', 'Procedimiento', 'Repetir', 'Si', 'SiNo', 'TocandoManzana', 'TocandoBanana'],
    expectations: {
      conditionalAlternative: true,
      decomposition: false
    },
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 15,
    nombre: 'LaberintoCorto',
    escena: 'LaberintoCorto',
    bloques: ['Procedimiento', 'Repetir', 'Si', 'SiNo', 'MoverACasillaDerecha',
      'MoverACasillaAbajo', 'TocandoAbajo', 'TocandoDerecha'],
    expectations: {
      conditionalAlternative: true,
      decomposition: false
    }
  },
  {
    id: 16,
    nombre: 'TresNaranjas',
    escena: 'TresNaranjas',
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'ComerNaranja', 'Repetir', 'Si', 'SiNo', 'TocandoNaranja']
  },
  {
    id: 17,
    nombre: 'TitoRecargado',
    escena: 'TitoRecargado',
    bloques: ['EncenderLuz', 'MoverACasillaAbajo', 'Procedimiento', 'Repetir', 'Si', 'SiNo', 'TocandoLuz']
  },
  {
    id: 18,
    nombre: 'LaberintoLargo',
    escena: 'LaberintoLargo',
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaAbajo',
      'Repetir', 'Si', 'SiNo', 'TocandoAbajo', 'TocandoDerecha'],
  },
  {
    id: 19,
    nombre: 'SuperTito1',
    escena: 'SuperTito1',
    bloques: ['Procedimiento', 'EncenderLuz', 'MoverACasillaAbajo',
      'TocandoFinal', 'Repetir', 'Si', 'SiNo', 'Hasta'],
    expectations: {
      conditionalRepetition: true,
    }
  },
  {
    id: 20,
    nombre: 'SuperTito2',
    escena: 'SuperTito2',
    bloques: ['Procedimiento', 'TocandoFinal', 'TocandoLuz', 'EncenderLuz',
      'MoverACasillaAbajo', 'Repetir', 'Si', 'SiNo', 'Hasta'],
    expectations: {
      conditionalRepetition: true,
    }
  },
  {
    id: 21,
    nombre: 'LaberintoConQueso',
    escena: 'LaberintoConQueso',
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaAbajo',
      'ComerQueso', 'Repetir', 'Si', 'SiNo', 'Hasta', 'TocandoAbajo',
      'TocandoDerecha', 'TocandoFinCamino', 'TocandoQueso'],
    expectations: {
      conditionalRepetition: true,
    }
  },
  {
    id: 22,
    nombre: 'ElDetectiveChaparro',
    escena: 'ElDetectiveChaparro',
    bloques: ['Repetir', 'Si', 'SiNo', 'Hasta', 'Procedimiento',
      'IrAlPrimerSospechoso', 'IrAlSiguienteSospechoso', 'InterrogarSospechoso',
      'EsCulpable'],
    expectations: {
      conditionalRepetition: true,
    }
  },
  {
    id: 23,
    nombre: 'FutbolRobots',
    escena: 'FutbolRobots',
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaIzquierda', 'SiguienteFila',
      'PatearPelota', 'TocandoInicio', 'TocandoPelota', 'Repetir', 'Si',
      'SiNo', 'Hasta'],
    expectations: {
      conditionalRepetition: true,
    }
  },
  {
    id: 24,
    nombre: 'PrendiendoLasCompus',
    escena: 'PrendiendoLasCompus',
    bloques: ['Procedimiento', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'MoverACasillaDerecha', 'MoverACasillaArriba',
      'MoverACasillaAbajo', 'MoverACasillaIzquierda',
      'PrenderComputadora', 'EstoyEnEsquina'],
    expectations: {
      conditionalRepetition: true,
    }
  },
  {
    id: 25,
    nombre: 'ElMonoQueSabeContar',
    escena: 'ElMonoQueSabeContar',
    bloques: ['Procedimiento', 'MoverACasillaArriba', 'MoverACasillaAbajo',
      'SiguienteColumna', 'ContarBanana', 'ContarManzana',
      'TocandoBanana', 'TocandoManzana', 'Repetir', 'Si', 'SiNo',
      'Hasta', 'EstoySobreElInicio', 'EstoySobreElFinal'],
    expectations: {
      conditionalRepetition: true,
    }
  },
  {
    id: 26,
    nombre: 'ElSuperviaje',
    escena: 'SuperViaje',
    bloques: ['Procedimiento', 'KmsTotales', 'Avanzar1km', 'RepetirVacio',
      'Repetir', 'Si', 'SiNo', 'Hasta'],
    expectations: {
      decomposition: false
    }
  },
  {
    id: 27,
    nombre: 'ElMonoCuentaDeNuevo',
    escena: 'ElMonoCuentaDeNuevo',
    bloques: ['Procedimiento', 'MoverACasillaArriba', 'MoverACasillaAbajo',
      'SiguienteColumna',
      'ContarBanana', 'ContarManzana', 'TocandoBanana',
      'TocandoManzana', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'EstoySobreElInicio', 'LargoColumnaActual']
  },
  {
    id: 28,
    nombre: 'ElPlanetaDeNano',
    escena: 'ElPlanetaDeNano',
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaArriba',
      'VolverAlBordeIzquierdo', 'ComerBanana', 'RepetirVacio', 'Repetir', 'Si',
      'SiNo', 'Hasta', 'Numero'],
    expectations: {
      decomposition: false,
      decomposition9: true
    }
  },
  {
    id: 29,
    nombre: 'DibujandoAlCuadrado',
    escena: 'DibujandoCuadrado',
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero']
  },
  {
    id: 30,
    nombre: 'DibujandoRayuelaRobotica',
    escena: 'Dibujando5CuadradosHorizontal',
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'SaltarHaciaAdelante']
  },
  {
    id: 31,
    nombre: 'DibujandoCortoPorLaDiagonal',
    escena: 'Dibujando5CuadradosDiagonal',
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'SaltarHaciaAdelante']
  },
  {
    id: 32,
    nombre: 'DibujandoMamushkaCuadrada',
    escena: 'Dibujando4CuadradosInteriores',
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'SaltarHaciaAdelante']
  },
  {
    id: 33,
    nombre: 'DibujandoEscaleraCuadrada',
    escena: 'DibujandoCabezaElefante',
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'SaltarHaciaAdelante']
  },
  {
    id: 34,
    nombre: 'DibujandoHexagono',
    escena: 'DibujandoHexagono',
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante']
  },
  {
    id: 35,
    nombre: 'DibujandoPiramideInvertida',
    escena: 'DibujandoTrianguloEquilatero',
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante']
  },
  {
    id: 36,
    nombre: 'DibujandoFigurasDentroDeFiguras',
    escena: 'DibujandoPoligonosInteriores',
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante']
  },
  {
    id: 37,
    nombre: 'DibujandoLaCuevaDeEstalagtitas',
    escena: 'DibujandoCuevaEstalagtitas',
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante']
  },
  {
    id: 38,
    nombre: 'LasRocasDeNano',
    escena: 'LasRocasDeNano',
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'MoverACasillaIzquierda',
      'ComerBanana', 'Repetir', 'Si', 'SiNo', 'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha']
  },
  {
    id: 39,
    nombre: 'LosCaminosDeNano',
    escena: 'LosCaminosDeNano',
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'MoverACasillaIzquierda',
      'ComerBanana', 'Repetir', 'Si', 'SiNo', 'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha'],
    expectations: {
      decomposition: false,
      decomposition9: true
    }
  },
  {
    id: 40,
    nombre: 'UnaFiestaArruinada',
    escena: 'UnaFiestaArruinada',
    bloques: ['Procedimiento', 'Repetir', 'Si', 'SiNo', 'MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'ExplotarGlobo', 'TocandoGlobo']
  },
  {
    id: 41,
    nombre: 'RedecorandoFiestas',
    escena: 'RedecorandoFiestas',
    bloques: ['Procedimiento', 'Repetir', 'Si', 'SiNo', 'MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'ExplotarGlobo', 'TocandoGlobo'],
    expectations: {
      decomposition: false,
      decomposition9: true
    }
  },
  {
    id: 42,
    nombre: 'ElDesiertoMultiFrutal',
    escena: 'ElDesiertoMultiFrutal',
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'ComerNaranja', 'ComerManzana', 'Procedimiento', 'Repetir', 'TocandoNaranja', 'TocandoManzana', 'Si', 'SiNo'],
    expectations: {
      decomposition: false,
      decomposition9: true
    }
  },
  {
    id: 43,
    nombre: 'ElPasilloCurvoDeSandias',
    escena: 'ElPasilloCurvoDeSandias',
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'MorderSandia', 'Procedimiento', 'Repetir', 'Si', 'SiNo', 'TocandoSandia'],
    expectations: {
      decomposition: false,
      decomposition9: true
    }
  },
  {
    id: 44,
    nombre: 'ElFestinFrutal',
    escena: 'ElFestinFrutal',
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'ComerBanana', 'ComerManzana', 'Procedimiento', 'Repetir', 'Si', 'SiNo', 'TocandoManzana', 'TocandoBanana']
  },
  {
    id: 45,
    nombre: 'RecolectorDeGalaxias',
    escena: 'RecolectorDeGalaxias',
    bloques: ['MoverACasillaDerecha', 'MoverACasillaArriba', 'VolverABordeIzquierdo', 'TomarEstrella', 'TocandoEstrella', 'Procedimiento', 'Repetir', 'Si', 'SiNo']
  },
  {
    id: 130,
    nombre: 'LaFiestaDeDracula',
    escena: 'LaFiestaDeDracula',
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'Numero',
      'OpAritmetica', 'CambiarColor', 'SiguienteFoco', 'EmpezarFiesta'],
  },
  {
    id: 131,
    nombre: 'SalvandoLaNavidad',
    escena: 'SalvandoLaNavidad',
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'MoverACasillaDerecha', 'DejarRegalo', 'SiguienteFilaTotal', 'Numero', 'OpAritmetica'],
  },
  {
    id: 132,
    nombre: 'PrendiendoLasCompusParametrizado',
    escena: 'PrendiendoLasCompus',
    deshabilitado: false,
    bloques: ['ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo',
      'MoverA', 'Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'PrenderComputadora', 'EstoyEnEsquina', 'Numero',
      'OpAritmetica'],
  },
  {
    id: 133,
    nombre: 'TitoCuadrado',
    escena: 'TitoCuadrado',
    bloques: ['ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo',
      'MoverA', 'Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'TocandoLuz', 'EncenderLuz', 'Numero', 'OpAritmetica'],
  },
  {
    id: 134,
    nombre: 'ElCangrejoAguafiestas',
    escena: 'ElCangrejoAguafiestas',
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo', 'MoverA',
      'ExplotarGlobo', 'Numero', 'OpAritmetica']
  },
  {
    id: 135,
    nombre: 'PrendiendoLasFogatas',
    escena: 'PrendiendoLasFogatas',
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
    imagen: 'DibujoLibre',
    escena: `new DibujandoLibremente()`,
    hasAutomaticGrading: false,
    bloques: ['Procedimiento', 'Repetir', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante'],
    expectations: {
      decomposition: false,
      simpleRepetition: false
    }
  },

  {
    id: 201,
    nombre: '3.1.2a',
    escena: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,-,-,-,O,-],\
      [-,A,-,-,P,-],\
      [-,-,-,O,-,-],\
      [O,O,O,O,-,O],\
    ")`,
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
    escena: `new EscenaDuba("\
        [O,O,O,O,O,O],\
        [O,O,O,O,O,O],\
        [O,-,O,-,P,O],\
        [O,-,A,-,O,O],\
        [O,O,-,O,O,O],\
        [O,O,O,O,O,O],\
    ")`,
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
    escena: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O],\
      [O,A,O,-,-,O],\
      [O,-,-,-,P,O],\
      [O,-,O,-,-,O],\
      [O,O,O,O,O,O],\
    ")`,
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
    escena: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,-,A,O,O,O],\
      [O,O,-,O,O,O],\
      [O,O,-,-,-,O],\
      [O,O,O,P,-,O],\
      [O,O,O,O,O,O],\
    ")`,
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
    escena: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,O,-,O,-,O],\
      [O,-,A,-,-,O],\
      [O,-,-,O,-,O],\
      [O,O,-,-,P,O],\
      [O,O,O,O,O,O],\
    ")`,
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
    escena: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,-,-,-,-,O],\
      [O,-,O,P,-,O],\
      [O,A,O,-,O,O],\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O],\
    ")`,
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
    escena: `new EscenaCoty(
      [{x:125,y:75},{x:125,y:-175},{x:-25,y:-175},{x:-25,y:-75},{x:25,y:-75},{x:25,y:-175},{x:-125,y:-175},{x:-125,y:125},{x:-75,y:125},{x:-75,y:75},{x:-25,y:75},{x:-25,y:125},{x:25,y:125},{x:25,y:75}],
      [{x:25,y:75},{x:75,y:75},{x:75,y:125},{x:125,y:125},{x:125,y:75}],
      {xCoty: 25, yCoty: 75}
    )`,
    estiloToolbox: 'sinCategorias',
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando']
  },
  {
    id: 208,
    nombre: '3.1.3b',
    escena: `new EscenaCoty(
      [{x:-50,y:25},{x:0,y:100},{x:50,y:25}],
      [{x:-50,y:25},{x:0,y:25},{x:50,y:25},{x:50,y:-25},{x:50,y:-75},{x:0,y:-75},{x:-50,y:-75},{x:-50,y:-25},{x:-50,y:25}],
      {xCoty: -50, yCoty: 25}
    )`,
    estiloToolbox: 'sinCategorias',
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando']
  },
  {
    id: 209,
    nombre: '3.1.3c',
    escena: `new EscenaCoty(
      [],
      [[ {x:-125,y:0}, {x:-75,y:0}],[ {x:-25,y:0}, {x:25,y:0}],[ {x:75,y:0}, {x:125,y:0}]],
      {xCoty: 125, yCoty: 0}
    )`,
    estiloToolbox: 'sinCategorias',
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda']
  },
  {
    id: 210,
    nombre: '3.1.3d',
    escena: `new EscenaCotySonrisa()`,
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
    escena: `new EscenaCoty(
      [[{x:-55,y:50},{x:-150,y:50},{x:-150,y:0},{x:-50,y:0}],[{x:-75,y:0},{x:-75,y:-100},{x:-125,y:-100},{x:-125,y:0}],[{x:-25,y:0},{x:25,y:0},{x:25,y:-100},{x:-25,y:-100},{x:-25,y:0}],[{x:125,y:0},{x:125,y:-100},{x:75,y:-100},{x:75,y:0}],[{x:50,y:0},{x:150,y:0},{x:150,y:50},{x:50,y:50}]],
      [{x:-50,y:0},{x:0,y:0},{x:50,y:0},{x:50,y:50},{x:0,y:50},{x:-50,y:50},{x:-50,y:0}],
      {xCoty: -50, yCoty: 100}      
    )`,
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
    escena: `new EscenaCotyCactus()`,
    estiloToolbox: 'sinCategorias',
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda']
  },
  {
    id: 213,
    nombre: '3.1.3g',
    escena: `new EscenaCotyMate()`,
    estiloToolbox: 'sinCategorias',
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda']
  },
  {
    id: 214,
    nombre: '3.1.4a',
    escena: `new EscenaLita("\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O],\
      [O,A,-,T,L,-],\
      [O,O,O,O,O,E],\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O]\
    ")`,
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
    escena: `new EscenaLita("\
      [O,O,O,O,O],\
      [O,O,O,O,O],\
      [-,-,T,-,-],\
      [-,-,L,-,-],\
      [A,O,O,O,E],\
      [O,O,O,O,O]\
    ")`,
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
    escena: `new EscenaLita("\
      [-,-,-],\
      [-,L,-],\
      [A,-,E],\
      [-,T,-]\
    ")`,
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
    escena: `new EscenaLita("\
      [-,-,-,-],\
      [-,L,T,-],\
      [A,-,-,E],\
      [-,-,-,-]\
    ")`,
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
    escena: `new EscenaLita("\
      [-,A,-],\
      [L,E,T],\
      [-,-,-],\
      [-,-,-]\
    ")`,
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
    escena: `new EscenaLita("\
      [-,-,A],\
      [-,L,T],\
      [-,-,E]\
    ")`,
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
    escena: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,P,O,-,-,O],\
      [O,-,O,-,-,-],\
      [O,-,-,-,O,A],\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O],\
    ")`,
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
    escena: `new EscenaDuba("\
        [O,O,O,O,O,O],\
        [O,-,-,O,O,O],\
        [O,-,P,O,O,O],\
        [O,-,-,O,O,O],\
        [O,-,-,-,A,O],\
        [O,O,O,O,O,O],\
    ")`,
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
    escena: `new EscenaDuba("\
        [O,O,O,O,O,O],\
        [O,P,O,A,O,O],\
        [O,-,O,-,O,O],\
        [O,-,-,-,O,O],\
        [O,-,-,O,O,O],\
        [O,O,O,O,O,O],\
    ")`,
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
    escena: `new EscenaDuba("\
        [O,O,O,O,O,O],\
        [O,O,-,-,-,O],\
        [O,-,P,-,-,O],\
        [O,-,O,O,O,O],\
        [O,-,-,A,-,O],\
        [O,O,O,O,O,O],\
    ")`,
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
    escena: `new EscenaTotoLector([
        ['A', 'r', 'e'],
        ['t', 'o', 'j'],
        ['i', 't', 'o'],
    ], "toto")`,
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
    escena: `new EscenaTotoLector([
        ['r', 'h', 'j', 'a'],
        ['z', 'A', 'a', 'm'],
        ['y', 'l', 'l', 'q']
    ], "llama")`,
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
    escena: `new EscenaTotoLector([
        ['a', 'm', 'A'],
        ['f', 'u', 'p'],
        ['r', 'y', 'a'],
    ], "puma")`,
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
    escena: `new EscenaTotoLector([
        ['A', 'c', 'a', 'b'],
        ['o', 'l', 'l', 'e'],
    ], "caballo")`,
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
    escena: `new EscenaTotoLector([
        ['w', 'a', 'r'],
        ['u', 'n', 'e'],
        ['l', 'A', 's'],
    ], "lunes", 7)`,
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
    escena: `new EscenaCoty(
      [],
      [[{x:-130,y:20},{x:-90,y:20}], [{x:-50,y:20},{x:-10,y:20}], [{x:30,y:20},{x:70,y:20}], [{x:110,y:20},{x:150,y:20}]],
      {xCoty: -130, yCoty: 20, longitudSegmento: 40}     
    )`,
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
    escena: `new EscenaCoty(
      [],
      [[{x:-130,y:20},{x:-90,y:20}], [{x:-50,y:20},{x:-10,y:20}], [{x:30,y:20},{x:70,y:20}], [{x:110,y:20},{x:150,y:20},{x:150,y:-20}]],
      {xCoty: -130, yCoty: 20, longitudSegmento: 40}      
    )`,
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
    escena: `new EscenaCoty(
      [],
      [[{x:-120,y:-60},{x:-120,y:-20},{x:-80,y:-20},{x:-40,y:-20},{x:-40,y:20},{x:0,y:20},{x:40,y:20},{x:40,y:60},{x:80,y:60},{x:120,y:60}]],
      {xCoty: -120, yCoty: -60, longitudSegmento: 40}
    )`,
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
    escena: `new EscenaCoty(
      [],
      [[{x:-100,y:-100},{x:-100,y:-50},{x:-50,y:-50},{x:-50,y:0},{x:0,y:0},{x:0,y:50},{x:50,y:50},{x:50,y:100},{x:100,y:100}]],
      {xCoty: -100, yCoty: -100}      
    )`,
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
    escena: `new EscenaCoty(
      [],
      [[{x:-120,y:-60},{x:-120,y:-20},{x:-80,y:-20},{x:-80,y:20},{x:-40,y:20},{x:-40,y:60},{x:0,y:60},{x:40,y:60},{x:40,y:20},{x:80,y:20},{x:80,y:-20},{x:120,y:-20},{x:120,y:-60}]],
      {xCoty: -120, yCoty: -60, longitudSegmento: 40}      
    )`,
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
    escena: `new EscenaLita("\
      [O,-,-,-,O,-,A],\
      [-,-,-,O,O,-,O],\
      [O,O,O,O,-,-,O],\
      [O,O,O,O,-,O,O],\
      [O,-,O,-,-,O,O],\
      [-,-,O,-,O,O,O],\
      [E,L,T,-,O,O,O]\
    ")`,
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
    escena: `new EscenaDuba("[A,P?(0.6)]", {}, [0,1])`,
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
    expectations: {
      conditionalAlternative: true,
    },
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 243,
    nombre: '5.1.3b',
    escena: `new EscenaDuba(["[A,-,-]","[A,P,-]","[A,-,P]","[A,P,P]"], {}, [0,2])`,
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
    expectations: {
      conditionalAlternative: true,
    },
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 244,
    nombre: '5.1.3c',
    escena: `new EscenaCoty(
      [],
      [{x:-120,y:50},{x:20,y:50},{x:20,y:-90},{x:-120,y:-90},{x:-120,y:50}],
      {xCoty: -120, yCoty: 50, puedeHaberCharco: true, longitudSegmento: 140}
    )`,
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
    ],
    expectations: {
      conditionalAlternative: true,
    }
  },
  {
    id: 245,
    nombre: '5.1.4a',
    escena: `new EscenaLita("[A,-,L|T]")`,
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
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 246,
    nombre: '5.1.4b',
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
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 247,
    nombre: '5.1.4c',
    escena: `new EscenaDuba("\
      [O,O,O,O,O],\
      [-,-,*,-,-],\
      [A,-,*,-,P],\
      [O,O,O,O,O],\
    ", { coleccion: ["O"] })`,
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
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 248,
    nombre: '5.2.1a',
    escena: `new EscenaDuba("[A,-,-,-,-,-,-,P?]", {}, [0,7])`,
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
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 249,
    nombre: '5.2.1b',
    escena: `new EscenaDuba("[A,#P,#P,#P,#P,#P,#P,#P]", { macros: { "P": "*>P?" }, coleccion: ["P"] }, [0,7])`,
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
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 250,
    nombre: '5.2.1c',
    escena: `new EscenaLita("[A],[*>L|T],[*>L|T],[*>L|T],[*>L|T],[*>L|T],[*>L|T],[E]", { coleccion: ["T", "L"] })`,
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
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 251,
    nombre: '5.I1a',
    escena: `new EscenaTotoEscritor(new ObjetivoCopiar())`,
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
    escena: `new EscenaTotoEscritor(new ObjetivoX())`,
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
    escena: `new EscenaTotoEscritor(new ObjetivoMicha())`,
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
    escena: `new EscenaTotoEscritor(new ObjetivoJeringozo())`,
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
    imagen: 'Coty',
    escena: `new EscenaCoty([],[],{xCoty: -50, yCoty: 50})`,
    hasAutomaticGrading: false,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda', 'Repetir', 'DibujarLado', 'GirarGrados', 'Numero', 'OpAritmetica']
  },
  //Tecnopolis
  {
    id: 202101,
    nombre: 'tecnopolis2021Modelo',
    imagen: 'Duba',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ],
    escena: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [O,-,-,-,-,-],\
    [-,O,P,-,-,-],\
    [-,-,O,-,-,-],\
    [-,-,-,-,-,-],\
    [-,-,-,-,-,-],\
  ")`,
    estiloToolbox: 'sinCategorias',
    solucionInicial: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"269\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"MoverACasillaDerecha\">
          <next>
            <block type=\"MoverACasillaDerecha\">
              <next>
                <block type=\"MoverACasillaDerecha\">
                  <next>
                    <block type=\"MoverACasillaAbajo\">
                      <next>
                        <block type=\"ComerChurrasco\"></block>
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
  </xml>`
  },
  {
    id: 202102,
    nombre: 'tecnopolis2021ModeloRepeticion',
    imagen: 'Duba',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    escena: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [O,-,-,-,-,-],\
    [-,O,P,-,-,-],\
    [-,-,O,-,-,-],\
    [-,-,-,-,-,-],\
    [-,-,-,-,-,-],\
  ")`,
    estiloToolbox: 'sinCategorias',
    solucionInicial: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"repetir\">
          <value name=\"count\">
            <shadow type=\"required_value\"></shadow>
            <block type=\"math_number\">
              <field name=\"NUM\">3</field>
            </block>
          </value>
          <statement name=\"block\">
            <shadow type=\"required_statement\"></shadow>
            <block type=\"MoverACasillaDerecha\"></block>
          </statement>
          <next>
            <block type=\"MoverACasillaAbajo\">
              <next>
                <block type=\"ComerChurrasco\"></block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`
  },
  //Duba
  {
    id: 2021001,
    nombre: 'tecnopolis2021DubaNivel1',
    imagen: 'Duba',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    escena: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [-,-,-,-,-,-],\
    [-,-,O,O,-,-],\
    [-,-,O,O,-,P],\
    [-,-,-,-,-,P],\
    [-,-,-,-,-,-],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  {
    id: 2021002,
    nombre: 'tecnopolis2021DubaNivel2',
    imagen: 'Duba',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    escena: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [O,-,-,-,-,-],\
    [-,O,-,-,-,-],\
    [-,-,O,-,-,-],\
    [-,-,-,O,-,-],\
    [-,-,-,-,O,P],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  {
    id: 2021003,
    nombre: 'tecnopolis2021DubaNivel3',
    imagen: 'Duba',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    escena: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [O,O,O,O,O,-],\
    [-,-,-,-,-,-],\
    [-,-,-,-,-,-],\
    [-,-,-,-,O,O],\
    [-,-,-,-,-,P],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  {
    id: 2021004,
    nombre: 'tecnopolis2021DubaNivel4',
    imagen: 'Duba',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    escena: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [-,P,-,-,-,-],\
    [-,-,P,-,-,-],\
    [-,-,-,P,-,-],\
    [-,-,-,-,P,-],\
    [-,-,-,-,-,-],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  {
    id: 2021005,
    nombre: 'tecnopolis2021DubaNivel5',
    imagen: 'Duba',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    escena: `new EscenaDuba("\
    [A,-,-,-,-,P],\
    [-,O,O,O,O,-],\
    [-,-,-,-,O,-],\
    [O,O,-,-,O,-],\
    [-,O,O,-,-,-],\
    [-,-,O,-,-,P],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  {
    id: 2021006,
    nombre: 'tecnopolis2021DubaNivel6',
    imagen: 'Duba',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    escena: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [-,O,P,O,P,O],\
    [-,O,P,O,P,O],\
    [-,O,P,O,P,O],\
    [-,O,P,O,P,O],\
    [-,O,P,-,P,O],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  {
    id: 2021007,
    nombre: 'tecnopolis2021DubaNivel7',
    imagen: 'Duba',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    escena: `new EscenaDuba("\
    [A,-,-,-,-,O],\
    [-,O,O,O,-,O],\
    [-,O,P,O,-,O],\
    [-,O,-,-,-,O],\
    [-,O,O,O,O,O],\
    [-,-,-,-,-,-],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  {
    id: 2021008,
    nombre: 'tecnopolis2021DubaNivel8',
    imagen: 'Duba',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    escena: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [O,O,-,-,O,O],\
    [-,O,-,-,O,-],\
    [-,-,-,-,-,-],\
    [O,O,-,-,O,O],\
    [P,-,-,-,-,P],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  //Lita
  {
    id: 2021101,
    nombre: 'tecnopolis2021LitaNivel1',
    imagen: 'Lita',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    escena: `new EscenaLita("\
    [A,-,-,-,-,-],\
    [-,-,-,-,-,-],\
    [-,-,O,O,-,-],\
    [-,-,O,O,-,-],\
    [-,-,-,-,-,E],\
    [L,-,-,-,-,T],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  {
    id: 2021102,
    nombre: 'tecnopolis2021LitaNivel2',
    imagen: 'Lita',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    escena: `new EscenaLita("\
    [A,-,-,-,-,-],\
    [O,-,-,-,-,-],\
    [-,O,-,L,-,-],\
    [-,-,O,T,L,-],\
    [-,-,-,O,T,-],\
    [-,-,-,-,O,E],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  {
    id: 2021103,
    nombre: 'tecnopolis2021LitaNivel3',
    imagen: 'Lita',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    escena: `new EscenaLita("\
    [A,-,-,-,-,T],\
    [O,O,O,O,O,-],\
    [-,-,-,-,-,-],\
    [-,-,-,-,-,L],\
    [-,-,-,-,O,O],\
    [-,-,-,-,-,E],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  {
    id: 2021104,
    nombre: 'tecnopolis2021LitaNivel4',
    imagen: 'Lita',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    escena: `new EscenaLita("\
    [A,L,-,-,-,-],\
    [-,T,L,-,-,-],\
    [-,-,T,L,-,-],\
    [-,-,-,T,L,-],\
    [-,-,-,-,T,-],\
    [-,-,-,-,-,E],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  {
    id: 2021105,
    nombre: 'tecnopolis2021LitaNivel5',
    imagen: 'Lita',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    escena: `new EscenaLita("\
    [A,T,T,T,T,T],\
    [-,O,O,O,O,L],\
    [-,-,-,-,O,L],\
    [O,O,-,-,O,L],\
    [-,O,O,-,O,L],\
    [-,-,O,E,-,L],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  {
    id: 2021106,
    nombre: 'tecnopolis2021LitaNivel6',
    imagen: 'Lita',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    escena: `new EscenaLita("\
    [A,-,L,-,-,E],\
    [-,O,L,O,T,O],\
    [-,O,L,O,T,O],\
    [-,O,L,O,T,O],\
    [-,O,L,O,T,O],\
    [-,O,-,-,T,O],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  {
    id: 2021107,
    nombre: 'tecnopolis2021LitaNivel7',
    imagen: 'Lita',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    escena: `new EscenaLita("\
    [A,L,L,L,L,O],\
    [-,O,O,O,-,O],\
    [-,O,E,O,-,O],\
    [-,O,-,T,T,O],\
    [-,O,O,O,O,O],\
    [-,-,-,-,-,-],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  {
    id: 2021108,
    nombre: 'tecnopolis2021LitaNivel8',
    imagen: 'Lita',
    bloques: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    escena: `new EscenaLita("\
    [A,-,L,-,-,-],\
    [O,O,-,-,O,O],\
    [-,O,-,-,O,-],\
    [-,-,-,-,-,-],\
    [O,O,-,-,O,O],\
    [T,-,-,-,-,E],\
  ")`,
    estiloToolbox: 'sinCategorias',
  },
  //Coty
  {
    id: 2021201, //Copy of 207
    nombre: 'tecnopolis2021CotyNivel1',
    imagen: 'Coty',
    escena: `new EscenaCoty(
      [{x:125,y:75},{x:125,y:-175},{x:-25,y:-175},{x:-25,y:-75},{x:25,y:-75},{x:25,y:-175},{x:-125,y:-175},{x:-125,y:125},{x:-75,y:125},{x:-75,y:75},{x:-25,y:75},{x:-25,y:125},{x:25,y:125},{x:25,y:75}],
      [{x:25,y:75},{x:75,y:75},{x:75,y:125},{x:125,y:125},{x:125,y:75}],
      {xCoty: 25, yCoty: 75}
    )`,
    estiloToolbox: 'sinCategorias',
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando']
  },
  {
    id: 2021202, //Copy of 209
    nombre: 'tecnopolis2021CotyNivel2',
    imagen: 'Coty',
    escena: `new EscenaCoty(
      [],
      [[ {x:-125,y:0}, {x:-75,y:0}],[ {x:-25,y:0}, {x:25,y:0}],[ {x:75,y:0}, {x:125,y:0}]],
      {xCoty: 125, yCoty: 0}
    )`,
    estiloToolbox: 'sinCategorias',
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda']
  },
  {
    id: 2021203, //Copy of 213
    nombre: 'tecnopolis2021CotyNivel3',
    imagen: 'Coty',
    escena: `new EscenaCotyMate()`,
    estiloToolbox: 'sinCategorias',
    bloques: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda']
  },
  {
    id: 2021204, //Copy of 233
    nombre: 'tecnopolis2021CotyNivel4',
    imagen: 'Coty',
    escena: `new EscenaCoty(
      [],
      [[{x:-130,y:20},{x:-90,y:20}], [{x:-50,y:20},{x:-10,y:20}], [{x:30,y:20},{x:70,y:20}], [{x:110,y:20},{x:150,y:20}]],
      {xCoty: -130, yCoty: 20, longitudSegmento: 40}     
    )`,
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
    id: 2021205, //Copy of 235
    nombre: 'tecnopolis2021CotyNivel5',
    imagen: 'Coty',
    escena: `new EscenaCoty(
      [],
      [[{x:-120,y:-60},{x:-120,y:-20},{x:-80,y:-20},{x:-40,y:-20},{x:-40,y:20},{x:0,y:20},{x:40,y:20},{x:40,y:60},{x:80,y:60},{x:120,y:60}]],
      {xCoty: -120, yCoty: -60, longitudSegmento: 40}
    )`,
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
    id: 2021206,
    nombre: 'tecnopolis2021CotyNivel6',
    imagen: 'Coty',
    escena: `new EscenaCoty(
      [[{x:-104,y:12},{x:-78,y:12}],[{x:-104,y:12},{x:-104,y:-30}],[{x:-104,y:-9},{x:-78,y:-9}],[{x:-104,y:-30},{x:-78,y:-30}],[{x:-70,y:12},{x:-44,y:12}],[{x:-70,y:12},{x:-70,y:-30},{x:-44,y:-30}],[{x:-36,y:12},{x:-36,y:-30}],[{x:-36,y:12},{x:-30,y:4},{x:-28,y:0},{x:-19,y:-12},{x:-17,y:-16},{x:-14,y:-19},{x:-8,y:-27}],[{x:-10,y:12},{x:-10,y:-30}],[{x:-2,y:12},{x:24,y:12}],[{x:-2,y:12},{x:-2,y:-30}],[{x:24,y:12},{x:24,y:-30}],[{x:-2,y:-30},{x:24,y:-30}],[{x:32,y:12},{x:58,y:12}],[{x:32,y:12},{x:32,y:-30}],[{x:32,y:-9},{x:58,y:-9}],[{x:58,y:12},{x:58,y:-12}],[{x:66,y:12},{x:92,y:12}],[{x:66,y:12},{x:66,y:-30}],[{x:92,y:12},{x:92,y:-30}],[{x:66,y:-30},{x:92,y:-30}],[{x:100,y:12},{x:100,y:-30},{x:126,y:-30}],[{x:142,y:12},{x:142,y:-30}],[{x:150,y:12},{x:176,y:12}],[{x:150,y:12},{x:150,y:-12}],[{x:150,y:-9},{x:176,y:-9},{x:176,y:-33}],[{x:150,y:-30},{x:176,y:-30}]],
      [[{x:-180,y:70},{x:-80,y:70}],[{x:-130,y:70},{x:-130,y:-30}]],
      {xCoty: -130, yCoty: 70}
    )`,
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
    id: 2021207,
    nombre: 'tecnopolis2021CotyNivel7',
    imagen: 'Coty',
    escena: `new EscenaCoty(
      [],
      [[{x:-150,y:0},{x:-150,y:50},{x:-100,y:50},{x:-100,y:0}],[{x:-100,y:-50},{x:-50,y:-50}],[{x:-50,y:0},{x:-50,y:50},{x:0,y:50},{x:0,y:0}],[{x:0,y:-50},{x:50,y:-50}],[{x:50,y:0},{x:50,y:50},{x:100,y:50},{x:100,y:0}],[{x:100,y:-50},{x:150,y:-50}]],
      {xCoty: -150, yCoty: 0}
    )`,
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
  //Toto
  {
    id: 2021301, //Copy of 225
    nombre: 'tecnopolis2021TotoNivel1',
    imagen: 'Toto',
    escena: `new EscenaTotoLector([
        ['A', 'r', 'e'],
        ['t', 'o', 'j'],
        ['i', 't', 'o'],
    ], "toto")`,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
  },
  {
    id: 2021302, //Copy of 226
    nombre: 'tecnopolis2021TotoNivel2',
    imagen: 'Toto',
    escena: `new EscenaTotoLector([
        ['r', 'h', 'j', 'a'],
        ['z', 'A', 'a', 'm'],
        ['y', 'l', 'l', 'q']
    ], "llama")`,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
  },
  {
    id: 2021303, //Copy of 227
    nombre: 'tecnopolis2021TotoNivel3',
    imagen: 'Toto',
    escena: `new EscenaTotoLector([
        ['a', 'm', 'A'],
        ['f', 'u', 'p'],
        ['r', 'y', 'a'],
    ], "puma")`,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
  },
  {
    id: 2021304, //Copy of 229
    nombre: 'tecnopolis2021TotoNivel4',
    imagen: 'Toto',
    escena: `new EscenaTotoLector([
        ['w', 'a', 'r'],
        ['u', 'n', 'e'],
        ['l', 'A', 's'],
    ], "lunes", 7)`,
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
    id: 2021305,
    nombre: 'tecnopolis2021TotoNivel5',
    imagen: 'Toto',
    escena: `new EscenaTotoLector([
        ['A','t', 'e', 'l', 'j'],
        ['i','s', 'c', 'n', 'o'],
        ['l','o', 'p', 'o', 'v'],
    ], "tecnopolis")`,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
  },
  {
    id: 2021306,
    nombre: 'tecnopolis2021TotoNivel6',
    imagen: 'Toto',
    escena: `new EscenaTotoLector([
        ['d','A','o'],
        ['z','n','a'],
        ['g','e','c'],
        ['r','u','d'],
        ['w','q','t'],
        ['x','u','a'],
        ['j','e','r'],
        ['y','n','v']
    ], "neuquen")`,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
      'Repetir'
    ],
  },
  {
    id: 2021307,
    nombre: 'tecnopolis2021TotoNivel7',
    imagen: 'Toto',
    escena: `new EscenaTotoLector([
        ['d','A','o'],
        ['z','n','a'],
        ['g','e','c'],
        ['r','u','d'],
        ['w','q','t'],
    ], "neuquen")`,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
      'Repetir'
    ],
  },
  {
    id: 2021308,
    nombre: 'tecnopolis2021TotoNivel8',
    imagen: 'Toto',
    escena: `new EscenaTotoLector([
      ['t','a','q','m','e','v','o','g','r','a','u'],
      ['n','A','s','a','n','t','a','c','r','u','a'],
      ['f','d','i','u','v','r','e','o','h','z','d'],
    ], "santacruz")`,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
      'Repetir'
    ],
  },
  {
    id: 2021309,
    nombre: 'tecnopolis2021TotoNivel9',
    imagen: 'Toto',
    escena: `new EscenaTotoLector([
      ['f','d','h','w','t'],
      ['e','a','z','b','u'],
      ['r','x','h','u','y'],
      ['t','A','c','i','k'],
    ], "chubut")`,
    estiloToolbox: 'sinCategorias',
    bloques: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
      'Repetir'
    ],
    debugging: true,
    solucionInicial: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"269\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"repetir\">
          <value name=\"count\">
            <shadow type=\"required_value\"></shadow>
            <block type=\"math_number\">
              <field name=\"NUM\">3</field>
            </block>
          </value>
          <statement name=\"block\">
            <shadow type=\"required_statement\"></shadow>
            <block type=\"MoverLeyendoArriba\">
              <next>
                <block type=\"MoverLeyendoDerecha\"></block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
  },

];