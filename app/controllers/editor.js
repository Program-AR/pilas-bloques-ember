import Ember from 'ember';

export default Ember.Controller.extend({
  nombre_escenario: "alien_laberinto",
  tuercas_recolectadas: 0,

  actions: {

    reiniciar: function() {
      var controller = this;

      var escenarios = {};
      var nombre_escenario = this.get('nombre_escenario');

      escenarios.alien_laberinto = function() {
        pilas.reiniciar();

        function convertir_posicion_a_coordenada(fila, columna) {
          var columnas = [-175, -105, -35, 35, 105, 175];
          var filas = [140, 60, -20, -100, -180];

          return {x: columnas[columna-1], y: filas[fila-1]};
        }

          var fondo = new pilas.fondos.Laberinto1();
          var alien = new pilas.actores.Alien(-175, -180);

          window.alien = alien;
          window.fondo = fondo;

          alien.cuando_busca_recoger = function() {
            var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, 'Tuerca');

            if (actores.length > 0) {
              var mensaje = "";
              actores[0].eliminar();
              var restantes = pilas.obtener_actores_con_etiqueta("Tuerca").length;

              controller.incrementProperty('tuercas_recolectadas');


              if (restantes > 0) {
                mensaje = "genial, aún quedan: " + restantes;
              } else {
                mensaje = "¡Nivel completado!";
              }

              //alien.decir(mensaje);
              //console.log(mensaje);
            }
          };


          var posicion = convertir_posicion_a_coordenada(1, 1);
          var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);

          posicion = convertir_posicion_a_coordenada(3, 2);
          tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);

          posicion = convertir_posicion_a_coordenada(5, 3);
          tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);

          posicion = convertir_posicion_a_coordenada(3, 6);
          tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);
      };

      if (nombre_escenario in escenarios) {
        escenarios[nombre_escenario].call(this);
      } else {
        throw new Error("No se puede cargar el escenario {{ESCENARIO}}, al parecer no está declarado en pilas-canvas.js".replace("{{ESCENARIO}}", nombre_escenario));
      }
    }
  }
});
