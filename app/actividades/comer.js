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
          .appendField('Comer banana ')
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
         .appendField('Comer manzana')
         .appendField(this.obtener_icono('../libs/data/iconos.manzana.png'));
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';
  },

  argumentos() {
    return '{\'etiqueta\' : \'ManzanaAnimada\',  \'mensajeError\' : \'No hay una manzana aqui\' }';
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
         .appendField('Comer queso')
         .appendField(this.obtener_icono('../libs/data/queso.png'));
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';
  },

  argumentos() {
    return '{\'etiqueta\' : \'QuesoAnimado\',  \'mensajeError\' : \'No hay queso aqui\' }';
  }
});


var comer= {ComerBanana,ComerManzana,ComerQueso};

export default comer;
