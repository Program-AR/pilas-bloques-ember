import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    if (params.galeria_id !== "new") {
      return this.store.find('galeria', params.galeria_id);
    } else {
      return null;
    }
  }
});
