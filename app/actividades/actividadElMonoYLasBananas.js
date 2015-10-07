import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Sensor,Si,Procedimiento} = bloques;

var Avanzar = Accion.extend({
  init() {
    this._super();
    this.set('id', 'Avanzar');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('derecha.png'))
         .appendField('Avanzar');
  },

  nombre_comportamiento() {
    return 'MoverACasillaDerecha';
  },

  argumentos() {
    return '{}';
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
          .appendField('Comer ')
         .appendField(this.obtener_icono('../libs/data/iconos.banana.png'));
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';
  },

  argumentos() {
    return '{\'etiqueta\' : \'BananaAnimada\',  \'mensajeError\' : \'No hay una banana aqui\' }';
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
         .appendField('¿Tocando ')
         .appendField(new Blockly.FieldImage('libs/data/iconos.banana.png', 15, 15, 'banana'))
         .appendField(' ?');

  },

  nombre_sensor() {
    return 'tocando(\'BananaAnimada\')';
  }
});




var actividadElMonoYLasBananas = {
  nombre: 'El Mono y las Bananas',
  enunciado:
    '¿Podés hacer que el mono avance al casillero de enfrente?'+
    ' Si hay una banana debe comérsela. Sino, es feliz con sólo llegar. \n '+
    'Ejecutá el programa varias veces para asegurarte que siempre funciona. \n' +
    'Pista: Mirá la categoría "Sensores" y la categoría "Control".',

  consignaInicial: 'Nuestro procedimiento debe considerar cómo es el escenario del protagonista.  Si no varía, decimos que es un escenario fijo.',
  
  // la escena proviene de ejerciciosPilas
  escena: ElMonoYLasBananas,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Si],
  expresiones: [],
  acciones: [ComerBanana,Avanzar],
  sensores: [TocandoBanana],
};

export default actividadElMonoYLasBananas;
