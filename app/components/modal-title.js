import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  actions: {
    ocultar() {
      this.sendAction("close");
    },
  }
});
