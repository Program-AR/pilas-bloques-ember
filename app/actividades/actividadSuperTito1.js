import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import bloquesTito from 'pilas-engine-bloques/actividades/bloquesTito';
var {Repetir, Si, Sino, Procedimiento,Hasta} = bloques;
var {IrAbajo} = direcciones;
var {EncenderLuz,TocandoFinal} = bloquesTito;





var actividadSuperTito1 = {
  // DEPRECATED: nombre: 'Súper Tito 1 ',
  id: 'SuperTito1',
  // DEPRECATED: enunciado: ' Ayudá a Tito a encender las luces. \n ¡Ojo! En todas las celdas hay una luz, pero no sabés cuántas celdas hay en cada ejecución.',
  // DEPRECATED: consignaInicial: 'Hay nuevos bloques que pueden ayudarte a resolver el desafío de manera muy sencilla. ¡Aprovechalos!',

  // DEPRECATED: escena: SuperTito1,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, EncenderLuz,IrAbajo,  TocandoFinal, Repetir,Si,Sino,Hasta],
};

export default actividadSuperTito1;
