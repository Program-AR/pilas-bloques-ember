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
  persistirSolucionEnURL: false, // se le asigna una valor por parámetro.
  debeMostrarFinDeDesafio: false,
  codigo: null,
  highlightedBlock: null, // bloque a resaltar.
  modelActividad: null,

  twitter: Ember.inject.service(),
  previewData: null, // representa la imagen previsualización del dialogo para twittear.
  mensajeCompartir: 'Comparto mi solución de Pilas Bloques',
  compartirEnCurso: false,
  //browser: Ember.inject.service(),
  bloques: [],
  codigoActualEnFormatoXML: '',     // se actualiza automáticamente al modificar el workspace.

  anterior_ancho: -1,
  anterior_alto: -1,

  blockly_toolbox: [ {
      category: '...',
      blocks: []
  }],

  pasoAPasoHabilitado: false,
  pausadoEnBreakpoint: false,

  javascriptCode: null,

  inyectarRedimensionado: Ember.on('init', function() {

    // Muestra el dialogo inicial si está definida la consigna inicial.
    if (this.get('actividad.actividad.consignaInicial')) {
      Ember.run.later(() => {
        this.set('abrirConsignaInicial', true);
      });
    }

  }),

  debeMostarRegresarAlLibro: Ember.computed('model', function() {
    return true;
  }),

  didInsertElement() {

    var event = new Event('terminaCargaInicial');
    window.dispatchEvent(event);

    Ember.run.scheduleOnce('afterRender', () => {
      this.set('blockly_toolbox', this.obtenerToolboxDesdeListaDeBloques(this.get('bloques')));

      this.set('blockly_comments', this.get('actividad.puedeComentar'));
      this.set('blockly_disable', this.get('actividad.puedeDesactivar'));
      this.set('blockly_duplicate', this.get('actividad.puedeDuplicar'));

      // Elijo el estilo default de toolbox si es que no viene indicado en el desafio
      if(!this.get('modelActividad').get('estiloToolbox')){
        this.get('modelActividad').set('estiloToolbox','desplegable');
      }


      // Si el código está serializado en la URL, lo intenta colocar en el
      // workspace.
      if (this.get('codigo')) {
        let codigoSerializado = this.get('codigo');
        let codigoXML = atob(codigoSerializado);

        this.set('initial_workspace', codigoXML);
      } else if (this.get('modelActividad').get('solucionInicial')) { //también puede venir código de la configuración de la actividad.
				this.set('initial_workspace', this.get('modelActividad').get('solucionInicial'));
			} else { //Sino, el código por defecto es el empezar a ejecutar
        this.set('initial_workspace', this._xmlBloqueEmpezarAEjecutar());
      }

    });

    if (this.get("persistirSolucionEnURL")) {
      // TODO: puede que esto quede en desuso.
    }

    // TODO: Este es un hook para luego agregar a la interfaz 
    // el informe deseado al ocurrir un error.
    // this.get('pilas').on("errorDeActividad", (motivoDelError) => {
    //   Ember.run(this, function() {
    //     // TODO
    //   });
    // });

    $(window).trigger('resize');
  },

  _xmlBloqueEmpezarAEjecutar(){
    return `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" x="15" y="15"></block>
    </xml>`;
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

    toolbox.push({category: 'Separator', isSeparator: true});

    return this._aplicarEstiloAToolbox(this.ordenar_toolbox(toolbox));
  },

  /**
   * Dependiendo del desafío, puede pasar que sea necesario no mostrar las categorías
   * sino directamente los bloques en el toolbox.
   * 
   * TODO: Falta implementar el estilo "desplegado"
   */
  _aplicarEstiloAToolbox(toolbox){
    var aplanado = toolbox;
    if(!this._debeHaberCategoriasEnToolbox()){
      aplanado = [];
      toolbox.forEach(bloque => {
        if(bloque.isSeparator || !bloque.category){
          aplanado.push(bloque); //un separador ó un id de bloque van directo
        } else {
          aplanado = aplanado.concat(this._aplicarEstiloAToolbox(bloque.blocks));
        }
      });
    }
    return aplanado;
  },

  _debeHaberCategoriasEnToolbox(){
    return this.get('modelActividad').get('estiloToolbox') !== "sinCategorias";
  },

  /**
   * Ordena la lista de ítems de un toolbox (usualmente categorias), por el orden
   * establecido en Pilas Bloques. 
   * Las categorías que no están en la lista definida por Pilas Bloques, quedan al final.
   * @param {*} toolbox 
   */
  ordenar_toolbox(toolbox) {
    let orden_inicial = [ // Orden inicial para la lista de categorias.
      'Primitivas',
      'Mis procedimientos',
      'Repeticiones',
      'Alternativas',
      'Variables',
      'Separator',
      'Valores',
      'Sensores',
      'Operadores',
      'Mis funciones'
    ];

    return toolbox.sort((cat1, cat2) => 
      orden_inicial.indexOf(cat1.category) >= orden_inicial.indexOf(cat2.category)
    );
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
    Ember.run(this, function() {
      this.sendAction('onTerminoEjecucion');

      if (this.get("debeMostrarFinDeDesafio")) {
        if (this.get('pilas').estaResueltoElProblema() && this.get('modelActividad').get('debeFelicitarse')) {
          this.send('abrirFinDesafio');
        }
      }

      this.set('ejecutando', false);
      this.set('highlightedBlock', null);

    });
  },

  willDestroyElement() {
    window.removeEventListener('terminaCargaInicial', this.handlerCargaInicial, false);
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
    ejecutar(pasoAPaso=false) {
      this.get('pilas').reiniciarEscenaCompleta();

      // Permite obtener el código xml al momento de ejecutar. Se utiliza
      // cuando se accede a la ruta curso/alumno para guardar la solución
      // del usuario en cada momento de ejecución.
      if (this.get('cuandoEjecuta')) {
        let codigo_xml = this.get('codigoActualEnFormatoXML');
        this.get('cuandoEjecuta')(codigo_xml);
      }

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

      this.set('pausadoEnBreakpoint', false);

      let interprete = factory.crearInterprete(codigoCompleto, (bloque) => {
        var me = this;
        Ember.run(function () {
          me.set('highlightedBlock', bloque);
        });
      });

      let ejecutarInterpreteHastaTerminar = (interprete) => {

        return new Ember.RSVP.Promise((success, reject) => {
          let hayMasParaEjecutarDespues;

          let execInterpreterUntilEnd = (interpreter) => {

            // Si el usuario solicitó terminar el programa deja
            // de ejecutar el intérprete.
            if (!this.get("ejecutando")) {
              success();
              return;
            }

            try {
              if (pasoAPaso) {
                // Si está activado el modo depurador, intentará suspender
                // la llamada a interpreter.run() hasta que el usuario pulse
                // el botón step.
                if (interpreter.paused_ === false && !this.get('pausadoEnBreakpoint')) {  
                  hayMasParaEjecutarDespues = interpreter.run(); 
                  this.set('pausadoEnBreakpoint', true);
                }
              } else {
                hayMasParaEjecutarDespues = interpreter.run();
              }
            } catch(e) {
              reject(e);
            }

            if (hayMasParaEjecutarDespues) {
              // Llama recursivamente, abriendo thread en cada llamada.
              setTimeout(execInterpreterUntilEnd, 10, interpreter);
            } else {
              success();
            }
          };

          execInterpreterUntilEnd(interprete);

        });
      };

      this.set('ejecutando', true);

      ejecutarInterpreteHastaTerminar(interprete).then(() => {
        this.cuandoTerminaEjecucion();
      });
    },

    reiniciar() {
      this.set('highlightedBlock', null);
      this.set('ejecutando', false);
      this.get('pilas').reiniciarEscenaCompleta();
    },

    guardar() {
      this.sendAction('guardar');
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

    abrirReporteProblemas() {
      this.set('mostrarDialogoReporteProblemas', true);
    },

    cerrarReporteProblemas() {
      this.set('mostrarDialogoReporteProblemas', false);
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

      if (this.get("modelActividad.nombre") !== data.actividad) {
        alert(`Cuidado, el archivo indica que es para otra actividad (${data.actividad}). Se cargará de todas formas, pero puede fallar.`);
      }

      this.set('initial_workspace', solucion);
    },

    guardarSolucion() {
      let nombre_de_la_actividad = this.get("modelActividad.nombre");
      let nombre_surgerido = `${nombre_de_la_actividad}.spbq`;

      let contenido = {
        version: VERSION_DEL_FORMATO_DE_ARCHIVO,
        actividad: nombre_de_la_actividad,
        solucion: btoa(this.get('codigoActualEnFormatoXML'))
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

    step() {
      this.set('pausadoEnBreakpoint', false);
    },

    onChangeWorkspace(xml) {
      if (this.isDestroyed) {
        return;
      }

      this.set('codigoActualEnFormatoXML', xml);
      this.sendAction('onChangeWorkspace', xml);
    }
  },

});

Ember.onerror = function (e) {
  if(e.message | e.stack){
    console.error(
      "Exception: " + e.message + "\n" +
      "\n" +
      "Stack trace:\n" + e.stack
    );
  } else {
    console.error(e);
  }
};
