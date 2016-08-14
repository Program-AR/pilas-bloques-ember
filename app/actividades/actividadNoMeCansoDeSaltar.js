import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Repetir, Procedimiento} = bloques;

var Saltar = Accion.extend({

  init() {
    this._super();
    this.set('id', 'saltar1');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
          .appendField(this.obtener_icono('arriba.png'))
          .appendField('Saltar');

  },

  nombre_comportamiento() {
    return 'SaltarHablando';
  },

  argumentos() {
    return '{ velocidad_inicial: 30, alturaDeseada: 150, cantPasos: 20 }';
  }
});


var actividadNoMeCansoDeSaltar = {
  // DEPRECATED: nombre: 'No me canso de saltar',
  id: 'NoMeCansoDeSaltar',
  // DEPRECATED: enunciado: 'Ayudá al gato a quitarse la pereza saltando 30 veces seguidas. Pista: se puede resolver con menos de 30 bloques.',
  // DEPRECATED: consignaInicial: 'El bloque Repetir permite elegir la cantidad de veces que se desea repetir una secuencia de acciones. Esto se llama "Repetición simple".',

  // DEPRECATED: escena: NoMeCansoDeSaltar,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, Saltar],
};

export default actividadNoMeCansoDeSaltar;
