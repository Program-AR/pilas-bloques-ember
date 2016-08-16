import Ember from 'ember';


export default Ember.Controller.extend({
  actividad: {
    iniciarEscena: function() {
      let fondo = new pilas.fondos.Tarde(); // jshint ignore:line

      pilas.escena_actual().minZ = function() {
        return this.stage.children[this.stage.children.length - 1].z;
      };

      let p = new pilas.actores.Mono();
      p.transparencia = 50;


      let tablero = new Tablero(0, -40, {texto: "Hola?"}); // jshint ignore:line

      let tablero2 = new Tablero(100, -40, {texto: "Hola?"}); // jshint ignore:line

      let a = new pilas.actores.Aceituna();
      a.z = 10;
      a.x = [80];
      a.y = [20];




    },
    iniciarBlockly: function() {

    },
    finalizaCargarBlockly: function() {

    },
  }
});
