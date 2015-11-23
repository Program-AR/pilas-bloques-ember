/* globals TresNaranjas */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Repetir,Si,Procedimiento} = bloques;
var {IrDerecha} = direcciones;



var actividadTresNaranjas = {
  nombre: 'El alien y las tuercas',
  enunciado: 'Definir.',
  consignaInicial: 'definirs.',

  escena: TresNaranjas,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Repetir,Si],
  expresiones: [],
  acciones: [IrDerecha],
  sensores: []
};

export default actividadTresNaranjas;
