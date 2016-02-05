
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import tocando from 'pilas-engine-bloques/actividades/tocando';
import comer from 'pilas-engine-bloques/actividades/comer';
var {Si,Sino,Repetir,Procedimiento,Hasta} = bloques;
var {IrDerecha,IrAbajo} = direcciones;
var {TocandoAbajo,TocandoDerecha,TocandoFinCamino,TocandoQueso} = tocando;
var {ComerQueso} = comer;

var actividadLaberintoConQueso = {
  nombre: 'Laberinto con queso',
  id: 'LaberintoConQueso',
  enunciado: 'a!.',

  consignaInicial: 'a',

  // la escena proviene de ejerciciosPilas
  escena: LaberintoConQueso, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Si,Sino,Repetir,Hasta],
  expresiones: [],
  acciones: [IrDerecha,IrAbajo,ComerQueso],
  sensores: [TocandoAbajo,TocandoDerecha,TocandoFinCamino,TocandoQueso],
};

export default actividadLaberintoConQueso;
