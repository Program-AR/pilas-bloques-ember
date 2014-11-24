import Ember from 'ember';

export default Ember.Component.extend({
  iniciarPilas: function() {
    var canvas_element = this.$().find('canvas')[0];

    pilas = new Pilas();
    pilas.iniciar({ancho: 320, alto: 240, canvas: canvas_element, data_path: 'libs/data'});

    pilas.onready = function() {
      this.sendAction('onready');
    }.bind(this);

    pilas.ejecutar();

  }.on('didInsertElement'),

});
