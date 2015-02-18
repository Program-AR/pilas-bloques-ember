import Ember from 'ember';

var Bootstrap = window.Bootstrap;

export default Ember.Controller.extend({
  nombre_escenario: "alien_laberinto",
  tuercas_recolectadas: 0,
  nombre_al_guardar: "mi juego",
  tmp_codigo_xml: "",


  inyectarRedimensionado: function() {

    window.anterior_altura = 0;
    window.anterior_ancho = 0;
    var ancho_canvas = 445;

    function redimensionar() {
      var panel = document.getElementById('panel-derecho');
      var contenedorEditor = document.getElementById('contenedor-editor');
      var panelPilas = document.getElementById('panel-pilas');
      var e = document.getElementById('contenedor-blockly');

      if (!panel) {
        return null;
      }

      var altura = panel.getClientRects()[0].height;
      var ancho_total = contenedorEditor.getClientRects()[0].width;

      if (window.anterior_altura !== altura || window.anterior_ancho !== ancho_total) {

        e.style.width = (ancho_total - ancho_canvas) + 'px';
        e.style.height = (altura - 50) + 'px';
        panelPilas.style.width = (ancho_canvas - 20) + 'px';

        window.anterior_altura = altura;
        window.anterior_ancho = ancho_total;

        Blockly.fireUiEvent(window, 'resize');
      }
    }

    function forzar_redimensionado() {
      window.anterior_altura += 1;
      redimensionar();
    }

    window.onresize = redimensionar;
    window.forzar_redimensionado = forzar_redimensionado;

  }.on('init'),

  'botones-modal-guardar': [
    Ember.Object.create({title: 'Guardar y ver en la galería', clicked: 'guardarEnGaleriaYRedireccionar'}),
    Ember.Object.create({title: 'Guardar y continuar', clicked: 'guardarEnGaleria',  dismiss: 'modal'}),
    Ember.Object.create({title: 'Cerrar', dismiss: 'modal'})
  ],

  actions: {
    guardar: function(codigo_xml) {
      this.set('tmp_codigo_xml', codigo_xml);
      return Bootstrap.ModalManager.show('modal-guardar');
    },

    guardarEnGaleriaYRedireccionar: function() {
      this.send('guardarEnGaleria');
      this.transitionToRoute('galeria');
    },

    guardarEnGaleria: function() {
      var imagen = document.getElementById("canvas");
      var imagen_data = imagen.toDataURL("image/png");

      var juego = this.get('model');

      if (juego) {
        juego.set('nombre', this.get('nombre_al_guardar'));
        juego.set('imagen', imagen_data);
        juego.set('codigo', this.get('tmp_codigo_xml'));
      } else {
        juego = this.store.createRecord('galeria', {
          nombre: this.get('nombre_al_guardar'),
          imagen: imagen_data,
          codigo: this.get('tmp_codigo_xml')
        });
      }

      juego.save();
    },

    reiniciar: function() {
      var controller = this;

      var escenarios = {};
      var nombre_escenario = this.get('nombre_escenario');

      this.set('tuercas_recolectadas', 0);

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
