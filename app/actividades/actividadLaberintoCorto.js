/*

siguienteFila(){
 this.robot.hacer_luego(avanzarFilaEnCuadriculaMultiple,{'cuadriculaMultiple':this.cuadricula})
}*/

import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
var {Accion} = bloques;


//import comer from 'pilas-engine-bloques/actividades/comer';


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
  control: [],
  expresiones: [],
  acciones: [],
  sensores: [],
};

export default actividadLaberintoCorto;
