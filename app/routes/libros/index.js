import Ember from 'ember';
import ENV from 'pilas-engine-bloques/config/environment';

export default Ember.Route.extend({

  beforeModel() {
    if (ENV.ocultar_seccion_libros) {
      console.warn("Evitando la sección libros, porque se deshabilitó desde la configuración.");
      return this.transitionTo('libros.verLibro', 1);
    }
  },
});
