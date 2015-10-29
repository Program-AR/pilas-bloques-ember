import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
//import comer from 'pilas-engine-bloques/actividades/comer';
var {Accion, Si, Repetir,Hasta, Procedimiento,Funcion} = bloques;
var {IrDerecha,IrIzquierda,IrAbajo,IrArriba} = direcciones;


var actividadAlimentandoALosPeces = {
  nombre: 'Alimentando a los peces',
  enunciado:'..',

  // la escena proviene de ejerciciosPilas
  escena: AlimentandoALosPeces, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Si,Repetir,Hasta],
  expresiones: [Funcion],
  acciones: [IrDerecha,IrIzquierda,IrAbajo,IrArriba],
  sensores: [],
};

export default actividadAlimentandoALosPeces;
