import Ember from 'ember';

var data = {
  nombre: "Hugo"
};

export default Ember.Route.extend({
  model: function() {
    return data;
  }
});
