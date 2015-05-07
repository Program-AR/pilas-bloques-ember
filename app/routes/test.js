import Ember from 'ember';
//import Actividades from '../actividades';

var actividad = {
  init: function() {
    new pilas.fondos.Laberinto1();
    var alien = new pilas.actores.Alien(-175, -180);
  },
  enunciado: "Un ejemplo pepepe....",
};

export default Ember.Route.extend({
  model: function() {
    return {actividad: actividad};
  }
});
