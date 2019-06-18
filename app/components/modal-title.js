import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    ocultar() {
      this.sendAction("close");
    },
  }
});
