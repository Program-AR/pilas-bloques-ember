import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { asyncActionCall } from '../utils/actions'
import { later } from '@ember/runloop';

export default Component.extend({
  classNames: ['exercise-workspace'],
  showCode: false,
  blocksGallery: service(),
  pilasBloquesApi: service(),
  cargando: true,
  canvasWidth: 0,
  canvasHeight: 0,
  simpleRead: service(),
  areExpectationsRunning: false,
  pilasBloquesAnalytics: service(),

  debeMostrarPasoHabilitado: computed('model.debugging', function () {
    return this.get('model.debugging');
  }),

  estaPausadoEnUnBreackpoint: computed('pausadoEnBreakpoint', function () {
    return this.get('pausadoEnBreakpoint');
  }),

  debeMostarReiniciar: computed('ejecutando', 'terminoDeEjecutar', function () {
    return this.get('ejecutando') || this.get('terminoDeEjecutar');
  }),

  didInsertElement() {
    this.blocksGallery.start();
    this.pilasBloquesAnalytics.setUsesFullScreenMode(false)
  },

  setPilasBlockly(pilasBlockly) {
    this.set('pilasBlockly', pilasBlockly);
  },

  shouldShowSimpleRead() {
    return this.simpleRead.shouldShowSimpleRead(this.get('model.grupo.capitulo.libro.modoLecturaSimple'))
  },

  setShouldUseFloatingMode(shouldUseIt) {
    this.pilasBloquesAnalytics.setUsesFullScreenMode(shouldUseIt)
    this.set("shouldUseFloatingMode", shouldUseIt)
  },

  actions: {

    onSceneReady(pilas) {
      if (this.onReady) {
        this.onReady(pilas)
      }
      this.set('cargando', false);

      if (this.shouldShowSimpleRead()) {
        pilas.cambiarAModoDeLecturaSimple();
      }

      this.pilasBloquesApi.openChallenge(this.model.id)
    },

    hideScene() {
      let canvas = document.getElementsByClassName("pilas-canvas")[0];
      let elmnt = document.getElementById("draggable");
      elmnt.style.visibility = 'hidden';
      canvas.style.visibility = 'hidden';
    },

    showScene() {
      let canvas = document.getElementsByClassName("pilas-canvas")[0];
      let elmnt = document.getElementById("draggable");
      elmnt.style.visibility = 'visible';
      canvas.style.visibility = 'visible';
    },

    changeScreenMode() {
      this.setShouldUseFloatingMode(!this.get("shouldUseFloatingMode"));
      this.send("updateBlockyWorkspaceBounds");

      this.send("showScene");
      if (this.get("shouldUseFloatingMode"))
        this.send("makeDraggable");
      else
        this.send("makeNotDraggable");

    },

    makeDraggable() {
      let elmnt = document.getElementById("draggable");
      let canvas = document.getElementsByClassName("pilas-canvas")[0];
      let exerciseCard = document.getElementsByClassName("exercise-card")[0];
      let pilasBlockly = document.getElementsByClassName("pilas-blockly")[0].getBoundingClientRect();

      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

      const miniature = { height: 240, width: 210 }

      canvas.style.height = miniature.height + "px";
      canvas.style.width = miniature.width + "px";
      exerciseCard.style.height = miniature.height + "px";
      exerciseCard.style.width = miniature.width + "px";

      elmnt.style.top = (pilasBlockly.bottom - miniature.height) + "px";
      elmnt.style.left = (pilasBlockly.left + 15) + "px";
      elmnt.style.position = "fixed";

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

    },

    makeNotDraggable() {
      let elmnt = document.getElementById("draggable");
      let canvas = document.getElementsByClassName("pilas-canvas")[0];
      let exerciseCard = document.getElementsByClassName("exercise-card")[0];
      elmnt.style.position = "inherit";
      canvas.style.width = "";
      canvas.style.height = "";
      exerciseCard.style.width = "";
      exerciseCard.style.height = "";
    },

    updateBlockyWorkspaceBounds() {
      // This make blocky workspaces render correctly after container resize.
      // This is a WORKAROUND, i cant get it work without this.
      Blockly.mainWorkspace.getAllBlocks()[0].select()
      Blockly.mainWorkspace.getAllBlocks()[0].unselect()
    },

    async ejecutar(pasoAPaso = false) {
      this.set('areExpectationsRunning', true)
      later(this, async function () {
        await asyncActionCall(this.pilasBlockly, 'ejecutar', pasoAPaso)
        this.set('areExpectationsRunning', false)
        this.send("showScene");
      }, 50)
    },

    step() {
      this.pilasBlockly.send('step');
      this.send("showScene");
    },

    async reiniciar() {
      await asyncActionCall(this.pilasBlockly, 'reiniciar')
    },

  }

});
