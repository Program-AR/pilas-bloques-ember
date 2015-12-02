/* globals NoMeCansoDeSaltar */
import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Repetir} = bloques;

var Saltar = Accion.extend({

  init() {
    this._super();
    this.set('id', 'saltar1');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
          .appendField('saltar')
         .appendField(this.obtener_icono('arriba.png'));

  },

  nombre_comportamiento() {
    return 'SaltarHablando';
  },

  argumentos() {
    return '{  }';
  }
});


var actividadNoMeCansoDeSaltar = {
  nombre: 'No me canso de saltar',
  enunciado: 'A definir.',
  consignaInicial: 'A definir.',

  escena: NoMeCansoDeSaltar,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Repetir],
  expresiones: [],
  acciones: [Saltar],
  sensores: []
};

export default actividadNoMeCansoDeSaltar;
