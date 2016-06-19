import Ember from 'ember';
import listaImagenes from 'pilas-engine-bloques/components/listaImagenes';

export default Ember.Service.extend({
  iframe: null,
  actorCounter: 0,
  pilas: null,
  loading: true,
  nombreDeLaEscenaActual: null,
  temporallyCallback: null, /* almacena el callback para avisar si pilas
                               se reinició correctamente. */

  /*
   * Instancia pilas-engine con los atributos que le envíe
   * el componente x-canvas.
   *
   * Este método realiza una conexión con el servicio pilas, y
   * se llamará automáticamente ante dos eventos: se agrega el
   * componente x-canvas a un template o se ha llamado a `reload`
   * en el servicio pilas.
   */
  inicializarPilas(iframeElement, options) {
    this.set("iframe", iframeElement);
    this.set("loading", true);

    return new Ember.RSVP.Promise((success) => {
      let width = options.width;
      let height = options.height;
      let listaImagenesSerializada = listaImagenes.join("|");

      var code = `
        var canvasElement = document.getElementById('canvas');
        var listaImagenes = "${listaImagenesSerializada}".split("|");
        var opciones = {ancho: ${width},
                        alto: ${height},
                        canvas: canvasElement,
                        data_path: 'libs/data',
                        imagenesExtra: listaImagenes,
                      };

        var pilas = pilasengine.iniciar(opciones);

        pilas;
      `;

      let pilas = iframeElement.contentWindow.eval(code);

      pilas.onready = () => {

        //this.get('actividad').iniciarEscena();
        //var contenedor = document.getElementById('contenedor-blockly');
        //this.get('actividad').iniciarBlockly(contenedor);

        //if (this.get('actividad')['finalizaCargarBlockly']) {
        //  this.get('actividad').finalizaCargarBlockly();
        //}

        success(pilas);

        /*
         * Si el usuario llamó a "reload" desde este servicio, tendría
         * que existir una promesa en curso, así que estas lineas se
         * encargan de satisfacer esa promesa llamando al callback success.
         */
        if (this.get("temporallyCallback")) {
          this.get("temporallyCallback")(pilas);
          this.set("temporallyCallback", null);
        }

        this.set("loading", false);
      };

      pilas.ejecutar();

    });
  },


  inicializarEscena(iframeElement, nombreDeLaEscena) {
    let codigo = `
      var escena = new ${nombreDeLaEscena}();
      pilas.mundo.gestor_escenas.cambiar_escena(escena);
    `;

    iframeElement.contentWindow.eval(codigo);
    this.set("nombreDeLaEscenaActual", nombreDeLaEscena);
  },


  ejecutarCodigo(codigo) {
    this.reiniciar().then(() => {
      let iframeElement = this.get("iframe");
      iframeElement.contentWindow.eval(codigo);
    });
  },

  estaResueltoElProblema() {
    let iframeElement = this.get("iframe");
    let codigo = `
      pilas.escena_actual().estaResueltoElProblema();
    `;

    return iframeElement.contentWindow.eval(codigo);
  },


  ejecutarCodigoSinReiniciar(codigo) {
    //console.log(codigo.split('\n'));
    //console.log("Ejecutando codigo", {codigo});

    if (this.get("loading")) {
      console.warn("Cuidado, no se puede ejecutar antes de que pilas cargue.");
      return;
    }

    let iframeElement = this.get("iframe");

    // reinicia la escena nuevamente
    this.reiniciarEscenaCompleta();

    iframeElement.contentWindow.eval(codigo);
  },

  obtenerCapturaDePantalla() {
    let iframeElement = this.get("iframe");
    return iframeElement.contentWindow.document.getElementById('canvas').toDataURL('image/png');
  },

  reiniciarEscenaCompleta() {
    let iframeElement = this.get("iframe");
    iframeElement.contentWindow.eval("pilas.reiniciar();");
    this.inicializarEscena(iframeElement, this.get("nombreDeLaEscenaActual"));
  },

  /**
   * Permite reiniciar pilas por completo.
   *
   * La acción de reinicio se realiza re-cargando el iframe
   * que contiene a pilas, así que se va a volver a llamar al
   * método `instantiatePilas` automáticamente.
   *
   * Este método retorna una promesa, que se cumple cuando pilas se
   * halla cargado completamente.
   */
  reiniciar() {
    return new Ember.RSVP.Promise((success) => {
      if (this.get("loading")) {
        console.warn("Cuidado, se está reiniciando en medio de la carga.");
      }

      this.set("loading", true);
      this.get("iframe").contentWindow.location.reload(true);

      /* Guarda el callback  para que se llame luego de la carga de pilas. */
      this.set("temporallyCallback", success);
    });
  },

});
