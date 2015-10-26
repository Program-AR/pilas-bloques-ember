import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Sensor,Si,Procedimiento} = bloques;




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




var actividadElMonoQueSabeContar = {
  nombre: 'El Mono y las Bananas',
  enunciado:
    'COMPLETAR'
  ,

  consignaInicial: 'COMPLETAR.',

  // la escena proviene de ejerciciosPilas
  escena: ElMonoQueSabeContar,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Si],
  expresiones: [],
  acciones: [],
  sensores: [],
};

export default actividadElMonoQueSabeContar;
