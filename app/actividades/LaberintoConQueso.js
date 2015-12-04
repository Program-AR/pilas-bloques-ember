/* globals AlienLevantaTuercas */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Accion, Sensor, Repetir,Si,Procedimiento} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;

var actividadLaberintoConQueso = {
  nombre: 'El alien y las tuercas',
  enunciado: 'Definí un programa para que el alien junte todas las tuercas.',
  consignaInicial: 'Una buena estrategia de resolución de este desafío es la división del procedimiento en sub tareas.',

  escena: LaberintoConQueso,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Repetir,Si],
  expresiones: [],
  acciones: [],
  sensores: []
};

export default actividadLaberintoConQueso;
