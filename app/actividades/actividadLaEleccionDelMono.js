import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Repetir} = bloques;

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


var ComerManzana = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'ComerManzana');
  },


  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('izquierda.png'))
         .appendField('Comer Manzana');
  },

  nombre_comportamiento: function() {
    return 'RecogerPorEtiqueta';
  },

  argumentos: function() {
    return '{\'etiqueta\' : \'ManzanaAnimada\',  \'mensajeError\' : \'No hay una manzana aqui\' }';
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
         .appendField(this.obtener_icono('izquierda.png'))
         .appendField('Comer Banana');
  },

  nombre_comportamiento: function() {
    return 'RecogerPorEtiqueta';
  },

  argumentos: function() {
    return '{\'etiqueta\' : \'BananaAnimada\',  \'mensajeError\' : \'No hay una banana aqui\' }';
  }
});



var TocandoManzana = Sensor.extend({
  init: function() {
    this._super();
    this.set('id', 'tocandoManzana');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('Tocando Manzana')
         .appendField(new Blockly.FieldImage('libs/data/tuerca.png', 15, 15, 'manzana'));
  },

  nombre_sensor: function() {
    return 'tocando(\'ManzanaAnimada\')';
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
         .appendField('Tocando Banana')
         .appendField(new Blockly.FieldImage('libs/data/tuerca.png', 15, 15, 'banana'));
  },

  nombre_sensor: function() {
    return 'tocando(\'BananaAnimada\')';
  }
});




var actividadLaEleccionDelMono = {
  nombre: 'La elección del mono',
  enunciado: 'Ayudá a nuestro obrero',

  // la escena proviene de ejerciciosPilas
  escena: LaEleccionDelMono, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Si],
  expresiones: [],
  acciones: [ComerManzana,ComerBanana,Avanzar],
  sensores: [TocandoManzana,TocandoBanana],
};

export default actividadLaEleccionDelMono;
