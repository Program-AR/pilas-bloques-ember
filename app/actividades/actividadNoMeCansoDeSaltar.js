import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Sensor,Si,Procedimiento} = bloques;

var actividadNoMeCansoDeSaltar = {
  nombre: 'No me canso de saltar',
  enunciado: 'to be defined',

  consignaInicial: 'Nuestro procedimiento debe considerar cómo es el escenario del protagonista.  Si no varía, decimos que es un escenario fijo.',

  // la escena proviene de ejerciciosPilas
  escena: NoMeCansoDeSaltar,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Si],
  expresiones: [],
  acciones: [],
  sensores: [],
};

export default actividadNoMeCansoDeSaltar;
