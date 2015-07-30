/*

siguienteFila(){
 this.robot.hacer_luego(avanzarFilaEnCuadriculaMultiple,{'cuadriculaMultiple':this.cuadricula})
}*/

import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Sensor, Si,Repetir,Procedimiento,Hasta} = bloques;

var Avanzar = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'Avanzar');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('avanzar')
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
     .appendField('atrás')
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
         .appendField('siguiente fila')
         .appendField(this.obtener_icono('abajo.png'));
  },

  nombre_comportamiento: function() {
    return 'avanzarFilaEnCuadriculaMultiple';
  },

  argumentos: function() {
    return '{}';
  }
});


var PatearPelota = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'PatearPelota');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('patear')
         .appendField(this.obtener_icono('../libs/data/iconos.pelota.png'));
  },

  nombre_comportamiento: function() {
    return 'RecogerPorEtiqueta';
  },

  argumentos: function() {

  return '{\'etiqueta\':\'PelotaAnimada\',\'mensajeError\' : \'No hay una pelota aquí\'}';


  }
});



var TocandoInicio = Sensor.extend({
  init: function() {
    this._super();
    this.set('id', 'tocandoInicio');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿tocando inicio?')
         .appendField(this.obtener_icono('../libs/data/iconos.pelota.png'));

  },

  nombre_sensor: function() {
    return 'tocandoInicio()';
  }
});

var TocandoPelota = Sensor.extend({
  init: function() {
    this._super();
    this.set('id', 'tocandoPelota');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿tocando')
         .appendField(this.obtener_icono('../libs/data/iconos.pelota.png'))
         .appendField('?');
  },

  nombre_sensor: function() {
    return 'tocando(\'PelotaAnimada\')';
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
  control: [Si,Repetir,Hasta],
  expresiones: [],
  acciones: [Avanzar,Atras,SiguienteFila,PatearPelota],
  sensores: [TocandoInicio,TocandoPelota],
};

export default actividadFutbolRobots;
