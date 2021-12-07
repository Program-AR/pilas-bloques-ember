import Evented from '@ember/object/evented';
import Service from '@ember/service';
import listaImagenes from 'pilasbloques/components/listaImagenes';


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
 * - terminaCargaInicial
 * - errorDeActividad
 *
 * @public
 * @class PilasService
 */
export default Service.extend(Evented, {
  iframe: null,
  size: null,
  loading: true,
  currentChallenge: null,

  /**
   * Instantiates and runs pilas-engine (pilasweb) main framework.
   * Preloads needed challenge's images (TODO: decouple image preloading from fwk initialization).
   * Sets up messaging events from iframe.
   * NOTE: Doesn't load scene. For that you need to call setChallenge afterwards.
   * @param iframeElement is the iframe DOM where pilasengine will run.
   * @param size is the width and height in pixels of the main scene.
   * @param challenge is the Challenge object from which scene's images will be taken.
   */
  loadPilas(iframeElement, size, challenge) {
    this.set("iframe", iframeElement);
    this.set("size", size);
    this.set("currentChallenge", challenge)
    this.set("loading", true);
    this.conectarEventos();

    return new Promise((success) => {
      // Cuidado: esto hace que no se pueda cargar una escena diferente en esta instancia de pilas.
      // La razón es que se le pregunta a la escena qué imágenes precargar.
      let listaImagenesSerializada = this.imagenesParaPrecargar(challenge).join("|");

      let pilasweb = this.evaluar(`
        var canvasElement = document.getElementById('canvas');
        var listaImagenes = "${listaImagenesSerializada}".split("|");
        var opciones = {ancho: ${size.width},
                        alto: ${size.height},
                        canvas: canvasElement,
                        data_path: 'libs/data',
                        imagenesExtra: listaImagenes,
                        cargar_imagenes_estandar: false,
                        silenciar_advertencia_de_multiples_ejecutar: true
                      };

        var pilas = pilasengine.iniciar(opciones);

        pilas;
      `)
      pilasweb.onready = () => {
        success();
        this.set("loading", false);
      };
      pilasweb.ejecutar()
      pilasweb.setFPS(100)
    });
  },

  async reloadPilas(challenge){
    await this.loadPilas(this.iframe, this.size, challenge)
  },

  imagenesParaPrecargar(challenge) {
    //Le pregunto a la escena qué imágenes va a necesitar
    var imagenes = this.evaluar(`${this.nombreDeEscena(challenge.escena)}.imagenesPreCarga()`);
    //Si la escena no las sabe, cargo todas:
    imagenes = imagenes.length ? imagenes : listaImagenes

    if (challenge.imagesToPreload) imagenes = imagenes.concat(challenge.imagesToPreload)

    return imagenes;
  },

  nombreDeEscena(nombreOInicializadorDeEscena) {
    if (nombreOInicializadorDeEscena.indexOf('new') === -1) {
      // Significa que vino el nombre.
      return nombreOInicializadorDeEscena;
    } else {
      // Significa que hay una construcción en el string.
      // La expresión regular captura el nombre de la clase (\w+)
      // y el [1] accede al primer grupo de captura.
      return nombreOInicializadorDeEscena.match(/new\s+(\w+)\s*\(/)[1];
    }
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

  desconectarEventos() {
    $(window).off("message.fromIframe");
  },

  async setChallenge(challenge) {
    if(!challenge || !challenge.escena) throw "Scene missing in challenge"
    if(this.get('challenge') != challenge) await this.reloadPilas(challenge)
    this.evaluar(`pilas.mundo.gestor_escenas.cambiar_escena(${this.sceneInitializer()})`)
  },

  sceneInitializer(){
    var initializer = this.get('currentChallenge').escena;
    if (initializer.indexOf('new') === -1) {
      // Means scene is just a class name
      initializer = `new ${initializer}()`;
    }
    return initializer
  },

  estaResueltoElProblema() {
    return this.evaluar(`pilas.escena_actual().estaResueltoElProblema();`);
  },

  /**
   * Retorna una captura de pantalla de la escena en formato png/base64
   *
   * @method obtenerCapturaDePantalla
   * @public
   */
  obtenerCapturaDePantalla() {
    let iframeElement = this.iframe;
    return iframeElement.contentWindow.document.getElementById('canvas').toDataURL('image/png');
  },

  /**
   * Realiza un reinicio rápido de la escena actual.
   *
   * @method reiniciarEscenaCompleta
   * @private
   */
  async reiniciarEscenaCompleta() {
    this.evaluar("pilas.reiniciar();");
    await this.setChallenge(this.currentChallenge);
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

  cambiarAModoDeLecturaSimple() {
    this.evaluar('pilas.cambiarAModoDeLecturaSimple()');
  },

  cambiarAModoDeLecturaNormal() {
    this.evaluar('pilas.cambiarAModoDeLecturaNormal()');
  },

  /**
   * Evalúa código directamente, sin reiniciar de ninguna forma.
   *
   * @method evaluar
   * @public
   */
  evaluar(codigo) {
    return this.iframe.contentWindow.eval(codigo);
  },

  habilitarModoTurbo() {
    this.evaluar('ComportamientoConVelocidad').modoTurbo = true;
    this.evaluar('pilas').ponerVelocidadMaxima();
  },

  deshabilitarModoTurbo() {
    this.evaluar('ComportamientoConVelocidad').modoTurbo = false;
    this.evaluar('pilas').ponerVelocidadNormal();
  },

  modoTurboEstaActivado() {
    return this.evaluar('ComportamientoConVelocidad').modoTurbo
  }

});
