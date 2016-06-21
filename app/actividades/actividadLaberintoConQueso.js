
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import tocando from 'pilas-engine-bloques/actividades/tocando';
import comer from 'pilas-engine-bloques/actividades/comer';
var {Repetir,Si,Sino,Procedimiento,Hasta} = bloques;
var {IrDerecha,IrAbajo} = direcciones;
var {TocandoAbajo,TocandoDerecha,TocandoFinCamino,TocandoQueso} = tocando;
var {ComerQueso} = comer;

var actividadLaberintoConQueso = {
  // DEPRECATED: nombre: 'Laberinto con queso',
  id: 'LaberintoConQueso',
  // DEPRECATED: enunciado: '¡El ratón está más hambriento que nunca! Guialo por el laberinto para que pueda comer todos los trozos de queso. Pista: antes de empezar, apretá varias veces el botón Ejecutar para conocer cómo varía el escenario.',
  // DEPRECATED: consignaInicial: 'Es importante pensar si en algún momento se cumple la condición del bloque "Repetir hasta qué". Sino, ¡el programa podría no terminar nunca!',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: LaberintoConQueso, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, IrDerecha,IrAbajo,ComerQueso, Repetir,Si,Sino,Hasta, TocandoAbajo,TocandoDerecha,TocandoFinCamino,TocandoQueso],
};

export default actividadLaberintoConQueso;
