/* jshint ignore:start */
import { computed } from '@ember/object'
import { run } from '@ember/runloop'

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
  solucion: null,
  pilasService: null,
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
    categoryId: '...',
    blocks: []
  }],

  pasoAPasoHabilitado: false,
  pausadoEnBreakpoint: false,

  javascriptCode: null,
  intl: Ember.inject.service(),

  debeMostarReiniciar: computed('ejecutando', 'terminoDeEjecutar', function () {
    return this.ejecutando || this.terminoDeEjecutar;
  }),

  failedExpects: computed('expects', function () {
    return this.expects.filter(e => !e.result)
  }),

  passedExpects: computed('expects', function () {
    return this.expects.filter(e => e.result)
  }),

  allExpectsPassed: computed('failedExpects', function () {
    return !this.failedExpects.length
  }),

  passedExpectsValue: computed('passedExpects', 'expects', function () {
    return 100 * this.passedExpects.length / this.expects.length
  }),

  shouldOpenEndModal: computed('debeMostrarFinDeDesafio', 'modelActividad', function () {
    return this.debeMostrarFinDeDesafio && this.modelActividad.get('debeFelicitarse')
  }),

  didUpdateAttrs() {
    this.didInsertElement()
  },
  
  async didInsertElement() {

    /*
      Esta no es la forma correcta de arreglar esto.
      Pero como pilas-blockly es hijo de challengeWorkspace,
      challengeWorkspace no puede enviarle actions a pilas-blocky.
      Esto es lo mas que puedo hacer para evitar un refactor
      gigante.
    */
    this.set('exerciseWorkspace', this.get('parentView').get('parentView'));
    this.exerciseWorkspace.setPilasBlockly(this);

    this.set('blockly_toolbox', this.toolboxForBlockTypes(this.bloques));
    this.set('blockly_comments', this.get('actividad.puedeComentar'));
    this.set('blockly_disable', this.get('actividad.puedeDesactivar'));
    this.set('blockly_duplicate', this.get('actividad.puedeDuplicar'));
    this.set('initial_workspace', await this.initialWorkspace())

    // Este es un hook para luego agregar a la interfaz
    // el informe deseado al ocurrir un error.
    this.pilasService.on("errorDeActividad", (motivoDelError) => {
      this.set('errorDeActividad', motivoDelError);
    });

    $(window).trigger('resize');
  },

  async initialWorkspace() {
    const savedSolution = await this.pilasBloquesApi.lastSolution(this.modelActividad.id)
    const serializedURLCode = this.codigo && atob(this.codigo)

    return this.addRandomIdToWorkspace(serializedURLCode || savedSolution?.program || this.modelActividad.initialWorkspace)
  },
  /**
   * Adds an id to a block of the XML.
   * This is necessary because the ember-blockly component doesnt update the workspace when the
   * initial workspace is the same as the previous challenge. 
   */
  addRandomIdToWorkspace(workspaceXML) {
    return workspaceXML && (workspaceXML.includes('id=') ?
      workspaceXML.replace(/id="[^"]*"/, `id="${Blockly.utils.genUid()}"`) :
      workspaceXML.replace('<block', `<block id="${Blockly.utils.genUid()}"`))
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

    // This is meant to separate commands from expressions
    // sortedToolbox will put it in the right position
    toolbox.push({ categoryId: 'separator', isSeparator: true });

    return this._toEmberBlocklyToolbox(toolbox);
  },

  groupedByCategories(blockTypes) {
    return this.categoryIdsFor(blockTypes).map(categoryId => ({
      categoryId: categoryId,
      blocks: blockTypes.filter(bt => this._categoryIdFor(bt) === categoryId),
    }))
  },

  categoryIdsFor(blockTypes) {
    return [... new Set(blockTypes.map(bt => this._categoryIdFor(bt)))]
  },

  _categoryIdFor(blockType) {
    return this.blocklyBlock(blockType)?.categoryId || 'uncategorized'
  },

  /*
   * _toEmberBlocklyToolbox(toolbox: Toolbox) => EmberToolbox
   * type Toolbox = ToolboxItem[]
   * type ToolboxItem = BlockType | Separator | Category
   * type Separator = {
   *   categoryId: string,
   *   isSeparator: true
   * }
   * type Category = {
   *   categoryId: string,
   *   custom?: string, // for Blockly Dynamic Categories
   *   blocks?: BlockType[],
   * }
   * 
   * 
   * type EmberToolbox = EmberToolboxItem[]
   * type EmberToolboxItem = BlockType | EmberSeparator | EmberCategory
   * type BlockType = string
   * type EmberSeparator = {
   *    isSeparator: true // always
   * } 
   * type EmberCategory = {
   *   category?: string, // printable category name
   *   custom?: string, // for Blockly Dynamic Categories
   *   blocks?: BlockType[],
   *   isSeparator: false // always false for categories
   * }
   */
  _toEmberBlocklyToolbox(toolbox) {
    return this._styledToolbox(this.sortedToolbox(toolbox)).map(
      toolboxItem => this._toEmberBlocklyToolboxItem(toolboxItem)
    )
  },

  _toEmberBlocklyToolboxItem(toolboxItem) {
    if (typeof toolboxItem === "string") return toolboxItem

    if (toolboxItem.isSeparator) {
      const emberSeparator = { ...toolboxItem }
      delete emberSeparator.categoryId
      return emberSeparator
    }

    const emberBlocklyToolboxItem = { category: this.intl.t(`blocks.categories.${toolboxItem.categoryId}`).toString(), ...toolboxItem }
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
    if (this._areCategoriesRequiredInToolbox()) return toolbox

    return toolbox.flatMap(toolboxItem => {
      if (toolboxItem.isSeparator || !toolboxItem.categoryId) return [toolboxItem]
      return toolboxItem.blocks
    })
  },

  _areCategoriesRequiredInToolbox() {
    return this.modelActividad.get('estiloToolbox') !== "sinCategorias";
  },

  /**
   * Orders the toolbox (usually categories) by Pilas Bloques stablished order.
   * @param {*} toolbox
   */
  sortedToolbox(toolbox) {
    const desiredOrder = [ // Categories initial order.
      'primitives',
      'myProcedures',
      'repetitions',
      'alternatives',
      'variables',
      'separator',
      'values',
      'sensors',
      'operators',
      'myFunctions',
      'uncategorized'
    ];

    return [...toolbox].sort((cat1, cat2) => desiredOrder.indexOf(cat1.categoryId) - desiredOrder.indexOf(cat2.categoryId))
  },

  /**
   * Obtains a Blockly block from a block type
   *
   * TODO: Move to ember-blockly. It belongs to blockly service.
   */
  blocklyBlock(blockType) {
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
        
      if (this.pilasService.estaResueltoElProblema() && this.shouldOpenEndModal) {
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
    return this.pilasBloquesApi.runProgram(this.modelActividad.id, { program: this.codigoActualEnFormatoXML, ast: this.pilasMulang.parseAll(Blockly.mainWorkspace), turboModeOn: this.pilasService.modoTurboEstaActivado(), staticAnalysis: this.staticAnalysis() })
  },

  executionFinishedEvent(solutionId, executionResult) {
    run(this, function () {
      this.pilasBloquesApi.executionFinished(solutionId, {
        isTheProblemSolved: this.pilasService.estaResueltoElProblema(),
        ...executionResult
      })
    })
  },

  showExpectationFeedback() {
    this.get('failedExpects').forEach(({ declaration, description }, i) =>
      addWarning(declarationWithName(declaration), description, -i)// TODO: Add priority?
    )
  },

  runValidations() {
    clearValidations()
    this.set('expects', this.pilasMulang.analyze(Blockly.mainWorkspace, this.modelActividad))
    this.showExpectationFeedback()
    Blockly.Events.fireRunCode()
  },
  
  javascriptCode() {
    // This should be EmberBlockly's responsibility. 
    // But that component's javascriptCode often won't get updated soon enough and tests will fail. See https://github.com/Program-AR/pilas-bloques/pull/878
    return Blockly.MyLanguage.workspaceToCode(Blockly.getMainWorkspace())
  },

  actions: {

    async ejecutar(pasoAPaso = false) {
      const analyticsSolutionId = this.runProgramEvent()
      await this.pilasService.restartScene()
      this.runValidations()

      if (!this.shouldExecuteProgram()) return;

      // Permite obtener el código xml al momento de ejecutar. Se utiliza
      // cuando se accede a la ruta curso/alumno para guardar la solución
      // del usuario en cada momento de ejecución.
      if (this.cuandoEjecuta) {
        let codigo_xml = this.codigoActualEnFormatoXML;
        this.cuandoEjecuta(codigo_xml);
      }

      let factory = this.interpreterFactory;
      let interprete = factory.crearInterprete(this.javascriptCode(), (bloqueId) => this.highlighter.step(bloqueId));

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

    async reiniciar() {
      this.clearHighlight()
      this.set('ejecutando', false);
      this.exerciseWorkspace.set('ejecutando', false);
      this.set('terminoDeEjecutar', false);
      this.exerciseWorkspace.set('terminoDeEjecutar', false);
      this.set('errorDeActividad', null);
      await this.pilasService.restartScene();
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
      if (this.isDestroyed) return;
      this.set('codigoActualEnFormatoXML', xml)
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
