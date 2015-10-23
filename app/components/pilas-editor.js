import Ember from 'ember';

export default Ember.Component.extend({
  actividad: null,
  solucion: null,

  actions: {
    reiniciar() {
      this.get('actividad').iniciarEscena();
    }
  }
});
