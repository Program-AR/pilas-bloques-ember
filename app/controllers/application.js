import Ember from 'ember';

var Bootstrap = window.Bootstrap;

export default Ember.Controller.extend({
  inyectarRedimensionado: function() {



    window.anterior_altura = 0;

    function redimensionar() {
      var panel = document.getElementById('panel-derecho');

      if (!panel)
      return;

      var altura = panel.getClientRects()[0].height;

      if (window.anterior_altura != altura) {
        var e = document.getElementById('contenedor-blockly');
        e.style.height = (altura - 50) + 'px';
        window.anterior_altura = altura;
        Blockly.fireUiEvent(window, 'resize');
      }
    }

    function forzar_redimensionado() {
      window.anterior_altura += 1;
      redimensionar();
    }

    window.onresize = redimensionar;





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
