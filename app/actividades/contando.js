import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion} = bloques;

var ContandoBanana = Accion.extend({
  init() {
    this._super();
    this.set('id', 'ContandoBanana');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
          .appendField('Contar ')
         .appendField(this.obtener_icono('../libs/data/iconos.banana.png'));
  },

  nombre_comportamiento() {
    return 'ContarPorEtiqueta';
  },

  argumentos() {
    return '{\'etiqueta\' : \'BananaAnimada\',  \'mensajeError\' : \'No hay una banana aqui\',\'dondeReflejarValor\': \'pilas.escena_actual().cantidadBananas\' }';
  }
});


var ContandoManzana = Accion.extend({
  init() {
    this._super();
    this.set('id', 'ContandoManzana');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
          .appendField('Contar ')
         .appendField(this.obtener_icono('../libs/data/iconos.manzana.png'));
  },

  nombre_comportamiento() {
    return 'ContarPorEtiqueta';
  },

  argumentos() {
    return '{\'etiqueta\' : \'ManzanaAnimada\',  \'mensajeError\' : \'No hay una manzana aqui\',\'dondeReflejarValor\': \'pilas.escena_actual().cantidadManzanas\' }';
  }
});


var contando = {ContandoBanana,ContandoManzana};

export default contando;
