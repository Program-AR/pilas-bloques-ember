import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['desafio'],
  nombre: null,
  deshabilitada: false,

  actions: {
    abrir: function() {
      debugger;
      this.transitionToRoute('desafios.numero', this.get('nombre'));
    }
  }
});
