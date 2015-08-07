import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    onSelect(name) {
      this.transitionToRoute('desafios.nombre', name);
    }
  }
});
