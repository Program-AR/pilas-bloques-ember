import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  href: null,
  inElectron: false,

  didInsertElement() {
    this.set('inElectron', (typeof process !== "undefined"));
  },

  actions: {
    abrirConNavegadorExterno(url) {
      const {shell} = require('electron');
      shell.openExternal(url);
    }
  }
});
