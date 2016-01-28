import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import tocando from 'pilas-engine-bloques/actividades/tocando';
var {Si,Sino} = bloques;
var {IrDerecha,IrAbajo} = direcciones;
var {TocandoAbajo,TocandoDerecha} = tocando;

var actividadLaberintoCorto = {
  nombre: 'Laberinto Corto',
  enunciado: 'a!.',

  consignaInicial: 'a',

  // la escena proviene de ejerciciosPilas
  escena: LaberintoCorto, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Si,Sino],
  expresiones: [],
  acciones: [IrDerecha,IrAbajo],
  sensores: [TocandoAbajo,TocandoDerecha],
};

export default actividadLaberintoCorto;
