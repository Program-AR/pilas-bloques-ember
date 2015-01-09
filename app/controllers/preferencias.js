import Ember from 'ember';

export default Ember.Controller.extend({
  edicion: false,
  actions: {
    guardar: function() {
      var model = this.get('model');
      model.save().then(function() {
        this.set('edicion', false);
      });
    },
    editar: function() {
      this.set('edicion', true);
    },
  }
});
