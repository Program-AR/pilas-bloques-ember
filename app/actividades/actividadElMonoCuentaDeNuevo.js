import {comunes,LargoColumnaActual} from 'pilas-engine-bloques/actividades/bloquesMonoContando';
import {RepetirVacio} from 'pilas-engine-bloques/actividades/bloques';

export default {
  // DEPRECATED: nombre: 'El mono cuenta de nuevo',
  id: 'ElMonoCuentaDeNuevo',
  // DEPRECATED: enunciado: 'El mono tiene que contar otra vez las frutas, ¡pero ahora no puede verificar si ya llegó al final de una columna! Pista: mirá en la categoría "Variables" si hay algo que te pueda servir.',
  // DEPRECATED: consignaInicial: 'Una variable nos permite guardar información que puede cambiar en cada ejecución del programa, incluso en una misma ejecución. Por ejemplo, el largo de cada columna varía dependiendo en qué columna esté parado el mono.',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: ElMonoCuentaDeNuevo,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [RepetirVacio, LargoColumnaActual].concat(comunes),

};
