/* globals LaberintoLargo */

import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import tocando from 'pilas-engine-bloques/actividades/tocando';
var {Repetir,Si,Sino,Procedimiento,Hasta} = bloques;
var {IrDerecha,IrAbajo} = direcciones;
var {TocandoAbajo,TocandoDerecha,TocandoFinCamino} = tocando;

var actividadLaberintoLargo = {
  nombre: 'Laberinto largo',
  id: 'LaberintoLargo',
  enunciado: 'Ayudá al ratón a salir del laberinto. A diferencia del laberinto anterior, aquí la cantidad de casillas que debe avanzar son muchas. ¿Cuántas? ¿Es siempre la misma? Pista: pensá primero cómo avanzar una sola casilla.',

  // la escena proviene de ejerciciosPilas
  escena: LaberintoLargo, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  procedimientos: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Repetir,Si,Sino],
  expresiones: [],
  acciones: [IrDerecha,IrAbajo,Hasta],
  sensores: [TocandoAbajo,TocandoDerecha,TocandoFinCamino],
};

export default actividadLaberintoLargo;
