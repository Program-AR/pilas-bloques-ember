import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Sensor,Si,Procedimiento} = bloques;

var Avanzar = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'Avanzar');
  },


  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('derecha.png'))
         .appendField('Avanzar');
  },

  nombre_comportamiento: function() {
    return 'MoverACasillaDerecha';
  },

  argumentos: function() {
    return '{}';
  }
});



var ComerBanana = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'ComerBanana');
  },


  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
          .appendField('Comer ')
         .appendField(this.obtener_icono('../libs/data/iconos.banana.png'));
  },

  nombre_comportamiento: function() {
    return 'RecogerPorEtiqueta';
  },

  argumentos: function() {
    return '{\'etiqueta\' : \'BananaAnimada\',  \'mensajeError\' : \'No hay una banana aqui\' }';
  }
});





var TocandoBanana = Sensor.extend({
  init: function() {
    this._super();
    this.set('id', 'tocandoBanana');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿Tocando ')
         .appendField(new Blockly.FieldImage('libs/data/iconos.banana.png', 15, 15, 'banana'))
         .appendField(' ?');

  },

  nombre_sensor: function() {
    return 'tocando(\'BananaAnimada\')';
  }
});




var actividadElMonoYLasBananas = {
  nombre: 'La elección del mono',
  enunciado: 'Ayudá a nuestro obrero',

  // la escena proviene de ejerciciosPilas
  escena: ElMonoYLasBananas,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Si],
  expresiones: [],
  acciones: [ComerBanana,Avanzar],
  sensores: [TocandoBanana],
};

export default actividadElMonoYLasBananas;
