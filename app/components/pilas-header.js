import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['navbar', 'navbar-default'],
  mostrarDialogoOpciones: false,
  mostrarDialogoAyuda: false,

  actions: {
    abrirPreferencias() {
      this.set('mostrarDialogoOpciones', true);
    },

    abrirAyuda() {
      this.set('mostrarDialogoAyuda', true);
    },
  }
});
