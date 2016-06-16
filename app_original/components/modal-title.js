import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    ocultar() {
      this.sendAction("close");
    }
  }
});
