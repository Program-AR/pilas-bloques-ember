import {comunes,EstoyAlFin} from 'pilas-engine-bloques/actividades/bloquesMonoContando';

export default {
  // DEPRECATED: nombre: 'El mono que sabe contar',
  id: 'ElMonoQueSabeContar',
  // DEPRECATED: enunciado: 'El mono debe recorrer todas las casillas y contar cuántas bananas y manzanas hay en total. Pista: primero pensá cómo contarías si hay una manzana o una banana en una casilla determinada. Luego pensá cómo harías para contar todas las frutas de una sola columna.',
  // DEPRECATED: consignaInicial: 'Subdividir un problema grande en problemas más pequeños ayuda a comprender mejor cada una de las partes que lo componen. Además nos permite concentrarnos en resolver cuestiones más sencillas al problema original.',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: ElMonoQueSabeContar,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: comunes.concat([EstoyAlFin]),

};
