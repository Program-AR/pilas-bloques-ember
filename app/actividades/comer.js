import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion} = bloques;
var ComerBanana = Accion.extend({
  init: function() {
    this._super();
    this.set('id', 'ComerBanana');
  },


  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
          .appendField(this.obtener_icono('../libs/data/iconos.banana.png'))
          .appendField('Comer banana ');
  },

  nombre_comportamiento: function() {
    return 'RecogerPorEtiqueta';
  },

  argumentos: function() {
    return '{\'etiqueta\' : \'BananaAnimada\', nombreAnimacion: "comerBanana" }';
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
         .appendField('Comer manzana');
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';
  },

  argumentos() {
    return '{\'etiqueta\' : \'ManzanaAnimada\', nombreAnimacion: "comerManzana" }';
  }
});


var ComerQueso = Accion.extend({
  init() {
    this._super();
    this.set('id', 'ComerQueso');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('../libs/data/queso.png'))
         .appendField('Comer queso');
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';
  },

  argumentos() {
    return '{\'etiqueta\' : \'QuesoAnimado\' }';
  }
});

var ComerNaranja = Accion.extend({
  init() {
    this._super();
    this.set('id', 'ComerNaranja');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('../libs/data/naranja.png'))
         .appendField('Comer naranja');
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';
  },

  argumentos() {
    return '{\'etiqueta\' : \'NaranjaAnimada\', nombreAnimacion: "comerNaranja"}';
  }
});

export {ComerBanana,ComerManzana,ComerQueso,ComerNaranja};
