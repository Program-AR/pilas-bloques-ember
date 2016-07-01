import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion,Sensor} = bloques;

var EncenderLuz = Accion.extend({
  init() {
    this._super();
    this.set('id', 'EncenderLuz');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('../libs/data/iconos.lamparita.png'))
          .appendField('Encender luz ');
  },

  nombre_comportamiento() {
    return 'EncenderPorEtiqueta';
  },

  argumentos() {
    return "{'etiqueta':'Luz'}";
  }
});

var TocandoLuz = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'tocandoLuz');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿Tocando luz ')
         .appendField(this.obtener_icono('../libs/data/iconos.lamparita.png'))
         .appendField('?');
  },

  nombre_sensor() {
    return 'tocando(\'Lamparin\')';
  }
});


var TocandoFinal = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'tocandoFinal');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('¿Tocando fin ')
         .appendField(this.obtener_icono('../libs/data/casilla.titoFinalizacion.png'))
         .appendField('?');
  },

  nombre_sensor() {
    return 'estoyUltimaFila()';
  }
});

export {EncenderLuz,TocandoLuz,TocandoFinal};
