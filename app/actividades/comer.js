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



var ComerManzana = Accion.extend({
  init() {
    this._super();
    this.set('id', 'ComerManzana');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('Comer ')
         .appendField(this.obtener_icono('../libs/data/iconos.manzana.png'));
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';
  },

  argumentos() {
    return '{\'etiqueta\' : \'ManzanaAnimada\',  \'mensajeError\' : \'No hay una manzana aqui\' }';
  }
});



var comer= {ComerBanana,ComerManzana};

export default comer;
