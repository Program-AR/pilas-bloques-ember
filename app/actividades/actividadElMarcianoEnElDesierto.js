/* globals ElMarcianoEnElDesierto */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import comer from 'pilas-engine-bloques/actividades/comer';


var {Repetir, Procedimiento} = bloques;
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

  control: [Repetir],
  expresiones: [],
  acciones: [IrDerecha,IrIzquierda, IrArriba,IrAbajo,ComerManzana],
  sensores: []
};

export default actividadElMarcianoEnElDesierto;
