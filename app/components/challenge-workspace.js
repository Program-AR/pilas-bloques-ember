import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['exercise-workspace'],
  persistirSolucionEnURL: false,
  showCode: false,
  blocksGallery: service(),
  cargando: true,
  canvasWidth: 0,
  canvasHeight: 0,

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
    return this.get('ejecutando') || this.get('terminoDeEjecutar');
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

    hideScene() {
      let canvas = document.getElementsByClassName("pilas-canvas")[0];
      let elmnt = document.getElementById("draggable");
      elmnt.style.display = 'none';
      canvas.style.display = 'none';
    },

    showScene() {
      let canvas = document.getElementsByClassName("pilas-canvas")[0];
      let elmnt = document.getElementById("draggable");
      elmnt.style.display = 'block';
      canvas.style.display = 'block';
    },

    changeScreenMode() {
      this.set("shouldUseFloatingMode", !this.get("shouldUseFloatingMode"));
      this.send("updateBlockyWorkspaceBounds");

      if (this.get("shouldUseFloatingMode")) {
        this.send("makeDraggable");
        this.send("hideScene");
      }

      else {
        this.send("showScene");
        this.send("makeNotDraggable");
      }

    },

    makeDraggable() {
      let elmnt = document.getElementById("draggable");
      let canvas = document.getElementsByClassName("pilas-canvas")[0];
      let exerciseCard = document.getElementsByClassName("exercise-card")[0];
      let blocklyFlyout = document.getElementsByClassName("blocklyFlyout")[0];

      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

      canvas.style.height = 240 + "px";
      canvas.style.width = 210 + "px";
      exerciseCard.style.height = 240 + "px";
      exerciseCard.style.width = 210 + "px";

      elmnt.style.top = (blocklyFlyout.height.baseVal.value - 50) + "px";
      elmnt.style.left = (blocklyFlyout.width.baseVal.value + 25) + "px";
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

    ejecutar(pasoAPaso = false) {
      this.pilasBlockly.send('ejecutar', pasoAPaso);
      this.send("showScene");
    },

    step() {
      this.pilasBlockly.send('step');
      this.send("showScene");
    },

    reiniciar() {
      this.pilasBlockly.send('reiniciar');
    },

  }

});
