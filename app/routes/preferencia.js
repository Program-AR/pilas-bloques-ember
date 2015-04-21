import Ember from 'ember';

/*jshint unused: vars */
export default Ember.Route.extend({
  model: function() {
    var record = this.store.find('preferencium', {tipo: 'principal'});
    var controller = this;

    record.then(function(data) {
      return data;
    }).
    catch(function(err) {
      return controller.store.createRecord('preferencium', {
        tipo: 'principal',
        nombre: 'nombre sin definir'
      }).save();

    });
  }
});
