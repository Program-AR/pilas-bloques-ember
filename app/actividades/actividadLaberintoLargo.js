/* globals LaberintoLargo */

import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import tocando from 'pilas-engine-bloques/actividades/tocando';
var {Si,Repetir,Procedimiento,Hasta} = bloques;
var {IrDerecha,IrAbajo} = direcciones;
var {TocandoAbajo,TocandoDerecha,TocandoFinCamino} = tocando;

var actividadLaberintoLargo = {
  nombre: 'Laberinto Largo',
  enunciado: 'a!.',

  consignaInicial: 'a',

  // la escena proviene de ejerciciosPilas
  escena: LaberintoLargo, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Si,Repetir],
  expresiones: [],
  acciones: [IrDerecha,IrAbajo,Hasta],
  sensores: [TocandoAbajo,TocandoDerecha,TocandoFinCamino],
};

export default actividadLaberintoLargo;
