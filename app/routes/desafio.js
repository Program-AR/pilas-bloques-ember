import Ember from 'ember';

export default Ember.Route.extend({
  pilas: Ember.inject.service(),
  actividades: Ember.inject.service(),

  // NOTA: el model hook está implícito, solo retornará el modelo por id.

  afterModel(model) {
    let actividad = this.get("actividades").obtenerPorNombre(model.get('nombre'));
    model.set('actividad', actividad);
  }
});
