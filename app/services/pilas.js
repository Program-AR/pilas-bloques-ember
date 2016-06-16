import Ember from 'ember';
import listaImagenes from 'pilas-engine-bloques/components/listaImagenes';

export default Ember.Service.extend({
  iframe: null,
  actorCounter: 0,
  pilas: null,
  loading: true,

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

        new pilas.actores.Mono();

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
      }

      pilas.ejecutar();

    });
  },

  /**
   * Método privado que se encarga de vincular todas las propiedades
   * que nos permiten observar el comportamiento de pilas.
   */
  _vincular_propiedades(pilas) {
    this.set('actorCounter', pilas.obtener_cantidad_de_actores());

    pilas.eventos.cambia_coleccion_de_actores.add((data) => {
      this.set('actorCounter', data.cantidad);
    });
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

      this.set("temporallyCallback", success); /* Guarda el callback  para
                                                * que se llame luego de
                                                * la carga de pilas.
                                                */
    });
  },

  runProject(project) {
    this.reload().then(() => {
      this.runProjectWithoutReload(project);
    });
  },

  runProjectWithoutReload(project) {
    this.get("iframe").contentWindow.eval(project.get("code"));
  }

});
