import Ember from 'ember';

export default Ember.Controller.extend({
  url: '',
  queryParams: ['layout'],
  layout: true,
  environment: Ember.inject.service(),

  mostrar_url: Ember.on('init', function() {
    this.set('layout', this.get('environment').get('showLayout'));
  }),

  actions: {
    mostrar_devtools() {
      window.requireNode('nw.gui').Window.get().showDevTools();
    },
    actualizar() {
      location.reload(true);
    },
    redimensionar() {
      alert("tengo que redimensionar!");
    },

    abrirPreferencias() {
      this.set('mostrarDialogoOpciones', true);
    },

    abrirAyuda() {
      this.set('mostrarDialogoAyuda', true);
    },

    ocultar_boton_codigo() {
      this.set('environment.debeMostrarBotonCodigoXML', false);
    },

    mostrar_boton_codigo() {
      this.set('environment.debeMostrarBotonCodigoXML', true);
    },

    ocultarModals() {
      this.set('mostrarDialogoAyuda', false);
      this.set('mostrarDialogoOpciones', false);
    }
  }

});
