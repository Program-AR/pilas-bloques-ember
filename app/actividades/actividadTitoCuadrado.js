import {Repetir, Si, Sino, Hasta, Procedimiento} from 'pilas-engine-bloques/actividades/bloques';
import {IrAbajo, IrIzquierda, IrDerecha, IrArriba} from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import {EncenderLuz,TocandoLuz} from 'pilas-engine-bloques/actividades/bloquesTito';

export default {
  nombre: 'Tito cuadrado',
  id: 'TitoCuadrado',
  enunciado: 'TODO',

  escena: TitoCuadrado,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, Si, Sino, Hasta, TocandoLuz, EncenderLuz,IrAbajo,IrArriba,IrIzquierda,IrDerecha],
};
