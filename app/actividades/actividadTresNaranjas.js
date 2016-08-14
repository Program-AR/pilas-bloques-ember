import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import comer from 'pilas-engine-bloques/actividades/comer';
import tocando from 'pilas-engine-bloques/actividades/tocando';

var {Repetir,Si,Sino,Procedimiento} = bloques;
var {IrDerecha} = direcciones;
var {ComerNaranja} = comer;
var {TocandoNaranja} = tocando;
var actividadTresNaranjas = {
  // DEPRECATED: nombre: 'Tres naranjas',
  id: 'TresNaranjas',
  // DEPRECATED: enunciado: 'El alien debe comer todos los gajos de naranja que aparezcan en las casillas violetas. ¡Pero no siempre aparecen en los mismos lugares ni la misma cantidad de naranjas! Pista: pensá primero cómo harías un procedimiento para comer una sola naranja si es que la hay.',

  // DEPRECATED: escena: TresNaranjas,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, IrDerecha,ComerNaranja, Repetir,Si,Sino, TocandoNaranja]
};
export default actividadTresNaranjas;
