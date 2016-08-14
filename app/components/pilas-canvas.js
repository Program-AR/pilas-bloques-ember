import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pilas-canvas-container'],
  classNameBindings: ['media.isMobile:media-mobile'],
  iframeElement: null,
  escena: null,
  pilas: Ember.inject.service(), /* Se espera que este atributo se defina al
                                    llamar al componente. Está como servicio
                                    aquí porque los tests lo necesitan así. */

  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', this, this.initElement);
  },

  willDestroyElement() {
    this.get("pilas").liberarRecursos();
  },

  initElement() {
    let iframeElement = this.$().find('#innerIframe')[0];

    this.set("iframeElement", iframeElement);

    this.get("iframeElement").onload = () => {

      if (this.get('pilas')) {
        this.get("pilas").inicializarPilas(iframeElement, {width: 420, height: 480}).
          then((pilas) => {

            if (this.get('escena')) {
              this.get("pilas").inicializarEscena(iframeElement, this.get("escena"));
            } else {
              console.warn("No especificó una escena para cargar en pilas-canvas.");
            }

            /*
             * Invoca a la acción "onReady" que envía el objeto pilas listo
             * para ser utilizado.
             *
             */
            if (this.get('onReady')) {
              this.sendAction("onReady", pilas);
            } else {
              //console.warn("Se a iniciado el componente pilas-canvas sin referencia a la acción onLoad.");
            }
          });
      } else {
        console.warn("No has enviado el objeto pilas.");
      }

      // onLoad solo se utiliza dentro de la batería de tests. Este
      // componente se tendría que usar mediante el servicio "pilas"
      // en cualquier otro lugar.
      this.sendAction('onLoad', {iframeElement});

    };

  },

  reloadIframe(onLoadFunction) {
    this.get("iframeElement").onload = onLoadFunction;
    this.get("iframeElement").contentWindow.location.reload(true);
  },

  actions: {
    execute(code) {
      this.reloadIframe(() => {
        alert("Ha cargado el código y está todo listo!");
        this.get("iframeElement").contentWindow.eval(code);
      });
    },
    clear() {
      this.reloadIframe();
    },
    quitFullscreen() {
      this.set('inFullScreen', false);
    },
    enterFullscreen() {
      this.set('inFullScreen', true);
    }
  }

});
