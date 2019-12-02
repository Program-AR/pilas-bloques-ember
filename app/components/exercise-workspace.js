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
  floatingMode: false,

  shouldUseFloatingMode: computed('shouldUseFloatingMode', function () {
    return this.get('floatingMode');
  }),

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

  didRender() {
    //Make the DIV element draggagle:
    let elmnt = document.getElementById("draggable");

    if (elmnt) {
      makeDraggable();
    }

    function makeDraggable() {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

      elmnt.onmousedown = onMouseDown;
      elmnt.ontouchstart = onTouchStart;

      function onMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = onMouseUp;
        // call a function whenever the cursor moves:
        document.onmousemove = onMouseMove;
      }

      function onTouchStart(e) {
        e = e || window.event;
        pos3 = e.touches[0].pageX;
        pos4 = e.touches[0].pageY;

        elmnt.ontouchend = onTouchEnd;
        // call a function whenever the cursor moves:
        elmnt.ontouchmove = onTouchMove;
      }

      function onMouseMove(e) {
        e = e || window.event;
        e.preventDefault();

        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }

      function onTouchMove(e) {
        e = e || window.event;
        e.preventDefault();

        // calculate the new cursor position:
        pos1 = pos3 - e.touches[0].pageX;
        pos2 = pos4 - e.touches[0].pageY;
        pos3 = e.touches[0].pageX;
        pos4 = e.touches[0].pageY;

        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }

      function onMouseUp() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }

      function onTouchEnd() {
        // stop moving when mouse button is released:
        elmnt.ontouchend = null;
        elmnt.ontouchmove = null;
      }

    }
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

    updateFloatingMode() {
      this.set("floatingMode", !this.get("floatingMode"));
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