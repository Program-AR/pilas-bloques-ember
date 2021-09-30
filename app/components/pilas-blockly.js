/* jshint ignore:start */
import { computed } from '@ember/object'
import { later, scheduleOnce, run } from '@ember/runloop'
import { on } from '@ember/object/evented'
import { inject as service } from '@ember/service'
import Component from '@ember/component'
import { addWarning, clearValidations, declarationWithName } from '../utils/blocks'

export default Component.extend({
  classNames: 'pilas-blockly',
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

  highlighter: service(),
  availableBlocksValidator: service(),
  pilasBloquesApi: service(),
  pilasMulang: service(),

  bloques: [],
  expects: [],
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

  debeMostarReiniciar: computed('ejecutando', 'terminoDeEjecutar', function () {
    return this.ejecutando || this.terminoDeEjecutar;
  }),

  failedExpects: computed('expects', function () {
    return this.expects.filter(e => !e.result)
  }),

  allExpectsPassed: computed('failedExpects', function () {
    return !this.failedExpects.length
  }),

  shouldShowCongratulations: computed('allExpectsPassed', 'debeMostrarFinDeDesafio', 'modelActividad', function () {
    return this.allExpectsPassed && this.debeMostrarFinDeDesafio && this.modelActividad.get('debeFelicitarse')
  }),

  didInsertElement() {

    /*
      Esta no es la forma correcta de arreglar esto.
      Pero como pilas-blockly es hijo de challengeWorkspace,
      challengeWorkspace no puede enviarle actions a pilas-blocky.
      Esto es lo mas que puedo hacer para evitar un refactor
      gigante.
    */
    this.set('exerciseWorkspace', this.get('parentView').get('parentView'));
    this.exerciseWorkspace.setPilasBlockly(this);

    var event = new Event('terminaCargaInicial');
    window.dispatchEvent(event);

    scheduleOnce('afterRender', async () => {
      this.set('blockly_toolbox', this.obtenerToolboxDesdeListaDeBloques(this.bloques));

      this.set('blockly_comments', this.get('actividad.puedeComentar'));
      this.set('blockly_disable', this.get('actividad.puedeDesactivar'));
      this.set('blockly_duplicate', this.get('actividad.puedeDuplicar'));

      // Elijo el estilo default de toolbox si es que no viene indicado en el desafio
      if (!this.modelActividad.get('estiloToolbox')) {
        this.modelActividad.set('estiloToolbox', 'desplegable');
      }

      const savedSolution = await this.pilasBloquesApi.lastSolution(this.modelActividad.id)

      // Si el código está serializado en la URL, lo intenta colocar en el
      // workspace.
      if (this.codigo) {
        let codigoSerializado = this.codigo;
        let codigoXML = atob(codigoSerializado);
        this.set('initial_workspace', codigoXML);
      } else if (savedSolution) { // Si ya envió una solución anteriormente
        this.set('initial_workspace', savedSolution.program);
      } else {
        this.set('initial_workspace', this.modelActividad.initialWorkspace);
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
          success({ stoppedByUser: true });
          return;
        }

        // Si se produce un error en la actividad se termina de ejecutar el intérprete.
        // Esto es un resultado válido, no hubo ningún problema con el intérprete.
        let error = this.errorDeActividad; // Se settea ante evento de Pilas
        if (error) {
          success({ error });
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
              this.exerciseWorkspace.set('pausadoEnBreakpoint', true);
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
          success({ finished: true });
        }
      };

      execInterpreterUntilEnd(interprete);

    });
  },

  cuandoTerminaEjecucion() {
    run(this, function () {

      if (this.errorDeActividad) {
        if (this.onErrorDeActividad) this.onErrorDeActividad(this.errorDeActividad)
        return;
      }

      if (this.onTerminoEjecucion)
        this.onTerminoEjecucion()

      if (this.pilas.estaResueltoElProblema() && this.shouldShowCongratulations ) {
        this.send('abrirFinDesafio')
      }

      if (this.ejecutando) {
        this.set('ejecutando', false);
        this.exerciseWorkspace.set('ejecutando', false);
        this.set('terminoDeEjecutar', true);
        this.exerciseWorkspace.set('terminoDeEjecutar', true);
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

  clearHighlight() {
    this.highlighter.clear()
  },

  shouldExecuteProgram() {
    return Blockly.mainWorkspace.getTopBlocks()
      .filter(block => !block.disabled)
      .every(block => Blockly.shouldExecute(block))
  },

  staticAnalysis() {
    return {
      couldExecute: this.shouldExecuteProgram(),
      expects: this.get('expects'),
    }
  },

  runProgramEvent() {
    return this.pilasBloquesApi.runProgram(this.modelActividad.id, {
      program: this.codigoActualEnFormatoXML,
      ast: this.pilasMulang.parseAll(Blockly.mainWorkspace),
      turboModeOn: this.pilas.modoTurboEstaActivado(),
      staticAnalysis: this.staticAnalysis()
    })
  },

  executionFinishedEvent(solutionId, executionResult) {
    run(this, function () {
      this.pilasBloquesApi.executionFinished(solutionId, {
        isTheProblemSolved: this.pilas.estaResueltoElProblema(),
        ...executionResult
      })
    })
  },

  showExpectationFeedback() {
    this.get('failedExpects').forEach(({ declaration, expect }, i) =>
      addWarning(declarationWithName(declaration), expect, -i)// TODO: Add priority?
    )
  },

  actions: {

    ejecutar(pasoAPaso = false) {
      clearValidations()
      this.set('expects', this.pilasMulang.analyze(Blockly.mainWorkspace, this.modelActividad))

      this.showExpectationFeedback()

      const analyticsSolutionId = this.runProgramEvent()
      this.pilas.reiniciarEscenaCompleta()

      Blockly.Events.fireRunCode()
      if (!this.shouldExecuteProgram()) return;

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
      this.exerciseWorkspace.set('pausadoEnBreakpoint', false);

      this.set('ejecutando', true);
      this.exerciseWorkspace.set('ejecutando', true);

      this.ejecutarInterpreteHastaTerminar(interprete, pasoAPaso)
        .then(executionResult => {
          this.executionFinishedEvent(analyticsSolutionId, executionResult)
          this.cuandoTerminaEjecucion()
        })
    },

    reiniciar() {
      this.clearHighlight()
      this.set('ejecutando', false);
      this.exerciseWorkspace.set('ejecutando', false);
      this.set('terminoDeEjecutar', false);
      this.exerciseWorkspace.set('terminoDeEjecutar', false);
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

    step() {
      this.set('pausadoEnBreakpoint', false);
      this.exerciseWorkspace.set('pausadoEnBreakpoint', false);
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
