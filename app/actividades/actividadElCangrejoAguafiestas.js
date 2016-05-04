import {AccionBuilder,Procedimiento,Repetir,Si,Sino,Hasta} from 'pilas-engine-bloques/actividades/bloques';
import {IrDerecha, IrIzquierda, IrArriba, IrAbajo} from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var ExplotarGlobo = AccionBuilder.build({
  id: 'ExplotarGlobo',
  descripcion: 'Explotar Globo',
  icono: 'icono.globo.png',
  comportamiento: 'ComportamientoColision',
  argumentos: '{etiqueta:"GloboAnimado", animacionColisionado:"explotar", nombreAnimacion:"recoger"}',
});

export default {
  nombre: 'El cangrejo aguafiestas',
  id: 'ElCangrejoAguafiestas',
  enunciado: 'A definir.',
  consignaInicial: 'A definir.',

  /*global ElCangrejoAguafiestas */
  escena: ElCangrejoAguafiestas,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento,Repetir,Si,Sino,Hasta,IrDerecha, IrIzquierda, IrArriba, IrAbajo,ExplotarGlobo],
};
