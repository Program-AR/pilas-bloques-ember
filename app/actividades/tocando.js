import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Sensor} = bloques;

var TocandoManzana = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'tocandoManzana');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿Tocando manzana ')
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
         .appendField('¿Tocando banana ')
         .appendField(this.obtener_icono('../libs/data/iconos.banana.png'))
         .appendField('?');
  },

  nombre_sensor() {
    return 'tocando(\'BananaAnimada\')';
  }
});

var TocandoAbajo = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'TocandoAbajo');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿Tocando abajo ')
         .appendField(this.obtener_icono('abajo.png'))
         .appendField(' ?');

  },

  nombre_sensor() {
    return 'hayAbajo()';
  }
});
var TocandoDerecha = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'TocandoDerecha');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿Tocando derecha ')
         .appendField(this.obtener_icono('derecha.png'))
         .appendField(' ?');

  },

  nombre_sensor() {
    return 'hayDerecha()';
  }
});

var TocandoFinCamino = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'TocandoFinCamino');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿Tocando ')
         .appendField(this.obtener_icono('../libs/data/finCamino.png'))
         .appendField(' ?');

  },

  nombre_sensor() {
    return 'alFinalDelCamino()';
  }
});

var tocando = {TocandoBanana,TocandoManzana,TocandoAbajo,TocandoDerecha,TocandoFinCamino};

export default tocando;
