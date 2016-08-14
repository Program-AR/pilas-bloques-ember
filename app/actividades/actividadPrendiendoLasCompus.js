import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

import {PrenderCompu, EstoyEnEsquina} from 'pilas-engine-bloques/actividades/bloquesCompus';
var {Repetir, Si, Sino, Hasta, Procedimiento} = bloques;
var {IrIzquierda, IrDerecha, IrArriba, IrAbajo} = direcciones;

export default {
  // DEPRECATED: nombre: 'Prendiendo las compus',
  id: 'PrendiendoLasCompus',
  // DEPRECATED: enunciado:
  //  'Debemos prender todas las compus teniendo en cuenta que el ancho y el alto del escenario cambian en cada ejecución. Pista: pensá cómo harías para prender las compus de un solo lado del rectángulo y después repetilo para el resto de los lados.',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: PrendiendoLasCompus,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, Si, Sino, Hasta,  IrDerecha, IrArriba, IrAbajo, IrIzquierda, PrenderCompu, EstoyEnEsquina],
};
