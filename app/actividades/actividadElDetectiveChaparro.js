import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder, Repetir, Si, Sino, Procedimiento, Hasta} = bloques;

var PrimerSospechoso = AccionBuilder.build({
  descripcion: 'Primer sospechoso',
  icono: '../../iconos/izquierda.png',
  comportamiento: 'MoverTodoAIzquierda',
  argumentos: '{}',
});

var SiguienteSospechoso = AccionBuilder.build({
  descripcion: 'Siguiente sospechoso',
  icono: '../../iconos/derecha.png',
  comportamiento: 'MoverACasillaDerecha',
  argumentos: '{}',
});

var SacarDisfraz = AccionBuilder.build({
  descripcion: 'Sacar disfraz',
  icono: 'icono.sacar.disfraz.png',
  comportamiento: 'SacarDisfraz',
  argumentos: '{}',
});

var EsCulpable = AccionBuilder.buildSensor({
  id: 'Descubralculpable',
  descripcion: 'Estoy frente al culpable',
  icono: 'icono.culpable.png',
  funcionSensor: 'colisiona_con(pilas.escena_actual().culpable) && pilas.escena_actual().culpable.teEncontraron()',
});

export default {
  nombre: 'El detective Chaparro',
  id: 'ElDetectiveChaparro',
  enunciado: 'El detective debe descubrir al culpable de un crimen, quitándole el disfraz que lo camufla. Comenzando por el primero de la izquierda, ¡interrogá a cada uno de los sospechosos hasta encontrar al culpable!',
  consignaInicial: 'El bloque "Repetir hasta que" nos permite terminar el programa cuando encontramos al culpable sin tener que interrogar a todos los sospechosos de la fila.',

  // la escena proviene de ejerciciosPilas
  escena: ElDetectiveChaparro,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Repetir, Si, Sino, Hasta,Procedimiento,PrimerSospechoso,SiguienteSospechoso,SacarDisfraz,EsCulpable],
};
