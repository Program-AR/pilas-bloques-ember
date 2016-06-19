import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  actions: {
    close() {
      this.set("mostrar", false);
    }
  }

});
