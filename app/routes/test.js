import Ember from 'ember';
//import Actividades from '../actividades';


export default Ember.Route.extend({
  actividades: Ember.inject.service(),

  model: function() {
    var actividad = this.get('actividades').obtenerPorNombre('alien');

    return {actividad: actividad};
  }
});
