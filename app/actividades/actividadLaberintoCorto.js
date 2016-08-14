import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import tocando from 'pilas-engine-bloques/actividades/tocando';
var {Repetir,Si,Sino,Procedimiento} = bloques;
var {IrDerecha,IrAbajo} = direcciones;
var {TocandoAbajo,TocandoDerecha} = tocando;

var actividadLaberintoCorto = {
  //DEPRECATED: nombre: 'Laberinto corto',
  id: 'LaberintoCorto',
  // DEPRECATED: enunciado: 'Guiá al ratón para llegar a la meta. Para lograrlo, debe avanzar una casilla en la dirección que indica la flecha. Pista: mirá en la categoría "Sensores" qué preguntas podés hacer.',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: LaberintoCorto, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir,Si,Sino, IrDerecha,IrAbajo, TocandoAbajo,TocandoDerecha],
};

export default actividadLaberintoCorto;
