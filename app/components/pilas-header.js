import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['navbar', 'navbar-default'],
  mostrarDialogoAyuda: false,

  actions: {
    abrirAyuda() {
      this.set('mostrarDialogoAyuda', true);
    },
  }
});
