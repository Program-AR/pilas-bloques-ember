import Ember from 'ember';

export default Ember.Component.extend({
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
