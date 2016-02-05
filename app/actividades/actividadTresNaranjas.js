/* globals TresNaranjas */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import comer from 'pilas-engine-bloques/actividades/comer';
import tocando from 'pilas-engine-bloques/actividades/tocando';

var {Repetir,Si,Procedimiento} = bloques;
var {IrDerecha} = direcciones;
var {ComerNaranja} = comer;
var {TocandoNaranja} = tocando;
var actividadTresNaranjas = {
  nombre: 'Tres naranjas',
  id: 'TresNaranjas',
  enunciado: 'Definir.',
  consignaInicial: 'definirs.',

  escena: TresNaranjas,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],
  variables: [],
  control: [Repetir,Si],
  expresiones: [],
  acciones: [IrDerecha,ComerNaranja],
  sensores: [TocandoNaranja]
};
export default actividadTresNaranjas;
