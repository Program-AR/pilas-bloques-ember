import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import bloquesTito from 'pilas-engine-bloques/actividades/bloquesTito';
var {Repetir, Si, Sino, Procedimiento,Hasta} = bloques;
var {IrAbajo} = direcciones;
var {EncenderLuz,TocandoLuz,TocandoFinal} = bloquesTito;





var actividadSuperTito2 = {
  // DEPRECATED: nombre: 'Súper Tito 2',
  id: 'SuperTito2',
  // DEPRECATED: enunciado: 'Súper Tito debe encender todas las luces, pero a diferencia del desafío anterior, hay celdas sin luz. ¿Podrás utilizar el mismo procedimiento que en Súper Tito 1? \n',
  // DEPRECATED: consignaInicial: 'El bloque "repetir hasta que" repite una secuencia de acciones hasta que se cumple una condición. Esto se llama "repetición condicional".',

  // DEPRECATED: escena: SuperTito2,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, TocandoFinal,TocandoLuz, EncenderLuz,IrAbajo, Repetir,Si,Sino,Hasta],
};

export default actividadSuperTito2;
