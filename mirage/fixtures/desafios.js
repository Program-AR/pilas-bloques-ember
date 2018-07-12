export default [
  {
    id: 1,
    grupoId: 1,
    nombre: 'AlienTocaBoton',
    titulo: 'titulo-alien',
    enunciado: 'enunciado-alien',
    consignaInicial: 'consigna-alien',
    escena: 'AlienInicial',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'ApretarBoton']
  },
  {
    id: 2,
    grupoId: 1,
    nombre: 'ElGatoEnLaCalle', // sale de 'id' en 'app/actividades/actividadElGatoEnLaCalle.js'
    titulo: 'titulo-gato', // sale de 'nombre' en 'app/actividades/actividadElGatoEnLaCalle.js'
    enunciado: 'enunciado-gato',
    consignaInicial: 'consigna-gato',
    escena: 'ElGatoEnLaCalle',
    debeFelicitarse: true,
    bloques: ['Saludar', 'Avanzar', 'Volver', 'Abrirojos', 'Cerrarojos', 'Acostarse', 'Pararse', 'Soar', 'Procedimiento']
  },
  {
    id: 3,
    grupoId: 1,
    nombre: 'NoMeCansoDeSaltar',
    titulo: 'titulo-saltar',
    enunciado: 'enunciado-saltar',
    consignaInicial: 'consigna-saltar',
    escena: 'NoMeCansoDeSaltar',
    debeFelicitarse: true,
    bloques:  ['saltar1', 'Procedimiento', 'repetir']
  },
  {
    id: 4,
    grupoId: 1,
    nombre: 'ElMarcianoEnElDesierto',
    titulo: 'titulo-marciano',
    enunciado: 'consigna-marciano',
    consignaInicial: '',
    escena: 'ElMarcianoEnElDesierto',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'ComerManzana', 'Procedimiento', 'repetir']
  },
  {
    id: 5,
    grupoId: 1,
    nombre: 'TitoEnciendeLuces',
    titulo: 'titulo-tito',
    enunciado: 'enunciado-tito',
    consignaInicial: 'consigna-tito',
    escena: 'TitoEnciendeLuces',
    debeFelicitarse: true,
    bloques: ['EncenderLuz', 'MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'Procedimiento', 'repetir']
  },
  {
    id: 6,
    grupoId: 1,
    nombre: 'ElAlienYLasTuercas',
    titulo: 'titulo-alien-tuercas',
    enunciado: 'enunciado-alien-tuercas',
    escena: 'AlienLevantaTuercas',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo',  'LevantaTuerca', 'Procedimiento', 'repetir']
  },
  {
    id: 7,
    grupoId: 1,
    nombre: 'ElRecolectorDeEstrellas',
    titulo: 'titulo-recolector',
    enunciado: 'enunciado-recolector',
    consignaInicial: 'consigna-recolector',
    escena: 'ElRecolectorDeEstrellas',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaArriba', 'VolverABordeIzquierdo', 'TomarEstrella', 'Procedimiento', 'repetir']
  },
  {
    id: 8,
    grupoId: 1,
    nombre: 'MariaLaComeSandias',
    titulo: 'titulo-maria',
    enunciado: 'enunciado-maria',
    escena: 'MariaLaComeSandias',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo',  'MorderSandia', 'Procedimiento', 'repetir']
  },
  {
    id: 9,
    grupoId: 1,
    nombre: 'AlimentandoALosPeces',
    titulo: 'titulo-peces',
    enunciado: 'enunciado-peces',
    consignaInicial: '',
    escena: 'AlimentandoALosPeces',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo',  'AlimentarPez', 'AgarrarComida', 'Procedimiento', 'repetir']
  },
  {
    id: 10,
    grupoId: 1,
    nombre: 'InstalandoJuegos',
    titulo: 'titulo-juegos',
    enunciado: 'enunciado-juegos',
    escena: 'InstalandoJuegos',
    debeFelicitarse: true,
    bloques: ['SiguienteCompu', 'PrenderCompu', 'ApagarCompu', 'EscribirC', 'EscribirB', 'EscribirA', 'InstalarJuego', 'repetir', 'Procedimiento'],
  },
  {
    id: 11,
    grupoId: 1,
    nombre: 'LaGranAventuraDelMarEncantado',
    titulo: 'titulo-mar-encantado',
    enunciado:  'enunciado-mar-encantado',
    escena: 'LaGranAventuraDelMarEncantado',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'Agarrarllave', 'Abrircofre', 'Darsombrero', 'Atacarconespada', 'Escaparenunicornio', 'repetir', 'Procedimiento'],
  },
  {
    id: 12,
    grupoId: 1,
    nombre: 'ReparandoLaNave',
    titulo: 'titulo-nave',
    enunciado: 'enunciado-nave',
    escena: 'ReparandoLaNave',
    debeFelicitarse: true,
    bloques: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'TomarHierro', 'TomarCarbon', 'Depositar', 'Escapar', 'repetir', 'Procedimiento'],
  },
  {
    id: 13,
    grupoId: 2,
    nombre: 'ElMonoYLasBananas',
    titulo: 'titulo-mono',
    enunciado: 'enunciado-mono',
    consignaInicial: 'consigna-mono',
    escena: 'ElMonoYLasBananas',
    debeFelicitarse: true,
    bloques: ['ComerBanana', 'AvanzarMono', 'Tocandobanana', 'repetir', 'Procedimiento', 'si']
  },
  {
    id: 14,
    grupoId: 2,
    nombre: 'LaEleccionDelMono',
    titulo: 'titulo-mono2',
    enunciado: 'enunciado-mono2',
    consignaInicial: 'consigna-mono2',
    escena: 'LaEleccionDelMono',
    debeFelicitarse: true,
    bloques: ['ComerBanana', 'ComerManzana', 'AvanzarMono', 'Procedimiento', 'repetir', 'si', 'sino', 'tocandoManzana', 'tocandoBanana']
  },
  {
    id: 15,
    grupoId: 2,
    nombre: 'LaberintoCorto',
    titulo: 'titulo-laberinto-corto',
    enunciado: 'enunciado-laberinto-corto',
    escena: 'LaberintoCorto',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'Repetir', 'Si', 'Sino', 'MoverACasillaDerecha',
              'MoverACasillaAbajo', 'TocandoAbajo', 'TocandoDerecha'],
  },
  {
    id: 16,
    grupoId: 2,
    nombre: 'TresNaranjas',
    titulo: 'titulo-naranjas',
    enunciado: 'enunciado-naranjas',
    escena: 'TresNaranjas',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'ComerNaranja', 'Repetir', 'Si', 'Sino', 'TocandoNaranja']
  },
  {
    id: 17,
    grupoId: 2,
    nombre: 'TitoRecargado',
    titulo: 'titulo-tito-recargado',
    enunciado: 'enunciado-tito-recargado',
    escena: 'TitoRecargado',
    debeFelicitarse: true,
    bloques: ['EncenderLuz', 'MoverACasillaAbajo', 'Procedimiento', 'Repetir', 'Si', 'Sino', 'TocandoLuz']
  },
  {
    id: 18,
    grupoId: 2,
    nombre: 'LaberintoLargo',
    titulo: 'titulo-laberinto-largo',
    enunciado: 'enunciado-laberinto-largo',
    escena: 'LaberintoLargo',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaAbajo',
              'Repetir', 'Si', 'Sino', 'TocandoAbajo', 'TocandoDerecha'],
  },
  {
    id: 19,
    grupoId: 3,
    nombre: 'SuperTito1',
    titulo: 'titulo-supertito1',
    enunciado: 'enunciado-supertito1',
    consignaInicial: 'consigna-supertito1',
    escena: 'SuperTito1',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'EncenderLuz', 'MoverACasillaAbajo',
              'TocandoFinal', 'Repetir', 'Si', 'Sino', 'Hasta'],
  },
  {
    id: 20,
    grupoId: 3,
    nombre: 'SuperTito2',
    titulo: 'titulo-supertito2',
    enunciado: 'enunciado-supertito2',
    consignaInicial: 'consigna-supertito2',
    escena: 'SuperTito2',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'TocandoFinal', 'TocandoLuz', 'EncenderLuz',
              'MoverACasillaAbajo', 'Repetir', 'Si', 'Sino', 'Hasta']
  },
  {
    id: 21,
    grupoId: 3,
    nombre: 'LaberintoConQueso',
    titulo: 'titulo-laberinto-queso',
    enunciado: 'enunciado-laberinto-queso',
    consignaInicial: 'consigna-laberinto-queso',
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
    titulo: 'titulo-detective',
    enunciado: 'enunciado-detective',
    consignaInicial: 'consigna-detective',
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
    titulo: 'titulo-futbol',
    enunciado: 'enunciado-futbol',
    consignaInicial: 'consigna-futbol',
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
    titulo: 'titulo-compus',
    enunciado: 'enunciado-compus',
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
    titulo: 'titulo-mono-contador',
    enunciado: 'enunciado-mono-contador',
    consignaInicial: 'consigna-mono-contador',
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
    titulo: 'titulo-superviaje',
    enunciado: 'enunciado-superviaje',
    consignaInicial: 'consigna-superviaje',
    escena: 'SuperViaje',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'KmsTotales', 'Avanzar1km', 'RepetirVacio',
              'Repetir', 'Si', 'Sino', 'Hasta'],
  },
  {
    id: 27,
    grupoId: 4,
    nombre: 'ElMonoCuentaDeNuevo',
    titulo: 'titulo-mono-contador2',
    enunciado: 'enunciado-mono-contador2',
    consignaInicial: 'consigna-mono-contador2',
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
    titulo: 'titulo-nano',
    escena: 'ElPlanetaDeNano',
    enunciado: 'enunciado-nano',
    consignaInicial: 'consigna-nano',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaArriba',
              'VolverAlBordeIzquierdo', 'ComerBananaNano', 'RepetirVacio', 'Repetir', 'Si',
              'Sino', 'Hasta', 'Numero'],
  },
  {
    id: 29,
    grupoId: 5,
    nombre: 'DibujandoAlCuadrado',
    titulo: 'titulo-al-cuadrado',
    enunciado: 'enunciado-al-cuadrado',
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
    titulo: 'titulo-rayuela',
    enunciado: 'enunciado-rayuela',
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
    titulo: 'titulo-diagonal',
    enunciado: 'enunciado-diagonal',
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
    titulo: 'titulo-mamushka',
    enunciado: 'enunciado-mamushka',
    consignaInicial: 'consigna-mamushka',
    escena: 'Dibujando4CuadradosInteriores',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero']
  },
  {
    id: 33,
    grupoId: 5,
    nombre: 'DibujandoEscaleraCuadrada',
    titulo: 'titulo-escalera',
    enunciado: 'enunciado-escalera',
    consignaInicial: 'consigna-escalera',
    escena: 'DibujandoCabezaElefante',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero']
  },
  {
    id: 34,
    grupoId: 5,
    nombre: 'DibujandoHexagono',
    titulo: 'titulo-hexagono',
    enunciado: 'enunciado-hexagono',
    consignaInicial: 'consigna-hexagono',
    escena: 'DibujandoHexagono',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero', 'OpAritmetica']
  },
  {
    id: 35,
    grupoId: 5,
    nombre: 'DibujandoPiramideInvertida',
    titulo: 'titulo-piramide',
    enunciado: 'enunciado-piramide',
    consignaInicial: 'consigna-piramide',
    escena: 'DibujandoTrianguloEquilatero',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero', 'OpAritmetica']
  },
  {
    id: 36,
    grupoId: 5,
    nombre: 'DibujandoFigurasDentroDeFiguras',
    titulo: 'titulo-figuras',
    enunciado: 'enunciado-figuras',
    consignaInicial: 'consigna-figuras',
    escena: 'DibujandoPoligonosInteriores',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero', 'OpAritmetica']
  },
  {
    id: 37,
    grupoId: 5,
    nombre: 'DibujandoLaCuevaDeEstalagtitas',
    titulo: 'titulo-cueva',
    enunciado: 'enunciado-cueva',
    consignaInicial: 'consigna-cueva',
    escena: 'DibujandoCuevaEstalagtitas',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'DibujarLado',
              'GirarGrados', 'Numero', 'OpAritmetica']
  },
  {
    id: 130,
    grupoId: 5,
    nombre: 'LaFiestaDeDracula',
    titulo: 'titulo-dracula',
    escena: 'LaFiestaDeDracula',
    enunciado: 'enunciado-dracula',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'Numero',
              'OpAritmetica', 'CambiarColor', 'SiguienteFoco', 'EmpezarFiesta'],
  },
  {
    id: 131,
    grupoId: 5,
    nombre: 'SalvandoLaNavidad',
    titulo: 'titulo-navidad',
    escena: 'SalvandoLaNavidad',
    enunciado: 'enunciado-navidad',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta', 'MoverACasillaDerecha', 'DejarRegalo', 'SiguienteFilaTotal', 'Numero', 'OpAritmetica'],
  },
  {
    id: 132,
    grupoId: 5,
    nombre: 'PrendiendoLasCompusParametrizado',
    titulo: 'titulo-compus-parametros',
    escena: 'PrendiendoLasCompus',
    enunciado: 'enunciado-compus-parametros',
    consignaInicial: 'consigna-compus-parametros',
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
    titulo: 'titulo-tito-cuadrado',
    escena: 'TitoCuadrado',
    enunciado: 'enunciado-tito-cuadrado',
    debeFelicitarse: true,
    bloques: ['ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo',
              'MoverA', 'Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta',
              'TocandoLuz', 'EncenderLuz', 'Numero', 'OpAritmetica'],
  },
  {
    id: 134,
    grupoId: 5,
    nombre: 'ElCangrejoAguafiestas',
    titulo: 'titulo-cangrejo',
    escena: 'ElCangrejoAguafiestas',
    enunciado: 'enunciado-cangrejo',
    consignaInicial: 'consigna-cangrejo',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'Sino', 'Hasta',
              'ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo', 'MoverA',
              'ExplotarGlobo', 'Numero', 'OpAritmetica']
  },
  {
    id: 135,
    grupoId: 5,
    nombre: 'PrendiendoLasFogatas',
    titulo: 'titulo-fogatas',
    escena: 'PrendiendoLasFogatas',
    enunciado: 'enunciado-fogatas',
		consignaInicial: 'consigna-fogatas',
    debeFelicitarse: true,
    bloques: ['Procedimiento', 'RepetirVacio', 'Repetir', 'si', 'SiNo', 'Hasta',
      'TocandoFogata', 'PrenderFogata',
      'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha',
      'Numero', 'OpComparacion', 'OpAritmetica',
      'ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo'
    ]
  },/*
	{
		id: 137,
		grupoId: 6,
		nombre: '3.1.2',
		titulo: 'Desafío 3.1.2',
		escena: `new EscenaDuba([
				['O','O','O','O'],
				['O','O','O','O'],
				['A',' ',' ','P'],
				['O','O','O','O'],
				['O','O','O','O'],
		])`,
		enunciado: 'COMPLETAR 1',
		consignaInicial: 'COMPLETAR 2',
		debeFelicitarse: true,
		bloques: ['MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco']
	},
	{
		id: 138,
		grupoId: 6,
		nombre: '3.1.3',
		titulo: 'Desafío 3.1.3',
		escena: `new EscenaDuba([
				['O','O',' ','O'],
				[' ','A',' ','O'],
				[' ','O','O','O'],
				['P','O','O','O'],
		])`,
		enunciado: 'COMPLETAR 1',
		consignaInicial: 'COMPLETAR 2',
		debeFelicitarse: true,
		bloques: ['MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco']
	},
	{
		id: 139,
		grupoId: 6,
		nombre: '3.1.5',
		titulo: 'Desafío 3.1.5',
		escena: `new EscenaDuba([
				['O',' ','P'],
				['A',' ','O'],
		])`,
		enunciado: 'COMPLETAR 1',
		consignaInicial: 'COMPLETAR 2',
		debeFelicitarse: true,
		bloques: ['MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco']
	},
	{
		id: 140,
		grupoId: 6,
		nombre: '3.1.6a',
		titulo: 'Desafío 3.1.6a',
		escena: `new EscenaDuba([
				['O','O','O','O'],
				['A',' ',' ','P'],
				['O','O','O','O'],
		])`,
		enunciado: 'COMPLETAR 1',
		consignaInicial: 'COMPLETAR 2',
		debeFelicitarse: true,
		bloques: ['MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco'],
		debugging: true,
		solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaDerecha" id="$+(u9Z\`8KfC!R((hL.w{">
        <next>
          <block type="MoverACasillaDerecha" id="-6kA~P)o\`|UHDjh@s}N6"></block>
        </next>
      </block>
    </statement>
  </block>
</xml>`
	},
	{
		id: 141,
		grupoId: 6,
		nombre: '3.1.6b',
		titulo: 'Desafío 3.1.6b',
		escena: `new EscenaDuba([
				['P','O','O'],
				[' ','O','O'],
				[' ',' ','A'],
		])`,
		enunciado: 'COMPLETAR 1',
		consignaInicial: 'COMPLETAR 2',
		debeFelicitarse: true,
		bloques: ['MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco'],
		debugging: true,
		solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaIzquierda" id=",tZ$Z0.AREObzlD(jfR9">
        <next>
          <block type="MoverACasillaArriba" id="DzQgaQjM_L~N(QWu]8ZX">
            <next>
              <block type="MoverACasillaArriba" id="h3k]x1%HZw\`s6#2CKR*o"></block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`
	},
	{
		id: 142,
		grupoId: 6,
		nombre: '3.1.6c',
		titulo: 'Desafío 3.1.6c',
		escena: `new EscenaDuba([
				['O','P','O'],
				['A',' ',' '],
		])`,
		enunciado: 'COMPLETAR 1',
		consignaInicial: 'COMPLETAR 2',
		debeFelicitarse: true,
		bloques: ['MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco'],
		debugging: true,
		solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaDerecha" id="c_)n.H7DGlOUdh,we50f">
        <next>
          <block type="MoverACasillaDerecha" id="4:71|5d%!jUgO)-l{/!a">
            <next>
              <block type="MoverACasillaDerecha" id="XLLjx{e!r(wnkp:XCSek">
                <next>
                  <block type="MoverACasillaArriba" id="tXtIEwdRR6-joI]9CnG-"></block>
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
		id: 143,
		grupoId: 6,
		nombre: '3.1.6d',
		titulo: 'Desafío 3.1.d',
		escena: `new EscenaDuba([
				['P','O','A'],
				[' ','O',' '],
				[' ',' ',' '],
		])`,
		enunciado: 'COMPLETAR 1',
		consignaInicial: 'COMPLETAR 2',
		debeFelicitarse: true,
		bloques: ['MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco'],
		debugging: true,
		solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaAbajo" id="E#]BS2g8~]}Uq^$ntIRY">
        <next>
          <block type="MoverACasillaAbajo" id="BuDGr#1Y-VOXt_q;#S[R">
            <next>
              <block type="MoverACasillaIzquierda" id="G2V}ax1DRa9A[j4o7RM5">
                <next>
                  <block type="MoverACasillaArriba" id="9rud9^gmZw0]6e)3t_Q:"></block>
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
		id: 144,
		grupoId: 6,
		nombre: '3.2',
		titulo: 'Evaluación 3.2',
		escena: `new EscenaDuba([
				[' ',' ','A'],
				[' ','O','O'],
        [' ',' ',' '],
        ['O','O','P'],
		])`,
		enunciado: 'COMPLETAR 1',
		consignaInicial: 'COMPLETAR 2',
		debeFelicitarse: true,
		bloques: ['MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco']
	},
  {
    id: 145,
    grupoId: 7,
    nombre: '4.1.3',
    titulo: 'Desafío 4.1.3',
    escena: `new EscenaDuba([
        ['O','O','O','O','O','O'],
        ['O','O','O','O','O','O'],
        ['O','O','O','O','O','O'],
        ['A',' ',' ',' ',' ','P'],
        ['O','O','O','O','O','O'],
        ['O','O','O','O','O','O'],
        ['O','O','O','O','O','O'],
    ])`,
    enunciado: 'COMPLETAR 1',
    consignaInicial: 'COMPLETAR 2',
    debeFelicitarse: true,
    bloques: ['MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'Repetir']
  },
  {
    id: 146,
    grupoId: 7,
    nombre: '4.1.4a',
    titulo: 'Desafío 4.1.4a',
    escena: `new EscenaDuba([
      ['P','O','O','O','O'],
      [' ','O','O','O','O'],
      [' ','O','O','O','O'],
      [' ','O','O','O','O'],
      [' ','A','O','O','O'],
    ])`,
    enunciado: 'COMPLETAR 1',
    consignaInicial: 'COMPLETAR 2',
    debeFelicitarse: true,
    bloques: ['MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'Repetir']
  },
  {
    id: 147,
    grupoId: 7,
    nombre: '4.1.4b',
    titulo: 'Desafío 4.1.4b',
    escena: `new EscenaDuba([
        ['P','O','O','O','O'],
        [' ','O','O','O','O'],
        [' ','O','O','O','O'],
        [' ','O','O','O','O'],
        [' ',' ',' ',' ','A'],
    ])`,
    enunciado: 'COMPLETAR 1',
    consignaInicial: 'COMPLETAR 2',
    debeFelicitarse: true,
    bloques: ['MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'Repetir']
  },
  {
    id: 148,
    grupoId: 7,
    nombre: '4.1.6',
    titulo: 'Desafío 4.1.6',
    escena: `new EscenaDuba([
        ['A',' ','O','O','O','O'],
        ['O',' ',' ','O','O','O'],
        ['O','O',' ',' ','O','O'],
        ['O','O','O',' ',' ','O'],
        ['O','O','O','O',' ',' '],
        ['O','O','O','O','O',' '],
    ])`,
    enunciado: 'COMPLETAR 1',
    consignaInicial: 'COMPLETAR 2',
    debeFelicitarse: false,
    bloques: ['MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'Repetir'],
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="repetir" id="|KneHL[}QuG.8DM_bHtq">
        <value name="count">
          <block type="math_number" id="K/^RF-kMoU2vQeYQdh7-">
            <field name="NUM">2</field>
          </block>
        </value>
        <statement name="block">
          <block type="MoverACasillaDerecha" id="5X41a:-!K0TyfUB~F=H]">
            <next>
              <block type="MoverACasillaAbajo" id="5:_E9$oi#WB(Yxo:MmG7"></block>
            </next>
          </block>
        </statement>
        <next>
        <block type="MoverACasillaDerecha" id="5X41a:-!K0sdgfUB~F=H]">
          <next>
            <block type="ComerChurrasco" id="d4y{D[O3OmG$%MA/{qk9"></block>
          </next>
        </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`
  },
  {
    id: 149,
    grupoId: 7,
    nombre: '4.1.7a',
    titulo: 'Desafío 4.1.7a',
    escena: `new EscenaDuba([
        ['O','O','O','O','O','O'],
        ['O','O','O','O','O','O'],
        ['O','O','O','O','O','O'],
        ['P',' ',' ',' ',' ',' '],
        ['O','O','O','O','O','A'],
        ['O','O','O','O','O','O'],
        ['O','O','O','O','O','O'],
    ])`,
    enunciado: 'COMPLETAR 1',
    consignaInicial: 'COMPLETAR 2',
    debeFelicitarse: true,
    bloques: [
      'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'Repetir'],
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaArriba" id="SI4=l3z@.Re/}/Axao*X">
        <next>
          <block type="repetir" id="|KneHL[}QuG.8DM_bHtq">
            <value name="count">
              <block type="math_number" id="K/^RF-kMoU2vQeYQdh7-">
                <field name="NUM">4</field>
              </block>
            </value>
            <statement name="block">
              <block type="MoverACasillaIzquierda" id="o=|VymUssynr0IA01}a?"></block>
            </statement>
            <next>
              <block type="MoverACasillaArriba" id="56P3;Q*s!bJV%P.DZELG">
                <next>
                  <block type="ComerChurrasco" id="d4y{D[O3OmG$%MA/{qk9"></block>
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
    id: 150,
    grupoId: 7,
    nombre: '4.1.7b',
    titulo: 'Desafío 4.1.7b',
    escena: `new EscenaDuba([
        ['A',' ','O','O','O','O'],
        ['O',' ',' ','O','O','O'],
        ['O','O',' ',' ','O','O'],
        ['O','O','O',' ',' ','O'],
        ['O','O','O','O',' ',' '],
        ['O','O','O','O','O','P'],
    ])`,
    enunciado: 'COMPLETAR 1',
    consignaInicial: 'COMPLETAR 2',
    debeFelicitarse: true,
    bloques: ['MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha', 'ComerChurrasco', 'Repetir'],
    debugging: true,
    solucionInicial: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="repetir" id="|KneHL[}QuG.8DM_bHtq">
        <value name="count">
          <block type="math_number" id="K/^RF-kMoU2vQeYQdh7-">
            <field name="NUM">4</field>
          </block>
        </value>
        <statement name="block">
          <block type="MoverACasillaDerecha" id="5X41a:-!K0TyfUB~F=H]">
            <next>
              <block type="MoverACasillaAbajo" id="5:_E9$oi#WB(Yxo:MmG7"></block>
            </next>
          </block>
        </statement>
        <next>
        <block type="MoverACasillaDerecha" id="5X41a:-!K0sdgfUB~F=H]">
          <next>
            <block type="ComerChurrasco" id="d4y{D[O3OmG$%MA/{qk9"></block>
          </next>
        </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`
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
*/

/*  {
    id: 136,
    grupoId: 5,
    nombre: '',
    titulo: 'Próximamente: más actividades',
    deshabilitado: true,
  },*/

];
