import Ember from 'ember';

export default Ember.Route.extend({
  actividades: Ember.inject.service(),
  actividadActual: null,

  model: function(param) {
    var actividad = this.get('actividades').obtenerPorNombre(param.nombre);
    this.set('actividadActual', actividad);

    if (!actividad) {
      alert("ERROR: no existe un desafio con ese nombre");
      return {};
    }

    return {actividad: actividad};
  },

  actions: {
    reiniciar: function() {
      this.get('actividadActual').iniciarEscena();
    }
  }
});
