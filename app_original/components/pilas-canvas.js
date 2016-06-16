import Ember from 'ember';
import listaImagenes from 'pilas-engine-bloques/components/listaImagenes';

export default Ember.Component.extend({
  actividad: null,

  iniciarPilas: Ember.on('didInsertElement', function() {
    var canvas_element = this.$().find('canvas')[0];

    window.pilas = pilasengine.iniciar({
      ancho: 420,
      alto: 480,
      canvas: canvas_element,
      data_path: 'libs/data',
      imagenesExtra: listaImagenes,
      });

    window.pilas.onready = function() {

      this.get('actividad').iniciarEscena();
      var contenedor = document.getElementById('contenedor-blockly');
      this.get('actividad').iniciarBlockly(contenedor);

      if (this.get('actividad')['finalizaCargarBlockly']) {
        this.get('actividad').finalizaCargarBlockly();
      }

    }.bind(this);

    window.pilas.ejecutar();

  }),

  willDestroyElement(){
    window.pilas.reiniciar();
  },

});
