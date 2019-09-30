/* jshint ignore:start */
import { computed } from '@ember/object';

import { later, scheduleOnce, run } from '@ember/runloop';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'desafio-panel-derecho',
  ejecutando: false,
  terminoDeEjecutar: false,
  errorDeActividad: null,
  cola_deshacer: [],
  data_observar_blockly: false,
  actividad: null,
  interpreterFactory: service(),
  abrirConsignaInicial: false,
  solucion: null,
  pilas: null,          // Se espera que sea una referencia al servicio pilas.
  codigoJavascript: "", // Se carga como parametro
  persistirSolucionEnURL: false, // se le asigna una valor por parámetro.
  debeMostrarFinDeDesafio: false,
  codigo: null,
  modelActividad: null,
  modoTuboHabilitado: false,

  highlighter: service(),
  availableBlocksValidator: service(),
  pilasMulang: service(),

  bloques: [],
  codigoActualEnFormatoXML: '',     // se actualiza automáticamente al modificar el workspace.

  anterior_ancho: -1,
  anterior_alto: -1,

  blockly_toolbox: [{
    category: '...',
    blocks: []
  }],

  pasoAPasoHabilitado: false,
  pausadoEnBreakpoint: false,

  javascriptCode: null,

  inyectarRedimensionado: on('init', function () {

    // Muestra el dialogo inicial si está definida la consigna inicial.
    if (this.get('actividad.actividad.consignaInicial')) {
      later(() => {
        this.set('abrirConsignaInicial', true);
      });
    }

  }),

  debeMostarRegresarAlLibro: computed('model', function () {
    return true;
  }),

  debeMostarReiniciar: computed('ejecutando', 'terminoDeEjecutar', function () {
    return this.ejecutando || this.terminoDeEjecutar;
  }),

  estoyEnMoodle: computed('modoAlumno', 'modoDocente', function () {
    return this.modoAlumno || this.modoDocente;
  }),
  
  tieneExpectativas: computed('modelActividad', function () {
    return this.modelActividad.get('expectativas')
  }),

  didInsertElement() {

    var event = new Event('terminaCargaInicial');
    window.dispatchEvent(event);

    scheduleOnce('afterRender', () => {
      this.set('blockly_toolbox', this.obtenerToolboxDesdeListaDeBloques(this.bloques));

      this.set('blockly_comments', this.get('actividad.puedeComentar'));
      this.set('blockly_disable', this.get('actividad.puedeDesactivar'));
      this.set('blockly_duplicate', this.get('actividad.puedeDuplicar'));

      // Elijo el estilo default de toolbox si es que no viene indicado en el desafio
      if (!this.modelActividad.get('estiloToolbox')) {
        this.modelActividad.set('estiloToolbox', 'desplegable');
      }


      // Si el código está serializado en la URL, lo intenta colocar en el
      // workspace.
      if (this.codigo) {
        let codigoSerializado = this.codigo;
        let codigoXML = atob(codigoSerializado);

        this.set('initial_workspace', codigoXML);
      } else if (this.modelActividad.get('solucionInicial')) { //también puede venir código de la configuración de la actividad.
        this.set('initial_workspace', this.modelActividad.get('solucionInicial'));
      } else { //Sino, el código por defecto es el empezar a ejecutar
        this.set('initial_workspace', this._xmlBloqueEmpezarAEjecutar());
      }

    });

    if (this.persistirSolucionEnURL) {
      // TODO: puede que esto quede en desuso.
    }

    // Este es un hook para luego agregar a la interfaz 
    // el informe deseado al ocurrir un error.
    this.pilas.on("errorDeActividad", (motivoDelError) => {
      run(this, function () {
        this.set('errorDeActividad', motivoDelError);
      });
    });

    $(window).trigger('resize');
  },

  _xmlBloqueEmpezarAEjecutar() {
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

    toolbox.push({ category: 'Separator', isSeparator: true });

    return this._aplicarEstiloAToolbox(this.ordenar_toolbox(toolbox));
  },

  /**
   * Dependiendo del desafío, puede pasar que sea necesario no mostrar las categorías
   * sino directamente los bloques en el toolbox.
   * 
   * TODO: Falta implementar el estilo "desplegado"
   */
  _aplicarEstiloAToolbox(toolbox) {
    var aplanado = toolbox;
    if (!this._debeHaberCategoriasEnToolbox()) {
      aplanado = [];
      toolbox.forEach(bloque => {
        if (bloque.isSeparator || !bloque.category) {
          aplanado.push(bloque); //un separador ó un id de bloque van directo
        } else {
          aplanado = aplanado.concat(this._aplicarEstiloAToolbox(bloque.blocks));
        }
      });
    }
    return aplanado;
  },

  _debeHaberCategoriasEnToolbox() {
    return this.modelActividad.get('estiloToolbox') !== "sinCategorias";
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

    return toolbox.sort((cat1, cat2) => orden_inicial.indexOf(cat1.category) - orden_inicial.indexOf(cat2.category));
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
      for (let i = 0; i < toolbox.length; i++) {
        if (toolbox[i].category === categoria) {
          return toolbox[i];
        }
      }

      toolbox.push({
        category: categoria,
        blocks: []
      });

      return toolbox[toolbox.length - 1];
    }

    let categoriaEnElToolbox = obtenerOCrearCategoria(toolbox, categoria);
    if (categoria_custom) {
      categoriaEnElToolbox.custom = categoria_custom;
    }
    categoriaEnElToolbox.blocks.push(bloque);
  },

  ejecutarInterpreteHastaTerminar(interprete, pasoAPaso) {
    // Se abre una promise que termina cuando:
    //     o bien se llega al último comando escrito en el workspace
    //     o bien el usuario frena la ejecución
    //     o bien existe un error en la escena de pilas web
    return new Promise((success, reject) => {
      let hayMasParaEjecutarDespues;

      let execInterpreterUntilEnd = (interpreter) => {

        // Si el usuario solicitó terminar el programa deja
        // de ejecutar el intérprete.
        if (!this.ejecutando) {
          success();
          return;
        }

        let err = this.errorDeActividad;
        if (err) {
          reject(new ErrorDeActividad(err));
          return;
        }

        try {
          if (pasoAPaso) {
            // Si está activado el modo depurador, intentará suspender
            // la llamada a interpreter.run() hasta que el usuario pulse
            // el botón step.
            if (interpreter.paused_ === false && !this.pausadoEnBreakpoint) {
              hayMasParaEjecutarDespues = interpreter.run();
              this.set('pausadoEnBreakpoint', true);
            }
          } else {
            hayMasParaEjecutarDespues = interpreter.run();
          }
        } catch (e) {
          console.log(e);
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
    run(this, function () {
      if (this.onTerminoEjecucion)
        this.onTerminoEjecucion()

      if (this.debeMostrarFinDeDesafio) {
        if (this.pilas.estaResueltoElProblema() && this.modelActividad.get('debeFelicitarse')) {
          // let mulangResult = this.pilasMulang.analyze(Blockly.mainWorkspace.getTopBlocks()[0], this.modelActividad.get('expectativas'))
          // console.log({mulangResult})
          // let mulangExpectation = mulangResult.expectationResults.every(({result}) => result)
          // this.set("mulangExpectation", mulangExpectation)
          this.send('abrirFinDesafio');
        }
      }

      if (this.ejecutando) {
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
      this.pilas.habilitarModoTurbo();
    } else {
      this.pilas.deshabilitarModoTurbo();
    }
  },

  clearHighlight() {
    this.highlighter.clear()
  },

  allEnabledTopBlocksFilled() {
    return Blockly.mainWorkspace.getTopBlocks()
      .filter(block => !block.disabled)
      .every(block => block.allInputsFilled(false))
  },

  actions: {
    ejecutar(pasoAPaso = false) {
      Blockly.Events.fireRunCode()
      if (!this.allEnabledTopBlocksFilled()) return;
      
      this.pilas.reiniciarEscenaCompleta()

      this.setModoTurbo()


      // Permite obtener el código xml al momento de ejecutar. Se utiliza
      // cuando se accede a la ruta curso/alumno para guardar la solución
      // del usuario en cada momento de ejecución.
      if (this.cuandoEjecuta) {
        let codigo_xml = this.codigoActualEnFormatoXML;
        this.cuandoEjecuta(codigo_xml);
      }

      let factory = this.interpreterFactory;
      let interprete = factory.crearInterprete(this.javascriptCode, (bloqueId) => this.highlighter.step(bloqueId));

      this.set('pausadoEnBreakpoint', false);
      this.set('ejecutando', true);

      this.ejecutarInterpreteHastaTerminar(interprete, pasoAPaso)
        .then(() => this.cuandoTerminaEjecucion())
        .catch(ErrorDeActividad, err => { /** Los errores de la actividad no deberían burbujear */ });
    },

    reiniciar() {
      this.clearHighlight()
      this.set('ejecutando', false);
      this.set('terminoDeEjecutar', false);
      this.set('errorDeActividad', null);
      this.pilas.reiniciarEscenaCompleta();
    },

    guardar() {
      if (this.guardar) this.guardar()
    },

    ver_codigo() {
      let codigo_como_string = this.actividad.generarCodigoXMLComoString();
      alert(codigo_como_string);
    },

    ingresar_codigo() {
      var codigo = prompt("Ingrese el código");

      if (codigo) {
        this.actividad.cargarCodigoDesdeStringXML(codigo);
      }

    },

    abrirFinDesafio() {
      this.set('mostrarDialogoFinDesafio', true);
    },

    ocultarFinDesafio() {
      this.set('mostrarDialogoFinDesafio', false);
    },

    abrirReporteProblemas() {
      this.set('mostrarDialogoReporteProblemas', true);
    },

    cerrarReporteProblemas() {
      this.set('mostrarDialogoReporteProblemas', false);
    },

    step() {
      this.set('pausadoEnBreakpoint', false);
    },

    onChangeWorkspace(xml) {
      if (this.isDestroyed) {
        return;
      }

      this.set('codigoActualEnFormatoXML', xml);
      if (this.onChangeWorkspace)
        this.onChangeWorkspace(xml)
    },

    onNewWorkspace() {
      this.availableBlocksValidator.disableNotAvailableBlocksInWorkspace(this.bloques)
    },

  }

});

class ErrorDeActividad extends Error {
  constructor(exception) {
    super(exception);
  }
}
/* jshint ignore:end */