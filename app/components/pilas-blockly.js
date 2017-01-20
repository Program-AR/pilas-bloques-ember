import Ember from 'ember';

let VERSION_DEL_FORMATO_DE_ARCHIVO = 1;

export default Ember.Component.extend({
  classNames: 'desafio-panel-derecho',
  ejecutando: false,
  cola_deshacer: [],
  data_observar_blockly: false,
  actividad: null,
  environment: Ember.inject.service(),
  interpreterFactory: Ember.inject.service(),
  abrirConsignaInicial: false,
  solucion: null,
  pilas: null,          // Se espera que sea una referencia al servicio pilas.
  codigoJavascript: "", // Se carga como parametro
  persistirSolucionEnURL: true,
  debeMostrarFinDeDesafio: false,
  codigo: null,
  highlightedBlock: null, // bloque a resaltar.

  twitter: Ember.inject.service(),
  previewData: null, // representa la imagen previsualización del dialogo para twittear.
  mensajeCompartir: 'Comparto mi solución de Pilas Bloques',
  compartirEnCurso: false,
  //browser: Ember.inject.service(),
  bloques: [],

  anterior_ancho: -1,
  anterior_alto: -1,

  blockly_toolbox: [ {
      category: '...',
      blocks: []
  }],

  initial_workspace: `
      <xml xmlns="http://www.w3.org/1999/xhtml">
        <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0">
        </block>
      </xml>';
  `,

  javascriptCode: null,

  inyectarRedimensionado: Ember.on('init', function() {

    // Muestra el dialogo inicial si está definida la consigna inicial.
    if (this.get('actividad.actividad.consignaInicial')) {
      Ember.run.later(() => {
        this.set('abrirConsignaInicial', true);
      });
    }

  }),


  didInsertElement() {

    var event = new Event('terminaCargaInicial');
    window.dispatchEvent(event);

    Ember.run.scheduleOnce('afterRender', () => {
      this.set('blockly_toolbox', this.obtenerToolboxDesdeListaDeBloques(this.get('bloques')));

      this.set('blockly_comments', this.get('actividad.puedeComentar'));
      this.set('blockly_disable', this.get('actividad.puedeDesactivar'));
      this.set('blockly_duplicate', this.get('actividad.puedeDuplicar'));


      // Si el código está serializado en la URL, lo intenta colocar en el
      // workspace.
      if (this.get('codigo')) {
        let codigoSerializado = this.get('codigo');
        let codigoXML = atob(codigoSerializado);

        this.set('initial_workspace', codigoXML);
      }

    });


    if (this.get("persistirSolucionEnURL")) {
      // TODO: puede que esto quede en desuso.
    }

    this.get('pilas').on("errorDeActividad", (motivoDelError) => {
      var receptor = this.get('pilas').evaluar('pilas.escena_actual().automata');
      receptor.decir(motivoDelError);
    });

    $(window).trigger('resize');
  },

  /**
   * Genera el toolbox como lista de categorias con bloques a partir
   * de una lista de bloques simples.
   *
   * Por ejemplo:
   *
   *  >> obtenerToolboxDesdeListaDeBloques(['MoverDerecha', 'TocaSensor', 'TocaEnemigo'])
   *
   * [
   *    {
   *      category: 'Primitivas',
   *      blocks: ['MoverDerecha']
   *    },
   *    {
   *      category: 'Sensores',
   *      blocks: ['TocaSensor', 'TocaEnemigo']
   *    },
   * ]
   *
   */
  obtenerToolboxDesdeListaDeBloques(bloques) {

    if (bloques === undefined) {
      throw new Error("La actividad no tiene bloques definidos, revise el fixture de la actividad para migrarla a ember-blocky.");
    }

    let toolbox = [];

    bloques.forEach((bloque) => {
      let bloqueDesdeBlockly = this._obtenerBloqueDesdeBlockly(bloque);

      if (bloqueDesdeBlockly && bloqueDesdeBlockly.categoria) {
        this._agregar_bloque_a_categoria(toolbox, bloqueDesdeBlockly.categoria, bloque, bloqueDesdeBlockly.categoria_custom);
      } else {
        this._agregar_bloque_a_categoria(toolbox, 'SIN CATEGORÍA', bloque);
      }

    });

    return toolbox;
  },

  /**
   * Permite obtener el bloque desde blockly a partir de su nombre simple.
   *
   * TODO: Mover a ember-blockly. Debería estar dentro del servicio blockly.
   */
  _obtenerBloqueDesdeBlockly(bloqueComoString) {
    return Blockly.Blocks[bloqueComoString];
  },

  /**
   * Método auxiliar de "obtenerToolboxDesdeListaDeBloques". Este método
   * permite agregar un bloque a una categoría dentro del toolbox.
   */
  _agregar_bloque_a_categoria(toolbox, categoria, bloque, categoria_custom) {

    function obtenerOCrearCategoria(toolbox, categoria) {
      for (let i=0; i<toolbox.length; i++) {
        if (toolbox[i].category === categoria) {
          return toolbox[i];
        }
      }

      toolbox.push({
        category: categoria,
        blocks: []
      });

      return toolbox[toolbox.length-1];
    }

    let categoriaEnElToolbox = obtenerOCrearCategoria(toolbox, categoria);
    if(categoria_custom) {
      categoriaEnElToolbox.custom = categoria_custom;
    }
    categoriaEnElToolbox.blocks.push(bloque);
  },

  cuandoTerminaEjecucion() {
    this.sendAction('onTerminoEjecucion');
    if (this.get("debeMostrarFinDeDesafio")) {
      // TODO: Acá falla porque no existe la actividad.
      if (this.get('pilas').estaResueltoElProblema() && this.get('actividad').debeFelicitarse()) {
        this.send('abrirFinDesafio');
      }
    }
  },

  willDestroyElement() {
    window.removeEventListener('terminaCargaInicial', this.handlerCargaInicial, false);
    window.removeEventListener('terminaEjecucion', this.handlerTerminaEjecucion, false);
  },

  restaurar_codigo(codigo) {
    var xml = Blockly.Xml.textToDom(codigo);

    if (Blockly.mainWorkspace) {
      Blockly.mainWorkspace.clear();
      Blockly.Xml.domToWorkspace(xml, Blockly.getMainWorkspace());
    }
  },

  /*
  cargar_codigo_desde_el_modelo() {
    if (this.get('model')) {
      var modelo = this.get('model');
      var codigo = modelo.get('codigo');
      this.restaurar_codigo(codigo);
    }
    this.sendAction('registrarPrimerCodigo');
  },
  */

  actions: {
    ejecutar() {
      this.get('pilas').reiniciarEscenaCompleta();
      let codigoDesdeWorkspace = this.get('javascriptCode');
      let factory = this.get('interpreterFactory');
      let codigoCompleto = js_beautify(`
        var actor_id = 'demo'; // se asume el actor receptor de la escena.

        function hacer(id, comportamiento, params) {
          out_hacer(comportamiento, JSON.stringify(params));
        }

        function main() {
          ${codigoDesdeWorkspace}
        }

        main();
      `);


      let interprete = factory.crearInterprete(codigoCompleto, (bloque) => {
        var me = this;
        Ember.run(function () {
          me.set('highlightedBlock', bloque);
        });
      });


      function ejecutarInterpreteHastaTerminar(interprete, condicion_de_corte) {

        return new Ember.RSVP.Promise((success, reject) => {

          function execInterpreterUntilEnd(interpreter) {
            let running;

            // Si el usuario solicitó terminar el programa deja
            // de ejecutar el intérprete.
            if (condicion_de_corte()) {
              success();
              return;
            }

            try {
              running = interpreter.run();
            } catch(e) {
              reject(e);
            }

            if (running) {
              setTimeout(execInterpreterUntilEnd, 10, interpreter);
            } else {
              success();
            }
          }

          execInterpreterUntilEnd(interprete);

        });
      }



      this.set('ejecutando', true);

      let condicion_de_corte = () => {
        return (! this.get("ejecutando"));
      };

      let ejecucion = ejecutarInterpreteHastaTerminar(interprete, condicion_de_corte);

      ejecucion.then(() => {
        this.set('ejecutando', false);
        this.cuandoTerminaEjecucion();
      });
    },

    reiniciar() {
      this.set('ejecutando', false);
      this.get('pilas').reiniciarEscenaCompleta();
    },

    guardar() {
      this.sendAction('guardar');
    },

    guardar_solucion_en_el_backend() {
      let codigo_xml = this.get('actividad').generarCodigoXMLComoString();
      this.sendAction('guardar_solucion_en_el_backend', codigo_xml);
    },

    ver_codigo() {
      let codigo_como_string = this.get('actividad').generarCodigoXMLComoString();
      alert(codigo_como_string);
    },

    ingresar_codigo() {
      var codigo = prompt("Ingrese el código");

      if (codigo) {
        this.get('actividad').cargarCodigoDesdeStringXML(codigo);
      }

    },

    compartir() {
      this.set('abrirDialogoCompartir', true);
      let data = this.get("pilas").obtenerCapturaDePantalla();
      this.set('previewData', data);
    },

    ocultarModalTwitter() {
      this.set('abrirDialogoCompartir', false);
    },

    abrirFinDesafio() {
      this.set('mostrarDialogoFinDesafio', true);
    },

    ocultarFinDesafio() {
      this.set('mostrarDialogoFinDesafio', false);
    },

    abrirMensajePublicado() {
      let url = this.get('mensajePublicadoURL');
      this.get('browser').openLink(url);
    },

    enviarMensaje() {
      this.set('envioEnCurso', true);

      let mensaje = this.get('mensajeCompartir');
      let imagen = this.get('previewData');

      this.get('twitter').compartir(mensaje, imagen).
      then((data) => {
        this.set('envioEnCurso', false);
        this.set('mensajePublicadoURL', data.url);
      }).
      catch((err) => {
        alert(err);
        this.set('envioEnCurso', false);
      });
    },

    cargarSolucion(archivo, contenido) {
      let regex_file = /\.spbq$/;
      let regex_version = /^\d+$/;
      let data = null;
      let solucion = null;

      if (!regex_file.test(archivo.name)) {
        alert("Lo siento, solo se permiten cargar archivos .spbq");
        return;
      }

      try {
        data = JSON.parse(contenido);
        solucion = atob(data.solucion);
      } catch (e) {
        console.error(e);
        alert("Lo siento, el archivo está dañando.");
        return;
      }

      if (!regex_version.test(data.version)) {
        alert("Lo siento, la especificación de versión es incorrecta.");
        return;
      }


      if (parseInt(data.version) > VERSION_DEL_FORMATO_DE_ARCHIVO) {
        alert("Cuidado, el archivo corresponde a otra versión de la aplicación. Se cargará de todas formas, pero puede fallar.");
      }

      if (this.get("actividad").id !== data.actividad) {
        alert(`Cuidado, el archivo indica que es para otra actividad (${data.actividad}). Se cargará de todas formas, pero puede fallar.`);
      }

      this.get('actividad').cargarCodigoDesdeStringXML(solucion);
    },

    guardarSolucion() {
      let nombre_de_la_actividad = this.get("actividad").id;
      let nombre_surgerido = `${nombre_de_la_actividad}.spbq`;
      let contenido = {
        version: VERSION_DEL_FORMATO_DE_ARCHIVO,
        actividad: nombre_de_la_actividad,
        solucion: btoa(this.get('actividad').generarCodigoXMLComoString())
      };
      let contenido_como_string = JSON.stringify(contenido);

      function descargar(text, name, type) {
        var a = document.getElementById("placeholder");
        var file = new Blob([text], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
      }

      descargar(contenido_como_string, nombre_surgerido, 'application/octet-stream');
    },
  },

});
