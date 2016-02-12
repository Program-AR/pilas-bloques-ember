/* globals ElMonoQueSabeContar */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import tocando from 'pilas-engine-bloques/actividades/tocando';
import contando from 'pilas-engine-bloques/actividades/contando';
var {Si, Repetir, Procedimiento} = bloques;
var {IrArriba, IrAbajo} = direcciones;
var {TocandoBanana, TocandoManzana} = tocando;
var {ContandoBanana, ContandoManzana} = contando;




var actividadElMonoQueSabeContar = {
  nombre: 'El mono que sabe contar',
  id: 'ElMonoQueSabeContar',
  enunciado: 'COMPLETAR',
  consignaInicial: 'COMPLETAR.',

  // la escena proviene de ejerciciosPilas
  escena: ElMonoQueSabeContar,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  procedimientos: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Si,Repetir],
  expresiones: [],
  acciones: [IrArriba,IrAbajo,ContandoBanana,ContandoManzana],
  sensores: [TocandoBanana,TocandoManzana],
};

export default actividadElMonoQueSabeContar;
