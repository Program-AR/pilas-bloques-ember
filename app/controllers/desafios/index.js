import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    onSelect: function(name) {
      this.transitionToRoute('desafios.nombre', name);
    }
  }
});
