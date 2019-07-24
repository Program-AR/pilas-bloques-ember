import Component from '@ember/component';

export default Component.extend({
  tagName: 'nav',
  classNames: ['navbar', 'navbar-default'],
  mostrarDialogoAyuda: false,

  actions: {
    abrirAyuda() {
      this.set('mostrarDialogoAyuda', true);
    },
  }
});
