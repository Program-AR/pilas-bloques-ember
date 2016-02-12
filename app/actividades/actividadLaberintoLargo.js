/* globals LaberintoLargo */

import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import tocando from 'pilas-engine-bloques/actividades/tocando';
var {Si,Sino,Repetir,Procedimiento,Hasta} = bloques;
var {IrDerecha,IrAbajo} = direcciones;
var {TocandoAbajo,TocandoDerecha,TocandoFinCamino} = tocando;

var actividadLaberintoLargo = {
  nombre: 'Laberinto largo',
  id: 'LaberintoLargo',
  enunciado: 'a!.',

  consignaInicial: 'a',

  // la escena proviene de ejerciciosPilas
  escena: LaberintoLargo, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  procedimientos: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Si,Sino,Repetir],
  expresiones: [],
  acciones: [IrDerecha,IrAbajo,Hasta],
  sensores: [TocandoAbajo,TocandoDerecha,TocandoFinCamino],
};

export default actividadLaberintoLargo;
