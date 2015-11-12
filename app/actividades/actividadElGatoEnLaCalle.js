
import bloques from 'pilas-engine-bloques/actividades/bloques';



var {Accion, Sensor, Repetir,Si,Procedimiento} = bloques;


var actividadElGatoEnLaCalle = {
  nombre: 'El marciano en el desierto',
  enunciado: 'A definir.',
  consignaInicial: 'A definir.',

  escena: ElGatoEnLaCalle,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [],
  expresiones: [],
  acciones: [],
  sensores: []
};

export default actividadElGatoEnLaCalle;
