import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNames: [],
  mostrarDialogoAyuda: false,

  actions: {
    abrirAyuda() {
      this.set('mostrarDialogoAyuda', true);
    },
  }
});
