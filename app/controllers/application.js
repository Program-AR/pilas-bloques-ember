import Ember from 'ember';

var Bootstrap = window.Bootstrap;
var Blockly = window.Blockly;

export default Ember.Controller.extend({
  inyectarRedimensionado: function() {

    window.anterior_altura = 0;
    window.anterior_ancho = 0;
    var ancho_canvas = 400;

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

    window.onresize = forzar_redimensionado;
    window.forzar_redimensionado = forzar_redimensionado;

  }.on('init'),

    myModalButtons: [
        Ember.Object.create({title: 'Cerrar', dismiss: 'modal'})
    ],

    actions: {
      show: function() {
        return Bootstrap.ModalManager.show('myModal');
      },
      mostrar_devtools: function() {
        require('nw.gui').Window.get().showDevTools();
      },
      actualizar: function() {
        location.reload(true);
      },
      redimensionar: function() {
        alert("tengo que redimensionar!");
      }
    }

});
