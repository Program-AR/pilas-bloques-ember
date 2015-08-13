import Ember from 'ember';


export default Ember.Controller.extend({
  url: '',
  queryParams: ['layout'],
  layout: true,
  environment: Ember.inject.service(),

  mostrar_url: Ember.on('init', function() {
    this.set('layout', this.get('environment').get('showLayout'));
  }),

    myModalButtons: [
        Ember.Object.create({title: 'Cerrar', dismiss: 'modal'})
    ],

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
      }
    }

});
