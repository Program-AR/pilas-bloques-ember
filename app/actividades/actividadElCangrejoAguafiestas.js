import {AccionBuilder,Procedimiento,Repetir,Si,Sino,Hasta} from 'pilas-engine-bloques/actividades/bloques';
import {IrDerecha, IrIzquierda, IrArriba, IrAbajo} from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import {Numero,OpComparacion,OpAritmetica,Texto} from 'pilas-engine-bloques/actividades/expresiones';

var ExplotarGlobo = AccionBuilder.build({
  id: 'ExplotarGlobo',
  descripcion: 'Explotar globo',
  icono: 'icono.globo.png',
  comportamiento: 'ComportamientoColision',
  argumentos: '{etiqueta:"GloboAnimado", nombreAnimacion:"recoger", comportamientoAdicional: Eliminar, argumentosComportamiento: {nombreAnimacion:"explotar"}}',
});

export default {
  nombre: 'El cangrejo aguafiestas',
  id: 'ElCangrejoAguafiestas',
  enunciado: 'El cangrejo por aguafiestas quiere pinchar todos los globos de la fiesta. Los globos nunca cambian de lugar, pero ¡atención! la hilera del medio lo va a obligar al cangrejo a volver sobre sus pasos. Pista: ¿En vez de un parámetro te ayuda pensar a la cantidad de globos y a la dirección ambos como parámetros?',
  /*consignaInicial: 'A definir.',*/

  /*global ElCangrejoAguafiestas */
  escena: ElCangrejoAguafiestas,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento,Repetir,Si,Sino,Hasta,
    IrDerecha, IrIzquierda, IrArriba, IrAbajo,
    ExplotarGlobo,Numero,OpComparacion,OpAritmetica,Texto],
};
