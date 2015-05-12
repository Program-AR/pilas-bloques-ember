import Ember from 'ember';
//import Actividades from '../actividades';

export default Ember.Controller.extend({
  //actividad: Actividades.Alien,
  nombre_al_guardar: 'mi actividad',
  tmp_codigo_xml: '',

  debeGuardar: function() {
    var codigo_xml = this.get('actividad').obtener_codigo_en_texto();
    return codigo_xml !== this.get('tmp_codigo_xml');
  },

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
    registrarPrimerCodigo: function() {
      var codigo_xml = this.get('actividad').obtener_codigo_en_texto();
      this.set('tmp_codigo_xml', codigo_xml);
      if(this.get('model')) {
        this.set('nombre_al_guardar', this.get('model').get('nombre'));
      }
    },

    guardar: function() {
      var codigo_xml = this.get('actividad').obtener_codigo_en_texto();
      this.set('tmp_codigo_xml', codigo_xml);
      return Bootstrap.ModalManager.show('modal-guardar');
    },

    guardarEnGaleriaYRedireccionar: function() {
      this.send('guardarEnGaleria');
      this.transitionToRoute('galeria');
    },

    guardarEnGaleria: function() {
      //alert("test");
      var imagen = document.getElementById('canvas');
      var imagen_data = imagen.toDataURL('image/png');

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
      this.get('actividad').iniciarEscena();
    }
  }
});
