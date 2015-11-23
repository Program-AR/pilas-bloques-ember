/* globals ElMarcianoEnElDesierto */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import comer from 'pilas-engine-bloques/actividades/comer';


var {Repetir, Si, Procedimiento} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;
var {ComerManzana} = comer;


var actividadElMarcianoEnElDesierto = {
  nombre: 'El marciano en el desierto',
  enunciado: 'A definir.',
  consignaInicial: 'A definir.',

  escena: ElMarcianoEnElDesierto,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Repetir,Si],
  expresiones: [],
  acciones: [],
  sensores: [IrDerecha,IrIzquierda, IrArriba,IrAbajo,ComerManzana]
};

export default actividadElMarcianoEnElDesierto;
