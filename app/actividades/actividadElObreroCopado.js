import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion} = bloques;

var Avanzar = Accion.extend({

  init() {
    this._super();
    this.set('id', 'avanzar');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('izquierda.png'))
         .appendField('avanzar');
  },

  nombre_comportamiento() {
    return 'CaminaIzquierda';
  },

  argumentos() {
    return '{ pasos: 2 }';
  }
});

var Retroceder = Accion.extend({

  init() {
    this._super();
    this.set('id', 'retroceder');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('derecha.png'))
         .appendField('retroceder');
  },

  nombre_comportamiento() {
    return 'CaminaDerecha';
  },

  argumentos() {
    return '{ pasos: 2 }';
  }
});

var Martillar = Accion.extend({

  init() {
    this._super();
    this.set('id', 'martillar');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('martillar.png'))
         .appendField('martillar');
  },

  nombre_comportamiento() {
    return 'Martillar';
  },

  argumentos() {
    return '{ veces: 20 }';
  }
});

var actividadElObreroCopado = {
  nombre: 'El Obrero Copado',
  enunciado: 'Ayudá a nuestro obrero a martillar un poco por allí.',

  // la escena proviene de ejerciciosPilas
  escena: ElObreroCopado, // jshint ignore:line
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
