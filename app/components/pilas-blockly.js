/* jshint ignore:start */
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'desafio-panel-derecho',
  ejecutando: false,
  terminoDeEjecutar: false,
  errorDeActividad: null,
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
  modelActividad: null,
  modoTuboHabilitado: false,

  highlighter: Ember.inject.service(),
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

  debeMostarReiniciar: Ember.computed('ejecutando', 'terminoDeEjecutar', function() {
    return this.get('ejecutando') || this.get('terminoDeEjecutar');
  }),

  estoyEnMoodle: Ember.computed('modoAlumno', 'modoDocente', function() {
    return this.get('modoAlumno') || this.get('modoDocente');
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

    // Este es un hook para luego agregar a la interfaz 
    // el informe deseado al ocurrir un error.
    this.get('pilas').on("errorDeActividad", (motivoDelError) => {
      Ember.run(this, function() {
        this.set('errorDeActividad', motivoDelError);
      });
    });

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

  ejecutarInterpreteHastaTerminar(interprete,pasoAPaso){
    // Se abre una promise que termina cuando:
    //     o bien se llega al último comando escrito en el workspace
    //     o bien el usuario frena la ejecución
    //     o bien existe un error en la escena de pilas web
    return new Promise((success, reject) => {
      let hayMasParaEjecutarDespues;

      let execInterpreterUntilEnd = (interpreter) => {

        // Si el usuario solicitó terminar el programa deja
        // de ejecutar el intérprete.
        if (!this.get("ejecutando")) {
          success();
          return;
        }

        let err = this.get("errorDeActividad"); 
        if (err) {
          reject(new ErrorDeActividad(err));
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
  },

  cuandoTerminaEjecucion() {
    Ember.run(this, function() {
      this.sendAction('onTerminoEjecucion');
      
      if (this.get("debeMostrarFinDeDesafio")) {
        if (this.get('pilas').estaResueltoElProblema() && this.get('modelActividad').get('debeFelicitarse')) {
          this.send('abrirFinDesafio');
        }
      }
      
      if (this.get('ejecutando')) {
        this.set('ejecutando', false);
        this.set('terminoDeEjecutar', true);
        this.clearHighlight();
      }
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
  
  setModoTurbo() {
    if (this.modoTuboHabilitado) {
      this.get('pilas').habilitarModoTurbo();
    } else {
      this.get('pilas').deshabilitarModoTurbo();
    }
  },

  clearHighlight() {
    this.get('highlighter').clear()
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

      this.setModoTurbo()

      // Permite obtener el código xml al momento de ejecutar. Se utiliza
      // cuando se accede a la ruta curso/alumno para guardar la solución
      // del usuario en cada momento de ejecución.
      if (this.get('cuandoEjecuta')) {
        let codigo_xml = this.get('codigoActualEnFormatoXML');
        this.get('cuandoEjecuta')(codigo_xml);
      }

      let factory = this.get('interpreterFactory');
      let interprete = factory.crearInterprete(this.get('javascriptCode'), (bloqueId) => this.get('highlighter').step(bloqueId));
      
      this.set('pausadoEnBreakpoint', false);
      this.set('ejecutando', true);

      this.ejecutarInterpreteHastaTerminar(interprete,pasoAPaso)
        .then(() => this.cuandoTerminaEjecucion())
        .catch(ErrorDeActividad, err => { /** Los errores de la actividad no deberían burbujear */ }); 
    },

    reiniciar() {
      this.clearHighlight()
      this.set('ejecutando', false);
      this.set('terminoDeEjecutar', false);
      this.set('errorDeActividad', null);
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

    step() {
      this.set('pausadoEnBreakpoint', false);
    },

    onChangeWorkspace(xml) {
      if (this.isDestroyed) {
        return;
      }

      this.set('codigoActualEnFormatoXML', xml);
      this.sendAction('onChangeWorkspace', xml);
    },

  }

});

Ember.onerror = function (e) {
  if(e || e.message || e.stack){
    console.error(
      "Exception: " + e.message + "\n" +
      "\n" +
      "Stack trace:\n" + e.stack
    );
  } else {
    console.error(e);
  }
};

class ErrorDeActividad extends Error {
  constructor(exception) {
    super(exception);
  }
}
/* jshint ignore:end */