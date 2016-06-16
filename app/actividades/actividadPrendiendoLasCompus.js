import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {AccionBuilder, Repetir, Si, Sino, Hasta, Procedimiento} = bloques;
var {IrIzquierda, IrDerecha, IrArriba, IrAbajo} = direcciones;

var PrenderCompu = AccionBuilder.build({
  descripcion: 'Prender compu',
  icono: 'icono.computadora.png',
  comportamiento: 'DesencadenarAnimacionSiColisiona',
  argumentos: '{etiqueta:"CompuAnimada", animacionColisionado:"prendida", nombreAnimacion: "escribir" }',
});

var EstoyEnEsquina = AccionBuilder.buildSensor({
  descripcion: 'Estoy en una esquina',
  icono: 'casilla.prendiendoLasCompus2.png',
  funcionSensor: 'casillaActual().esEsquina()',
});

export default {
  nombre: 'Prendiendo las compus',
  id: 'PrendiendoLasCompus',
  enunciado:
    'Debemos prender todas las compus teniendo en cuenta que el ancho y el alto del escenario cambian en cada ejecución. Pista: pensá cómo harías para prender las compus de un solo lado del rectángulo y después repetilo para el resto de los lados.',

  // la escena proviene de ejerciciosPilas
  escena: PrendiendoLasCompus,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, Si, Sino, Hasta,  IrDerecha, IrArriba, IrAbajo, IrIzquierda, PrenderCompu, EstoyEnEsquina],
};
