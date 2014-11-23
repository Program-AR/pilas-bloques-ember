import Ember from 'ember';

export default Ember.Controller.extend({
  edicion: false,
  actions: {
    guardar: function() {
      this.set('edicion', false);
      var c = this.store.find('preferencias');
      console.log(c.toArray());
    },
    editar: function() {
      this.set('edicion', true);
    },
  }
});
