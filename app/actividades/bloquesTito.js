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
          .appendField('encender ')
         .appendField(this.obtener_icono('../libs/data/iconos.lamparita.png'));
  },

  nombre_comportamiento() {
    return 'EncenderLuz';
  },

  argumentos() {
    return '{}';
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
         .appendField('¿Tocando ')
         .appendField(this.obtener_icono('../libs/data/iconos.lamparita.png'))
         .appendField(' ?');

  },

  nombre_sensor() {
    return 'tocando(\'CasillaConLuz\')';
  }
});


var bloquesTito = {EncenderLuz,TocandoLuz};

export default bloquesTito;
