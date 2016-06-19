import Ember from 'ember';
//import Actividades from '../actividades';


export default Ember.Route.extend({
  actividades: Ember.inject.service(),

  model() {
    var actividad = this.get('actividades').obtenerPorNombre('alien');

    return {actividad: actividad};
  }
});
