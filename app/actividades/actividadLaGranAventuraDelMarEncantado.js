import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Repetir,Si,Procedimiento} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;

var actividadLaGranAventuraDelMarEncantado = {
  nombre: 'La gran aventura del mar encantado',
  enunciado: 'Definí un programa para que el alien junte todas las tuercas.',
  consignaInicial: 'Una buena estrategia de resolución de este desafío es la división del procedimiento en sub tareas.',
  escena: LaGranAventuraDelMarEncantado, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],
  variables: [],
  control: [Repetir,Si],
  expresiones: [],
  acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo],
  sensores: []
};

export default actividadLaGranAventuraDelMarEncantado;
