import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['pilas-canvas'],
  classNameBindings: ['media.isMobile:media-mobile'],
  iframeElement: null,
  challenge: null,
  pilas: service(),

  didInsertElement() {
    this.set("iframeElement", this.element.querySelector('#innerIframe'))
    this.iframeElement.onload = () => { this.loadScene() }
  },

  didUpdate() {
    this.initializeScene()
  },

  willDestroyElement() {
    this.pilas.liberarRecursos();
  },

  sceneConstructor() {
    return this.challenge && this.challenge.escena;
  },

  loadScene() {
    const iframeElement = this.get('iframeElement')
    this.pilas.inicializarPilas(iframeElement, { width: 420, height: 480 }, this.challenge).
      then(() => { this.initializeScene() });

    // onLoad solo se utiliza dentro de la batería de tests. Este
    // componente se tendría que usar mediante el servicio "pilas"
    // en cualquier otro lugar.
    if (this.onLoad)
      this.onLoad({ iframeElement });
  },

  initializeScene() {
    if (this.sceneConstructor()) {
      this.pilas.inicializarEscena(this.get('iframeElement'), this.sceneConstructor());
    } else {
      console.warn("No especificó una escena para cargar en pilas-canvas.");
    }

    /*
     * Invoca a la acción "onReady" que envía el objeto pilas listo
     * para ser utilizado.
     *
     */
    if (this.onReady) {
      this.onReady(this.pilas);
    } else {
      //console.warn("Se a iniciado el componente pilas-canvas sin referencia a la acción onLoad.");
    }
  },
  actions: {
    quitFullscreen() {
      this.set('inFullScreen', false);
    },
    enterFullscreen() {
      this.set('inFullScreen', true);
    }
  }

});
