import {AccionBuilder, Repetir, RepetirVacio, Si, Sino, Hasta, Procedimiento} from 'pilas-engine-bloques/actividades/bloques';

var Avanzar1km = AccionBuilder.build({
  descripcion: 'Avanzar 1 Km',
  icono: '../../iconos/derecha.png',
  comportamiento: 'VolarHeroicamente',
  argumentos: '{}',
});

var KmsTotales = AccionBuilder.buildSensorNumerico({
   id: 'KmsTotales',
   descripcion: 'Kilómetros a recorrer',
   icono: 'icono.kms.png',
   funcionSensor: 'kmsTotales()',
 });

export default {
  // DEPRECATED: nombre: 'El Superviaje',
  id: 'ElSuperviaje',
  // DEPRECATED: enunciado: 'Nuestro superhéroe debe realizar su súper paseo matutino que consiste en recorrer una cierta cantidad de kilómetros que varía día a día (entre 15 y 45 km). ¡Lográ que nuestro súper amigo llegue siempre a destino!',
  // DEPRECATED: consignaInicial: 'Se puede usar un bloque "Repetir" con el valor de una variable. Esto permite repetir una secuencia de código la cantidad de veces que indique la variable.',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: SuperViaje,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, KmsTotales, Avanzar1km, RepetirVacio, Repetir, Si, Sino, Hasta],
};
