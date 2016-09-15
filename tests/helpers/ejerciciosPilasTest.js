import { moduleForComponent } from 'ember-qunit';

export function moduloEjerciciosPilas(nombre) {
  let titulo = `Integration | EjerciciosPilas | ${nombre}`;

  moduleForComponent('pilas-canvas', titulo, {
    integration: true,
  });
}

/**
 * Decora un comportamiento, permitiendo llamar un callback cuando finaliza.
 */
function ComportamDecorator(argumentos) {
  this.argumentos = argumentos;
}

ComportamDecorator.prototype = {
  iniciar: function(receptor) {
        this.comportamiento = new this.argumentos.comportamiento(this.argumentos.argumentos);
        this.comportamiento.iniciar(receptor);
  },

  actualizar: function() {
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
export function hacerLuegoConCallback(actor, claseComport, argumentos, callback) {
    actor.hacer_luego(ComportamDecorator,
        {comportamiento: claseComport, callback: callback, argumentos: argumentos});
}
