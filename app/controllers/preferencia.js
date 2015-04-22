import Ember from 'ember';
/*global model*/
export default Ember.ObjectController.extend({
  edicion: false,
  actions: {
    guardar: function() {
      var record = this.store.find('preferencium', {tipo: 'principal'});
      record.save();

      model.save().then(function() {
        this.set('edicion', false);
      });

    },
    editar: function() {
      this.set('edicion', true);
    },
  }
});
