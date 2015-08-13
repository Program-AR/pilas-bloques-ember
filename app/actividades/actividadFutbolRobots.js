/*

siguienteFila(){
 this.robot.hacer_luego(avanzarFilaEnCuadriculaMultiple,{'cuadriculaMultiple':this.cuadricula})
}*/

import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Sensor, Si,Repetir,Procedimiento,Hasta} = bloques;

var Avanzar = Accion.extend({
  init() {
    this._super();
    this.set('id', 'Avanzar');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('avanzar')
         .appendField(this.obtener_icono('derecha.png'));
  },

  nombre_comportamiento() {
    return 'MoverACasillaDerecha';
  },

  argumentos() {
    return '{}';
  }
});

var Atras = Accion.extend({
  init() {
    this._super();
    this.set('id', 'Atras');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
     .appendField('atrás')
     .appendField(this.obtener_icono('izquierda.png'));
   },

  nombre_comportamiento() {
    return 'MoverACasillaIzquierda';
  },

  argumentos() {
    return '{}';
  }
});

var SiguienteFila = Accion.extend({
  init() {
    this._super();
    this.set('id', 'SiguienteFila');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('siguiente fila')
         .appendField(this.obtener_icono('abajo.png'));
  },

  nombre_comportamiento() {
    return 'avanzarFilaEnCuadriculaMultiple';
  },

  argumentos() {
    return '{}';
  }
});


var PatearPelota = Accion.extend({
  init() {
    this._super();
    this.set('id', 'PatearPelota');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('patear')
         .appendField(this.obtener_icono('../libs/data/iconos.pelota.png'));
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';
  },

  argumentos() {

  return '{\'etiqueta\':\'PelotaAnimada\',\'mensajeError\' : \'No hay una pelota aquí\'}';


  }
});



var TocandoInicio = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'tocandoInicio');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿tocando inicio?')
         .appendField(this.obtener_icono('../libs/data/iconos.pelota.png'));

  },

  nombre_sensor() {
    return 'tocandoInicio()';
  }
});

var TocandoPelota = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'tocandoPelota');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿tocando')
         .appendField(this.obtener_icono('../libs/data/iconos.pelota.png'))
         .appendField('?');
  },

  nombre_sensor() {
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
