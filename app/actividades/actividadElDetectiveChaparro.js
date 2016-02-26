import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder, Si,Procedimiento} = bloques;

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
  descripcion: 'Es Culpable',
  icono: 'icono.culpable.png',
  funcionSensor: 'esCulpable()',
});

export default {
  nombre: 'El detective Chaparro',
  id: 'ElDetectiveChaparro',
  enunciado: 'TODO',
  consignaInicial: 'TODO',
  
  // la escena proviene de ejerciciosPilas
  escena: ElDetectiveChaparro,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  procedimientos: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Si],
  expresiones: [],
  acciones: [PrimerSospechoso,SiguienteSospechoso,SacarDisfraz],
  sensores: [EsCulpable],
};
