import {AccionBuilder} from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {IrDerecha} = direcciones;

var ApretarBoton = AccionBuilder.build({
  descripcion: 'Apretar botón',
  id: 'ApretarBoton',
  icono: 'iconos.botonRojo.png',
  comportamiento: 'DesencadenarAnimacionSiColisiona',
  argumentos: '{\'animacionColisionado\':\'prendida\',\'nombreAnimacion\':\'apretar\',\'etiqueta\':\'BotonAnimado\',\'mensajeError\': \'No hay un botón aquí\',\'idTransicion\':\'apretarBoton\'}',
});

var actividadAlienTocaBoton = {
  nombre: 'El alien toca el botón',
  id: 'AlienTocaBoton',
  enunciado: 'Ayudá a nuestro Alien a presionar el botón de su laboratorio. \n'+
  'Pistas: mirá las acciones disponibles. ¡Vas a tener que avanzar varias veces!',

  consignaInicial: 'Los bloques te permiten formar secuencias de acciones para resolver los desafíos que te proponemos en Pilas Bloques.',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: 'AlienInicial', // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [IrDerecha, ApretarBoton],
};

export default actividadAlienTocaBoton;
