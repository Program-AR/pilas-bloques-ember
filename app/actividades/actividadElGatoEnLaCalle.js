import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Sensor,Si,Procedimiento} = bloques;

var actividadElGatoEnLaCalle = {
  nombre: 'El gato en la calle',
  enunciado: 'to be defined',

  consignaInicial: 'to be defined.',

  // la escena proviene de ejerciciosPilas
  escena: ElGatoEnLaCalle,  // jshint ignore:line
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

export default actividadElGatoEnLaCalle;
