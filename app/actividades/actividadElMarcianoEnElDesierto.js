/* globals ElMarcianoEnElDesierto */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import comer from 'pilas-engine-bloques/actividades/comer';


var {Repetir, Procedimiento} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;
var {ComerManzana} = comer;


var actividadElMarcianoEnElDesierto = {
  nombre: 'El marciano en el desierto',
  id: 'ElMarcianoEnElDesierto',
  enunciado: 'El marciano está perdido en el desierto y necesita alimentarse de su comida favorita: ¡las manzanas! Ayudalo a comerlas todas. Pista: se pueden usar varios' + 'Repetir.'.bold(),
  consignaInicial: 'Conviene pensar una estrategia general de resolución antes de construir el programa. Por ejemplo: comer las manzanas de abajo, luego las del costado y por último las de arriba.',

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
