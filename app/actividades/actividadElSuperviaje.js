import {AccionBuilder, Repetir, RepetirVacio, Si, Sino, Hasta, Procedimiento, VariableEspecificaGet} from 'pilas-engine-bloques/actividades/bloques';

var Avanzar1km = AccionBuilder.build({
  descripcion: 'Avanzar 1 Km',
  icono: '../../iconos/derecha.png',
  comportamiento: 'VolarHeroicamente',
  argumentos: '{}',
});

var KmsTotales = VariableEspecificaGet.extend({
  init() {
        this._super();
        this.set('id', 'KmsTotales');
  },

  nombre_sensor(){
    return 'kmsTotales()';
  },

  descripcion(){
    return 'Kilómetros de distancia';
  },
});

export default {
  nombre: 'El Superviaje',
  id: 'ElSuperviaje',
  enunciado: 'Nuestro superhéroe debe realizar su súper paseo matutino que consiste en recorrer una cierta cantidad de kilómetros que varía día a día (entre 15 y 30 km). ¡Lográ que nuestro súper amigo llegue siempre a destino!',
  consignaInicial: 'Se puede usar un bloque "Repetir" con el valor de una variable. Esto permite repetir una secuencia de código la cantidad de veces que indique la variable.',

  // la escena proviene de ejerciciosPilas
  escena: SuperViaje,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, KmsTotales, Avanzar1km, RepetirVacio, Repetir, Si, Sino, Hasta],
};
