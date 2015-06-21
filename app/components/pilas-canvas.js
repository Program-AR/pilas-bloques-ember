import Ember from 'ember';


export default Ember.Component.extend({
  actividad: null,

  iniciarPilas: function() {
    var canvas_element = this.$().find('canvas')[0];

    window.pilas = pilasengine.iniciar({
      ancho: 420,
      alto: 480,
      canvas: canvas_element,
      data_path: 'libs/data',
      
      imagenesExtra: [
                'fondos.estrellas.png',
                'fondos.obrero.png',
                'fondos.nubes.png',
                'casillaLightbot.png',
                'perro_cohete.png',
                'hueso.png',
                'mock_llave.png',
                'mock_caballero.png',
                'mock_cofre.png',
                'mock_heroe.png',
                'mock_mago.png',
                'mock_unicornio.png',
                'casillaArriba.png',
                'casillaAbajo.png',
                'casillaDerecha.png',
                'casillaIzquierda.png',
                'banana.png',
                'manzana.png',
                'casilla_base.png',
                'robot.png',
                'casilla_con_luz.png',
                'invisible.png',
                'sin_imagen.png',
                'maria.png',
                'sandia.png',
                'compu_animada.png',
                'globoAnimado.png',
                'cangrejo.png',
                'buzo.png',
                'fondos.mar.png',
                'pez1.png',
                'pez2.png',
                'pez3.png',
                'alimento_pez.png',
                'ratonAnimado.png',
                'quesoAnimado.png',
                'naveAnimada.png',
                'robotAnimado.png',
                'pelotaAnimada.png',
                'fondos.biblioteca.png',
                'fondos.reparandoLaNave.png',
                'casilla.reparandoNave.png',
                'marcianoVerdeAnimado.png',
                'carbon_animado.png',
                'hierro_animado.png',
                ]
      });

    window.pilas.onready = function() {
      this.get('actividad').iniciarEscena();

      var contenedor = document.getElementById('contenedor-blockly');
      this.get('actividad').iniciarBlockly(contenedor);
    }.bind(this);

    window.pilas.ejecutar();

  }.on('didInsertElement'),

});
