import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    codigo: {
      replace: true
    }
  },
  pilas: Ember.inject.service(),

  afterModel(model) {
    model.set('actividad', "Asasdasd");
  },
});
