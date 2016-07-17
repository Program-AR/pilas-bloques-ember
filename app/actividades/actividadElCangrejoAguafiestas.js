import {AccionBuilder,Procedimiento,Repetir,Si,Sino,Hasta} from 'pilas-engine-bloques/actividades/bloques';
import {ParaLaDerecha, ParaLaIzquierda,ParaArriba, ParaAbajo, MoverA} from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import {Numero,OpAritmetica} from 'pilas-engine-bloques/actividades/expresiones';

var ExplotarGlobo = AccionBuilder.build({
  id: 'ExplotarGlobo',
  descripcion: 'Explotar globo',
  icono: 'icono.globo.png',
  comportamiento: 'ComportamientoColision',
  argumentos: '{etiqueta:"GloboAnimado", nombreAnimacion:"recoger", idTransicion: "explotar", comportamientoAdicional: Eliminar, argumentosComportamiento: {nombreAnimacion:"explotar"}}',
});

export default {
  nombre: 'El cangrejo aguafiestas',
  id: 'ElCangrejoAguafiestas',
  enunciado: 'El cangrejo quiere pinchar todos los globos de la fiesta. Tené en cuenta que estos no cambian de lugar. Pista: ¿la cantidad de globos y la dirección podrían ser parámetros?',
  consignaInicial: 'Se pueden combinar parámetros numéricos (cantidades, longitudes) con parámetros de texto (direcciones, nombres).',

  /*global ElCangrejoAguafiestas */
  escena: ElCangrejoAguafiestas,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento,Repetir,Si,Sino,Hasta,
    ParaLaDerecha, ParaLaIzquierda, ParaArriba, ParaAbajo, MoverA,
    ExplotarGlobo, Numero, OpAritmetica],
};
