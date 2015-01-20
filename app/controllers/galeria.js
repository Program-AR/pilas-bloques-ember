import Ember from 'ember';

export default Ember.ArrayController.extend({
  actions: {
    eliminar: function(record) {
      record.destroyRecord();
    }
  }
});
