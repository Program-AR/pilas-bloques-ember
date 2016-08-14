import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Sensor, Repetir, Si, Sino, Procedimiento} = bloques;

var Avanzar = Accion.extend({
  init() {
    this._super();
    this.set('id', 'Avanzar');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('derecha.png'))
         .appendField('Mover a la derecha');
  },

  nombre_comportamiento() {
    return 'MoverACasillaDerecha';
  },

  argumentos() {
    return '{}';
  }
});


var ComerManzana = Accion.extend({
  init() {
    this._super();
    this.set('id', 'ComerManzana');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('../libs/data/iconos.manzana.png'))
         .appendField('Comer manzana ');
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';
  },

  argumentos() {
    return '{\'etiqueta\' : \'ManzanaAnimada\',  nombreAnimacion: "comerManzana"}';
  }
});



var ComerBanana = Accion.extend({
  init() {
    this._super();
    this.set('id', 'ComerBanana');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('../libs/data/iconos.banana.png')) //TODO: Hardcodeo feo de dir de icono
         .appendField('Comer banana ');
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';
  },

  argumentos() {
    return '{\'etiqueta\' : \'BananaAnimada\',  nombreAnimacion: "comerBanana"}';
  }
});



var TocandoManzana = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'tocandoManzana');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('Hay una manzana acá')
         .appendField(this.obtener_icono('../libs/data/iconos.manzana.png'))
         .appendField('?');
  },

  nombre_sensor() {
    return 'tocando(\'ManzanaAnimada\')';
  }
});


var TocandoBanana = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'tocandoBanana');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('Hay una banana acá')
         .appendField(this.obtener_icono('../libs/data/iconos.banana.png'))
         .appendField('?');
  },

  nombre_sensor() {
    return 'tocando(\'BananaAnimada\')';
  }
});




var actividadLaEleccionDelMono = {
  // DEPRECATED: nombre: 'La elección del mono',
  id: 'LaEleccionDelMono',
  // DEPRECATED: enunciado: '¿Podés ayudar nuevamente a nuestro mono? Esta vez tiene '+
  //   'que elegir qué fruta comer. \n'+
  //  'Ejecutá el programa varias veces para asegurarte que siempre funciona. \n' +
  //  'Pista: ésta vez no alcanza con el bloque "Si".',

  // DEPRECATED: consignaInicial: 'Cuando sólo hay 2 opciones, alcanza con hacer una sola pregunta. En esos casos se puede usar el bloque "Si... si no".',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: LaEleccionDelMono, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, ComerManzana,ComerBanana,Avanzar, TocandoManzana,TocandoBanana, Repetir,Si,Sino],
};

export default actividadLaEleccionDelMono;
