import Ember from 'ember';

export default Ember.Controller.extend({
  nombre_escenario: "alien_laberinto",
  actions: {

    reiniciar: function() {
      var escenarios = {};
      var nombre_escenario = this.get('nombre_escenario');

      escenarios.alien_laberinto = function() {
        pilas.reiniciar();
        window.alien = new pilas.actores.Alien();
      }

      if (nombre_escenario in escenarios)
        escenarios[nombre_escenario].call(this);
      else
        throw new Error("No se puede cargar el escenario {{ESCENARIO}}, al parecer no está declarado en pilas-canvas.js".replace("{{ESCENARIO}}", nombre_escenario));

    }
  }
});
