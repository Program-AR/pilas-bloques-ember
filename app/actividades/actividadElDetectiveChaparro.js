import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder, Repetir, Si, Sino, Procedimiento, Hasta} = bloques;

var PrimerSospechoso = AccionBuilder.build({
  id: 'Primersospechoso',
  descripcion: 'Ir al primer sospechoso',
  icono: '../../iconos/izquierda.png',
  comportamiento: 'MoverTodoAIzquierda',
  argumentos: '{}',
});

var SiguienteSospechoso = AccionBuilder.build({
  id: 'Siguientesospechoso',
  descripcion: 'Pasar al siguiente sospechoso',
  icono: '../../iconos/derecha.png',
  comportamiento: 'MoverACasillaDerecha',
  argumentos: '{}',
});

var SacarDisfraz = AccionBuilder.build({
  descripcion: 'Interrogar sospechoso',
  id: 'Sacardisfraz',
  icono: 'icono.sacar.disfraz.png',
  comportamiento: 'SacarDisfraz',
  argumentos: '{}',
});

var EsCulpable = AccionBuilder.buildSensor({
  id: 'Descubralculpable',
  descripcion: 'Estoy frente al culpable',
  icono: 'icono.culpable.png',
  funcionSensor: 'colisionaConElCulpable() && pilas.escena_actual().culpable.teEncontraron()',
});

export default {
  // DEPRECATED: nombre: 'El detective Chaparro',
  id: 'ElDetectiveChaparro',
  // DEPRECATED: enunciado: 'El detective debe descubrir al culpable de un crimen, quitándole el disfraz que lo camufla. Comenzando por el primero de la izquierda, ¡interrogá a cada uno de los sospechosos hasta encontrar al culpable!',
  // DEPRECATED: consignaInicial: 'El bloque "Repetir hasta que" nos permite terminar el programa cuando encontramos al culpable sin tener que interrogar a todos los sospechosos de la fila.',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: ElDetectiveChaparro,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Repetir, Si, Sino, Hasta,Procedimiento,PrimerSospechoso,SiguienteSospechoso,SacarDisfraz,EsCulpable],
};
