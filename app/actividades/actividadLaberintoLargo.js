import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import tocando from 'pilas-engine-bloques/actividades/tocando';
var {Repetir,Si,Sino,Procedimiento} = bloques;
var {IrDerecha,IrAbajo} = direcciones;
var {TocandoAbajo,TocandoDerecha} = tocando;

var actividadLaberintoLargo = {
  // DEPRECATED: nombre: 'Laberinto largo',
  id: 'LaberintoLargo',
  // DEPRECATED: enunciado: 'Ayudá al ratón a salir del laberinto. A diferencia del laberinto anterior, aquí la cantidad de casillas que debe avanzar son muchas. ¿Cuántas? ¿Es siempre la misma? Pista: pensá primero cómo avanzar una sola casilla.',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: LaberintoLargo, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, IrDerecha,IrAbajo,Repetir,Si,Sino, TocandoAbajo,TocandoDerecha],
};

export default actividadLaberintoLargo;
