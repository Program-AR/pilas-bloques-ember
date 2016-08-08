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
          .appendField(this.obtener_icono('../libs/data/icono.Lamparita.png'))
          .appendField('Prender luz');
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
         .appendField('¿Hay lamparita acá ')
         .appendField(this.obtener_icono('../libs/data/icono.LamparitaApagada.png'))
         .appendField(' ?');

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
         .appendField('¿Llegué al final ')
         .appendField(this.obtener_icono('../libs/data/casilla.titoFinalizacion.png'))
         .appendField(' ?');

  },

  nombre_sensor() {
    return 'estoyUltimaFila()';
  }
});

export {EncenderLuz,TocandoLuz,TocandoFinal};
