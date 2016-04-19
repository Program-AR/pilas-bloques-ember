/* globals NoMeCansoDeSaltar */
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
          .appendField('Saltar')
         .appendField(this.obtener_icono('arriba.png'));

  },

  nombre_comportamiento() {
    return 'SaltarHablando';
  },

  argumentos() {
    return '{ gravedad: 0.13, velocidad_inicial: 7 }';
  }
});


var actividadNoMeCansoDeSaltar = {
  nombre: 'No me canso de saltar',
  id: 'NoMeCansoDeSaltar',
  enunciado: 'Ayudá al gato a quitarse la pereza saltando 30 veces seguidas. Pista: se puede resolver con menos de 30 bloques.',
  consignaInicial: 'El bloque Repetir permite elegir la cantidad de veces que se desea repetir una secuencia de acciones.',

  escena: NoMeCansoDeSaltar,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, Saltar],
};

export default actividadNoMeCansoDeSaltar;
