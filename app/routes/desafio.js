import Ember from 'ember';

export default Ember.Route.extend({
  //pilas: Ember.inject.service(),

  // NOTA: el model hook está implícito, solo retornará el modelo por id.

  afterModel(model) {
    //console.log(model);
    //return this.get("actividades").obtenerPorNombre(model.get('nombre'));
  }
});
