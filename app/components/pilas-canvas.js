import Ember from 'ember';


export default Ember.Component.extend({
  actividad: null,

  iniciarPilas: Ember.on('didInsertElement', function() {
    var canvas_element = this.$().find('canvas')[0];

    window.pilas = pilasengine.iniciar({
      ancho: 420,
      alto: 480,
      canvas: canvas_element,
      data_path: 'libs/data',

      imagenesExtra: [
                /*--------FONDOS---------*/
                'fondos.estrellas.png',
                'fondos.obrero.png',
                'fondos.nubes.png',
                'fondo.superTito1.png',
                'fondo.superTito2.png',
                'fondo.elPlanetaDeNano.png',
                'fondos.elPlanetaDeNano.png',
                'fondos.alien-inicial.png',
                'fondos.futbolRobots.png',
                'fondos.biblioteca.png',
                'fondos.reparandoLaNave.png',
                'fondos.selva.png',
                'fondo.recolector.png',
                'fondo.gatoEnLaCalle.png',
                'fondo.noMeCansoDeSaltar.png',
                'fondo.elMarcianoEnElDesierto.png',
                'fondo.mariaSandia.png',
                'fondo.alimentando_peces.png.png',
                /*--------CASILLAS---------*/
                'casillaArriba.png',
                'casillaAbajo.png',
                'recolectorAnimado.png',
                'casillaDerecha.png',
                'casillaIzquierda.png',
                'casilla.titoFinalizacion.png',
                'casilla_base.png',
                'lamparin.png',
                'casillas.violeta.png',
                'casilla.futbolRobots1.png',
                'casilla.futbolRobots2.png',
                'casillas.elPlanetaDeNano.png',
                'casilla.reparandoNave.png',
                'casilla.grisoscuro.png',
                'casillas.alien_inicial.png',
                'casilla.mariaSandia.png',
                'casillafinalmono.png',
                'casillainiciomono.png',
                'casillamediomono.png',
                'casilla.cangrejo_aguafiestas.png',

                /*--------ACTORES---------*/
                'perro_cohete.png',
                'hueso.png',
                'llave.png',
                'caballero_oscuro.png',
                'heroe.png',
                'mago.png',
                'unicornio.png',
                'banana.png',
                'nano.png',
                'tito.png',
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
                'buzo.png',

                'pez2.png',
                'pez3.png',
                'alimento_pez.png',
                'ratonAnimado.png',
                'estrellaAnimada.png',
                'quesoAnimado.png',
                'naveAnimada.png',
                'robotAnimado.png',
                'manzana.png',
                'pelotaAnimada.png',
                'marcianoVerdeAnimado.png',
                'carbon_animado.png',
                'hierro_animado.png',
                'monoAnimado.png',
                'banana-1.png',
                'manzana-v2.png',
                'botonAnimado.png',
                'camino-alien-boton.png',
                'compu_animada.png',
                'gatoAnimado.png',
                'marcianoAnimado.png',
                'pez1.png',
                'pez2.png',
                'pez3.png',
                'instalador.png',
                'placacontar.png',

                /*--------ICONOS---------*/
                'iconos.botonRojo.png',
                'icono.abrirOjos.png',
                'icono.cerrarOjos.png',
                'icono.pararse.png',
                'icono.acostarse.png',
                'icono.saludar.png',
                'icono.sandia.png',
                'icono.alimento_pez.png',
                'icono.computadora.png',


                ]
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

});
