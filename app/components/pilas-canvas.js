import Ember from 'ember';


export default Ember.Component.extend({
  actividad: null,

  iniciarPilas: function() {
    var canvas_element = this.$().find('canvas')[0];

    window.pilas = pilasengine.iniciar({ancho: 420, alto: 480, canvas: canvas_element, data_path: 'libs/data'});

    window.pilas.onready = function() {
      this.get('actividad').iniciarEscena();

      var contenedor = document.getElementById('contenedor-blockly');
      this.get('actividad').iniciarBlockly(contenedor);
    }.bind(this);

    window.pilas.ejecutar();

  }.on('didInsertElement'),

});
