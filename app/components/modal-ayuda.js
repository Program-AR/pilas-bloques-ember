import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    close() {
      this.set("mostrar", false);
    }
  }

});
