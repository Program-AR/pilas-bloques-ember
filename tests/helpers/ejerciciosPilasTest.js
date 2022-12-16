import { module } from 'qunit';
import { setupPBIntegrationTest } from '../helpers/utils'
import 'ember-qunit';

export function moduloEjerciciosPilas(nombre, runExerciseTests) {
  module(`Integration | EjerciciosPilas | ${nombre}`, (hooks) => {
    setupPBIntegrationTest(hooks);
    runExerciseTests();
  });
}

/**
 * Decora un comportamiento, permitiendo llamar un callback cuando finaliza.
 */
function ComportamientoDecorator(argumentos) {
  this.argumentos = argumentos;
}

ComportamientoDecorator.prototype = {
  iniciar: function (receptor) {
    this.comportamiento = new this.argumentos.comportamiento(this.argumentos.argumentos);
    this.comportamiento.iniciar(receptor);
  },

  actualizar: function () {
    var termino = this.comportamiento.actualizar();
    if (termino) {
      this.argumentos.callback();
    }
    return termino;
  },
};

/**
 * Llama un callback luego que el actor finaliza un comportamiento.
 */
export function hacerLuegoConCallback(actor, ComportamientoClass, argumentos, callback) {
  actor.hacer_luego(ComportamientoDecorator,
    { comportamiento: ComportamientoClass, callback: callback, argumentos: argumentos });
}
