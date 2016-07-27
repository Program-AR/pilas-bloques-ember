import Ember from 'ember';
import listaImagenes from 'pilas-engine-bloques/components/listaImagenes';

/**
 * Provee acceso a pilasweb y sus eventos.
 *
 * @public
 * @module PilasService
 */

/**
 * Un servicio que provee métodos y eventos para comunicarse
 * con pilasweb y el componente pilas-canvas.
 * DEMO.
 *
 * Estos son los eventos que puede reportar el servicio:
 *
 * - terminaEjecucion
 * - terminaCargaInicial
 * - errorDeActividad
 *
 * @public
 * @class PilasService
 */
export default Ember.Service.extend(Ember.Evented, {
  iframe: null,
  actorCounter: 0,
  pilas: null,
  loading: true,
  nombreDeLaEscenaActual: null,
  temporallyCallback: null, /* almacena el callback para avisar si pilas
                               se reinició correctamente. */

  /**
   * Instancia pilas-engine con los atributos que le envíe
   * el componente x-canvas.
   *
   * Este método realiza una conexión con el servicio pilas, y
   * se llamará automáticamente ante dos eventos: se agrega el
   * componente x-canvas a un template o se ha llamado a `reload`
   * en el servicio pilas.
   *
   * @public
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


      this.conectarEventos();

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

  /**
   * Libera los eventos y recursos instanciados por este servicio.
   *
   * @method liberarRecursos
   * @public
   */
  liberarRecursos() {
    this.desconectarEventos();
  },

  /**
   * Captura cualquier mensaje desde el iframe y lo propaga
   * como un evento de ember evented.
   *
   * Los eventos que se originan en el iframe tienen la forma:
   *
   *     {
   *       tipo: "tipoDeMensaje"    # Cualquiera de los listados más arriba.
   *       detalle: [...]           # string con detalles para ese evento.
   *     }
   *
   * Sin embargo esta función separa esa estructura para que sea más
   * sencillo capturarla dentro de ember.
   *
   * Por ejemplo, si queremos capturar un error (como hace la batería de tests),
   * podemos escribir:
   *
   *     pilas.on('errorDeActividad', function(motivoDelError) {
   *       // etc...
   *     });
   *
   * @method contectarEventos
   * @private
   *
   */
  conectarEventos() {
    $(window).on("message.fromIframe", (e) => {
      let datos = e.originalEvent.data;
      this.trigger(datos.tipo, datos.detalle);
    });
  },

  /**
   * Se llama automáticamente para desconectar los eventos del servicio.
   *
   * @method desconectarEventos
   * @private
   */
  desconectarEventos() {
    $(window).off("message.fromIframe");
  },

  inicializarEscena(iframeElement, nombreDeLaEscena) {
    let codigo = `
      var escena = new ${nombreDeLaEscena}();
      pilas.mundo.gestor_escenas.cambiar_escena(escena);
    `;

    this.evaluar(codigo);
    this.set("nombreDeLaEscenaActual", nombreDeLaEscena);
  },

  /**
   * Evalúa código reiniciando completamente la biblioteca.
   *
   * @method ejecutarCodigo
   * @public
   */
  ejecutarCodigo(codigo) {
    this.reiniciar().then(() => {
      let iframeElement = this.get("iframe");
      iframeElement.contentWindow.eval(codigo);
    });
  },

  /**
   * Retorna true si el problema está resuelto.
   *
   * @method estaResueltoElProblema
   * @public
   */
  estaResueltoElProblema() {
    return this.evaluar(`pilas.escena_actual().estaResueltoElProblema();`);
  },



  /**
   * Ejecuta el código reiniciando la escena rápidamente.
   *
   * @method ejecutarCodigoSinReiniciar
   * @public
   *
   * @todo convertir en método privado.
   */
  ejecutarCodigoSinReiniciar(codigo) {

    if (this.get("loading")) {
      console.warn("Cuidado, no se puede ejecutar antes de que pilas cargue.");
      return;
    }

    let iframeElement = this.get("iframe");

    this.reiniciarEscenaCompleta();

    iframeElement.contentWindow.eval(codigo);
  },

  /**
   * Retorna una captura de pantalla de la escena en formato png/base64
   *
   * @method obtenerCapturaDePantalla
   * @public
   */
  obtenerCapturaDePantalla() {
    let iframeElement = this.get("iframe");
    return iframeElement.contentWindow.document.getElementById('canvas').toDataURL('image/png');
  },

  /**
   * Realiza un reinicio rápido de la escena actual.
   *
   * @method reiniciarEscenaCompleta
   * @private
   */
  reiniciarEscenaCompleta() {
    let iframeElement = this.get("iframe");
    iframeElement.contentWindow.eval("pilas.reiniciar();");
    this.inicializarEscena(iframeElement, this.get("nombreDeLaEscenaActual"));
  },

  /**
   * Modifica la velocidad de las animaciones y la simulación.
   *
   * Este método es particularmente útil para ejecutar los tests de integración
   * super rápido.
   *
   * Por omisión pilas utiliza un temporizador a 60 FPS.
   *
   * @method cambiarFPS
   * @public
   *
   */
  cambiarFPS(fps) {
    this.evaluar(`createjs.Ticker.setFPS(${fps});`);
  },

  /**
   * Permite reiniciar pilas por completo.
   *
   * La acción de reinicio se realiza re-cargando el iframe
   * que contiene a pilas, así que se va a volver a llamar al
   * método `instanciarPilas` automáticamente.
   *
   * Este método retorna una promesa, que se cumple cuando pilas se
   * halla cargado completamente.
   *
   * @method reiniciar
   * @private
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

  /**
   * Retorna la cantidad de actores en la escena con la etiqueta solicitada.
   *
   * @method contarActoresConEtiqueta
   * @public
   */
  contarActoresConEtiqueta(etiqueta) {
    let codigo = `
      var actoresEnLaEscena = pilas.escena_actual().actores;

      var actoresConLaEtiqueta = actoresEnLaEscena.filter(function(actor) {
        return actor.tiene_etiqueta("${etiqueta}");
      });

      actoresConLaEtiqueta.length;
    `;

    return this.evaluar(codigo);
  },

  /**
   * Evalúa código directamente, sin reiniciar de ninguna forma.
   *
   * @method evaluar
   * @public
   */
  evaluar(codigo) {
    let iframeElement = this.get("iframe");
    return iframeElement.contentWindow.eval(codigo);
  }

});
