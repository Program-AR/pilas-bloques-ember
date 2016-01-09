import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import bloquesTito from 'pilas-engine-bloques/actividades/bloquesTito';
var {Si, Repetir, Procedimiento,Hasta} = bloques;
var {IrAbajo} = direcciones;
var {EncenderLuz,TocandoFinal} = bloquesTito;





var actividadSuperTito1 = {
  nombre: 'Súper Tito 1 ',
  enunciado: ' Ayudá a Tito a encender las luces. \n ¡Ojo! En todas las celdas hay una luz, pero no sabés cuántas hay en cada ejecución.',
  consignaInicial: 'Existen bloques que pueden ayudarte a resolver el desafío de manera muy sencilla. ¡Aprovechalos!',
  
  escena: SuperTito1,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  variables: [],
  control: [Si,Repetir,Hasta],
  expresiones: [],
  acciones: [EncenderLuz,IrAbajo],
  sensores: [TocandoFinal],
};

export default actividadSuperTito1;
