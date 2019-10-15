import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['exercise-workspace'],
  persistirSolucionEnURL: false,
  showCode: false,
  blocksGallery: service(),
  cargando: true,
  modoTuboHabilitado: false,

  debeMostrarPasoHabilitado: computed('debeMostrarPasoHabilitado', function () {
    return this.get('model.debugging');
  }),

  estaPausadoEnUnBreackpoint: computed('pausadoEnBreakpoint', function () {
    return this.get('pausadoEnBreakpoint');
  }),

  modoLecturaSimple: computed('model', function () {
    return this.get('model.grupo.capitulo.libro.modoLecturaSimple');
  }),

  debeMostarReiniciar: computed('ejecutando', 'terminoDeEjecutar', function () {
    return this.ejecutando || this.terminoDeEjecutar;
  }),

  didInsertElement() {
    this.blocksGallery.start();
  },

  setPilasBlockly(pilasBlockly) {
    this.set('pilasBlockly', pilasBlockly);
  },

  actions: {

    onReady(pilas) {
      if (this.onReady) {
        this.onReady(pilas)
      }
      this.set('cargando', false);
      if (this.modoLecturaSimple) {
        pilas.cambiarAModoDeLecturaSimple();
      }

    },

    updateTurboMode() {
      if (!this.modoTuboHabilitado) {
        this.pilas.habilitarModoTurbo();
      } 
      else {
        this.pilas.deshabilitarModoTurbo();
      }
      this.set("needShowToast", true);
    },

    ejecutar(pasoAPaso = false) {
      this.pilasBlockly.send('ejecutar', pasoAPaso);
    },

    step() {
      this.pilasBlockly.send('step');
    },

    reiniciar() {
      this.pilasBlockly.send('reiniciar');
    },

  }

});
