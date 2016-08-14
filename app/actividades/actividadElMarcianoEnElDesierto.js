import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import comer from 'pilas-engine-bloques/actividades/comer';


var {Repetir, Procedimiento} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;
var {ComerManzana} = comer;


var actividadElMarcianoEnElDesierto = {
  // DEPRECATED: nombre: 'El marciano en el desierto',
  id: 'ElMarcianoEnElDesierto',
  // DEPRECATED: enunciado: 'El marciano está perdido en el desierto y necesita alimentarse de su comida favorita: ¡las manzanas! Ayudalo a comer las frutas. Pista: Crear un procedimiento (bloque) para cada conjunto de manzanas',
  // DEPRECATED: consignaInicial: 'Hay muchas formas de comer las manzanas. Podés empezar por las de la derecha, ¡o podés empezar por arriba! ¿Se te ocurre otra estrategia? Pensala siempre antes de programar',

  // DEPRECATED: escena: ElMarcianoEnElDesierto,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Repetir, Procedimiento, IrDerecha,IrIzquierda, IrArriba,IrAbajo,ComerManzana],
};

export default actividadElMarcianoEnElDesierto;
