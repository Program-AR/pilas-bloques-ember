/*

siguienteFila(){
 this.robot.hacer_luego(avanzarFilaEnCuadriculaMultiple,{'cuadriculaMultiple':this.cuadricula})
}*/

import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Sensor, Si,Repetir,Procedimiento} = bloques;

var Avanzar = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'Avanzar');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('Avanzar')
         .appendField(this.obtener_icono('derecha.png'));
  },

  nombre_comportamiento: function() {
    return 'MoverACasillaDerecha';
  },

  argumentos: function() {
    return '{}';
  }
});

var Atras = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'Atras');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('Atras')
         .appendField(this.obtener_icono('izquierda.png'));
  },

  nombre_comportamiento: function() {
    return 'MoverACasillaIzquierda';
  },

  argumentos: function() {
    return '{}';
  }
});

var SiguienteFila = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'SiguienteFila');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('Siguiente Fila')
         .appendField(this.obtener_icono('abajo.png'));
  },

  nombre_comportamiento: function() {
    return 'AvanzarFilaEnCuadriculaMultiple';
  },

  argumentos: function() {
    return '{\'cuadriculaMultiple\':this.cuadricula}';
  }
});




var actividadFutbolRobots = {
  nombre: 'Futbol de robots',
  enunciado: 'Ayudá a nuestro robot',

  // la escena proviene de ejerciciosPilas
  escena: FutbolRobots, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Si,Repetir],
  expresiones: [],
  acciones: [Avanzar,Atras,SiguienteFila],
  sensores: [],
};

export default actividadFutbolRobots;
