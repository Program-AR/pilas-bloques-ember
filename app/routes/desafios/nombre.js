import Ember from 'ember';

export default Ember.Route.extend({
  actividades: Ember.inject.service(),
  
  model: function(param) {
    var actividad = this.get('actividades').obtenerPorNombre(param.nombre);

    if (!actividad) {
      alert("ERROR: no existe un desafio con ese nombre");
      return {};
    }

    return {actividad: actividad};
  }
});
