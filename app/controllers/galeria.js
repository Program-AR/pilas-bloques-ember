import Ember from 'ember';

export default Ember.ArrayController.extend({
  actions: {
    eliminar(record) {
      record.destroyRecord();
    },

    abrir(record) {
      this.transitionToRoute('editor', record);
    },
  }
});
