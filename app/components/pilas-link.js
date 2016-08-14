import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  href: null,
  inNWJS: false,

  didInsertElement() {
    this.set('inNWJS', (typeof process !== "undefined"));
  },

  actions: {
    abrirConNavegadorExterno(url) {
      window['requireNode']('nw.gui').Shell.openExternal(url);
    }
  }
});
