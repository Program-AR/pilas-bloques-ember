import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pilas-automatic-update'],
  version: Ember.inject.service(),
  mostrarLinkActualizacion: false,

  didInsertElement() {

    this.get('version').obtener_estado_de_version().then((data) => {
      var comparacion = data.comparacion;

      if (comparacion === 1) {
        this.set("mostrarLinkActualizacion", true);
      }

    });

  },

  actions: {
    verSitioActualizacion() {
      var gui = window.requireNode('nw.gui');
      gui.Shell.openExternal("http://hugoruscitti.github.io/huayra-tips/#/actualizar/pilas-engine-bloques");
    }
  }
});
