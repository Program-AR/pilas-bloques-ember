import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['contenedor-pilas-editor'],
  persistirSolucionEnURL: false,
  blocksGallery: service(),
  cargando: true,
  showCode: false,

  modoLecturaSimple: computed('model', function() {
    return this.get('model.grupo.libro.modoLecturaSimple');
  }),

  didInsertElement() {
    this.blocksGallery.start();
  },
  
  actions: {
    onReady(pilas) {
      if (this.onReady)
        this.onReady(pilas)
      this.set('cargando', false);
      if(this.modoLecturaSimple){
        pilas.cambiarAModoDeLecturaSimple();
      }
    }
  }
  
});
