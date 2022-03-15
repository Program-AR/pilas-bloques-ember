/* jshint ignore:start */
import { computed } from '@ember/object';

import { later, scheduleOnce, run } from '@ember/runloop';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import Ember from 'ember'

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
  codigoActualEnFormatoXML: '',     // se actualiza automáticamente al modificar el workspace.

  anterior_ancho: -1,
  anterior_alto: -1,

  blockly_toolbox: [{
    categoryId: '...',
    blocks: []
  }],

  pasoAPasoHabilitado: false,
  pausadoEnBreakpoint: false,

  javascriptCode: null,

  intl: Ember.inject.service(),

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
      this.set('blockly_toolbox', this.toolboxForBlockTypes(this.bloques));

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
   * Creates a toolbox as a list of categories ids with block types
   * from a list of block types
   *
   * E.g.:
   *
   *  >> toolboxForBlockTypes(['MoverDerecha', 'TocaSensor', 'TocaEnemigo'])
   *
   * [
   *    {
   *      categoryId: 'primitives',
   *      blocks: ['MoverDerecha']
   *    },
   *    {
   *      categoryId: 'sensors',
   *      blocks: ['TocaSensor', 'TocaEnemigo']
   *    },
   * ]
   *
   */
   toolboxForBlockTypes(blockTypes) {

    if (blockTypes === undefined) {
      throw new Error("La actividad no tiene bloques definidos, revise el fixture de la actividad para migrarla a ember-blocky.");
    }

    const toolbox = this.groupedByCategories(blockTypes)

    toolbox.push({ categoryId: 'separator', isSeparator: true });

    return this._toEmberBlocklyToolbox(toolbox);
  },

  groupedByCategories(blockTypes) {
    return this.categoryIdsFor(blockTypes).map( categoryId => ({
      categoryId: categoryId,
      blocks: blockTypes.filter( bt => this._categoryIdFor(bt) === categoryId ),
    }))
  },

  categoryIdsFor(blockTypes) {
    return [... new Set(blockTypes.map(bt => this._categoryIdFor(bt)))]
  },

  _categoryIdFor(blockType) {
      return this._blockFromBlockly(blockType)?.categoryId || 'uncategorized'
  },

  _toEmberBlocklyToolbox(toolbox) {
    return this._styledToolbox(this.ordered_toolbox(toolbox)).map(
      block => this._toEmberBlocklyToolboxItem(block)
    )
  },

  /*
   * EmberBlocklyToolboxItem should have the following structure:
   * type EmberBlocklyToolboxItem = string | {
	 *    category?: string,
   *    custom?: string,
	 *    isSeparator?: boolean,
	 *    blocks?: string[] // These are block types, not blocks.
   * }
   */
  _toEmberBlocklyToolboxItem(block) {
    if(typeof block === "string") return block

    const emberBlocklyToolboxItem = { category: this.intl.t(`blocks.categories.${block.categoryId}`).toString(), ...block }
    delete emberBlocklyToolboxItem.categoryId

    return emberBlocklyToolboxItem
  },

  /**
   * Depending on the challenge, categories may not be required to be shown.
   * Block types should be shown instead.
   * 
   * TODO: Implement style "desplegado"
   */
  _styledToolbox(toolbox) {
    if(this._areCategoriesRequiredInToolbox()) return toolbox

    let flattened_toolbox = []

    toolbox.forEach(block => {
      if(this._shouldRemainUnchanged(block)){
        flattened_toolbox.push(block) //Separators and block ids should not be modified
      } else {
        flattened_toolbox = flattened_toolbox.concat(this._styledToolbox(block.blocks))
      }
    })

    return flattened_toolbox
  },

  _shouldRemainUnchanged(block){
    return block.isSeparator || !block.categoryId
  },

  _areCategoriesRequiredInToolbox() {
    return this.modelActividad.get('estiloToolbox') !== "sinCategorias";
  },

  /**
   * Orders the toolbox (usually categories) by Pilas Bloques stablished order.
   * Categories that are not in the initial_order list should remain at the end.
   * @param {*} toolbox
   */
  ordered_toolbox(toolbox) {
    const initial_order = [ // Categories initial order.
      'primitives',
      'myProcedures',
      'repetitions',
      'alternatives',
      'variables',
      'separator',
      'values',
      'sensors',
      'operators',
      'myFunctions'
    ];

    const recognized_items = []
    const unrecognized_items = []

    toolbox.forEach(item => {
      if(initial_order.includes(item.categoryId)){
        recognized_items.push(item)
      } else {
        unrecognized_items.push(item)
      }
    })

    return recognized_items.sort((cat1, cat2) => initial_order.indexOf(cat1.categoryId) - initial_order.indexOf(cat2.categoryId)).concat(unrecognized_items);
  },

  /**
   * Obtains a Blockly block from a block type
   *
   * TODO: Move to ember-blockly. It belongs to blockly service.
   */
  _blockFromBlockly(blockType) {
    return Blockly.Blocks[blockType];
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

      if (this.debeMostrarFinDeDesafio) {
        if (this.pilas.estaResueltoElProblema() && this.modelActividad.get('debeFelicitarse')) {
          this.send('abrirFinDesafio');
        }
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
    }
  },

  runProgramEvent() {
    return this.pilasBloquesApi.runProgram(this.modelActividad.id, { program: this.codigoActualEnFormatoXML, ast: this.pilasMulang.parseAll(Blockly.mainWorkspace), turboModeOn: this.pilas.modoTurboEstaActivado(), staticAnalysis: this.staticAnalysis() })
  },

  executionFinishedEvent(solutionId, executionResult) {
    run(this, function () {
      this.pilasBloquesApi.executionFinished(solutionId, {
        isTheProblemSolved: this.pilas.estaResueltoElProblema(),
        ...executionResult
      })
    })
  },

  actions: {

    ejecutar(pasoAPaso = false) {
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
