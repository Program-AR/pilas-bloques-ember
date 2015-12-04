import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import bloquesTito from 'pilas-engine-bloques/actividades/bloquesTito';
var {Si, Repetir, Procedimiento,Hasta} = bloques;
var {IrAbajo} = direcciones;
var {EncenderLuz,TocandoFinal} = bloquesTito;





var actividadSuperTito1 = {
  nombre: 'Super Tito 1 ',
  enunciado: ' Ayuda a Tito a encender las luces. ¡Ojo! Existen bloques que pueden ayudarte a resolver el desafío de manera muy sencilla. ¡Aprovechalos!. \n',
  
  // la escena proviene de ejerciciosPilas
  escena: SuperTito1,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un automata
  variables: [],
  control: [Si,Repetir,Hasta],
  expresiones: [],
  acciones: [EncenderLuz,IrAbajo],
  sensores: [TocandoFinal],
};

export default actividadSuperTito1;
