import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Sensor} = bloques;

var Avanzar = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'avanzar');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('izquierda.png'))
         .appendField('avanzar');
  },

  nombre_comportamiento: function() {
    return 'CaminaIzquierda';
  },

  argumentos: function() {
    return '{ pasos: 2 }';
  }
});

var Retroceder = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'retroceder');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('derecha.png'))
         .appendField('retroceder');
  },

  nombre_comportamiento: function() {
    return 'CaminaDerecha';
  },

  argumentos: function() {
    return '{ pasos: 2 }';
  }
});

var Martillar = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'martillar');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('martillar.png'))
         .appendField('martillar');
  },

  nombre_comportamiento: function() {
    return 'Martillar';
  },

  argumentos: function() {
    return '{ veces: 20 }';
  }
});

var actividadElObreroCopado = {
  nombre: 'El Obrero Copado',
  enunciado: 'Ayudá a nuestro obrero',

  escena: ElObreroCopado,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [],
  expresiones: [],
  acciones: [Avanzar, Retroceder, Martillar],
  sensores: [],
};

export default actividadElObreroCopado;
