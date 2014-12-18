import Ember from 'ember';


export default Ember.Component.extend({
  iniciarPilas: function() {
    var canvas_element = this.$().find('canvas')[0];

    window.pilas = pilasengine.iniciar({ancho: 420, alto: 480, canvas: canvas_element, data_path: 'libs/data'});

    window.pilas.onready = function() {
      this.sendAction('onready');
    }.bind(this);

    window.pilas.ejecutar();

  }.on('didInsertElement'),

});
