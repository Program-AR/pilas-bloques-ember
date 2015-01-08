import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var store = this.store;
    var promise = store.find('setup', 1);
    var data = {};

    promise.
      then(function(data) {
        return data;
      }).
      catch(function(reason) {
        var data = store.createRecord('setup', {
          id: 4,
          nombre: "pepe",
        });

        data.save();
      });

    return data;
  }
});
