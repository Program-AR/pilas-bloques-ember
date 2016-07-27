import Ember from 'ember';

export default Ember.Component.extend({
  persistirSolucionEnURL: true,

  actions: {
    onReady(pilas) {
      this.sendAction("onReady", pilas);
    }
  }
});
