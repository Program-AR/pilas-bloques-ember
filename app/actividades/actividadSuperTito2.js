import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import bloquesTito from 'pilas-engine-bloques/actividades/bloquesTito';
var {Si, Repetir, Procedimiento,Hasta} = bloques;
var {IrAbajo} = direcciones;
var {EncenderLuz,TocandoLuz,TocandoFinal} = bloquesTito;





var actividadSuperTito2 = {
  nombre: 'Súper Tito 2',
  id: 'SuperTito2',
  enunciado: 'Súper Tito debe encender todas las luces, pero a diferencia del desafío anterior, hay celdas sin luz. ¿Podrás utilizar el mismo procedimiento que en Súper Tito 1? \n',
  consignaInicial: 'El bloque "Repetir hasta qué" repite una secuencia de acciones mientras no sea verdad una condición.',

  escena: SuperTito2,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  procedimientos: [Procedimiento],

  variables: [],
  control: [Si,Repetir,Hasta],
  expresiones: [],
  acciones: [EncenderLuz,IrAbajo],
  sensores: [TocandoFinal,TocandoLuz],
};

export default actividadSuperTito2;
