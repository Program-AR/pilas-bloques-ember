import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    ocultar() {
      if (this.close) this.close()
    },
  }
});
