import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    console.error("Volviendo a la vista index porque no hay un modelo para cargar.");
    return this.transitionTo('solucion.index');
  }
});
