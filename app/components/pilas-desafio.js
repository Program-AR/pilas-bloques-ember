import Component from '@ember/component';

export default Component.extend({
  classNames: ['desafio'],
  nombre: null,
  deshabilitada: false,

  actions: {
    abrir() {
      this.sendAction('onSelect', this.nombre);
    }
  }
});
