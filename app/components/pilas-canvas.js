import Ember from 'ember';

var pilasengine = window.pilasengine;

export default Ember.Component.extend({
  iniciarPilas: function() {
    var canvas_element = this.$().find('canvas')[0];

    var pilas = pilasengine.iniciar({ancho: 420, alto: 480, canvas: canvas_element, data_path: 'libs/data'});

    pilas.onready = function() {
      this.sendAction('onready');
    }.bind(this);

    pilas.ejecutar();

  }.on('didInsertElement'),

});
