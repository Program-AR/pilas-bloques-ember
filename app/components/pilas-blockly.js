/* jshint ignore:start */
import { computed } from '@ember/object'
import { run } from '@ember/runloop'
import { inject as service } from '@ember/service'
import Component from '@ember/component'
import { addError, addWarning, clearValidations, declarationWithName, getNestedControlStructureBlocks } from '../utils/blocks'
import { isCritical, warningInControlStructureBlock, notCritical } from '../utils/expectations'


export default Component.extend({
  classNames: 'pilas-blockly',
  ejecutando: false,
  terminoDeEjecutar: false,
  engineError: null,
  cola_deshacer: [],
  data_observar_blockly: false,
  actividad: null,
  interpreterFactory: service(),
  solucion: null,
  pilasService: service('pilas'),
  codigoJavascript: "", // Se carga como parametro
  codigo: null,
  challenge: null,

  highlighter: service(),
  availableBlocksValidator: service(),
  pilasBloquesApi: service(),
  pilasMulang: service(),
  experiments: service(),

  expects: [],
  codigoActualEnFormatoXML: '',     // se actualiza automáticamente al modificar el workspace.

  staticAnalysisError: '',

  anterior_ancho: -1,
  anterior_alto: -1,

  blockly_toolbox: [{
    categoryId: '...',
    blocks: []
  }],

  pausadoEnBreakpoint: false,

  javascriptCode: null,
  intl: Ember.inject.service(),
  expectsScoring: service('expects-scoring'),

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

    this.set('blockly_toolbox', this.toolboxForBlockTypes(this.challenge.bloques));
    this.set('blockly_comments', this.get('actividad.puedeComentar'));
    this.set('blockly_disable', this.get('actividad.puedeDesactivar'));
    this.set('blockly_duplicate', this.get('actividad.puedeDuplicar'));
    this.set('initial_workspace', await this.initialWorkspace())

    // Este es un hook para luego agregar a la interfaz
    // el informe deseado al ocurrir un error.
    this.pilasService.on("error", ({ error }) => {
      this.set('engineError', error);
    });

    $(window).trigger('resize');
  },

  async initialWorkspace() {
    const savedSolution = await this.pilasBloquesApi.lastSolution(this.challenge.id)
    const serializedURLCode = this.codigo && atob(this.codigo)

    return serializedURLCode || savedSolution?.program || this.challenge.initialWorkspace
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
    return this.groupByCategories(blockTypes.map(bt => this.toolboxBlock(bt)))
  },

  toolboxBlock(blockType) {
    const toolboxBlock = {
      categoryId: this._categoryIdFor(blockType),
      blocks: [blockType]
    }
    const blocklyBlock = this.blocklyBlock(blockType)
    if (blocklyBlock?.categoria_custom) toolboxBlock.custom = blocklyBlock.categoria_custom
    return toolboxBlock
  },

  groupByCategories(toolboxBlocks) {
    const groupedBlocks = []
    toolboxBlocks.forEach(tb => {
      const match = groupedBlocks.find(gb => gb.categoryId === tb.categoryId)
      if (match) {
        match.blocks.push(...tb.blocks)
        if (tb.custom) match.custom = tb.custom  //Last one takes precedence
      }
      else {
        groupedBlocks.push(tb)
      }
    })

    return groupedBlocks
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
    return this.challenge.get('estiloToolbox') !== "sinCategorias";
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

        // Si se produce un error en la actividad se termina de ejecutar el intérprete. Ya sea esperado o inesperado
        if (this.engineError) { // Se settea ante evento de Pilas
          success({ error: this.engineError });
          // TODO: this produces an empty error in the executionResult when the error is not an instance of ActividadError
          // We need to copy engineError slots to a new object and return the copy
          // https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify
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

      if (this.engineError) {
        if (this.onEngineError) this.onEngineError(this.engineError)
        return;
      }

      if (this.onTerminoEjecucion)
        this.onTerminoEjecucion()

      if (this.pilasService.estaResueltoElProblema()) this.experiments.updateSolvedChallenges(this.challenge)

      this.send('showEndModal')

      if (this.ejecutando) {
        this.set('ejecutando', false);
        this.exerciseWorkspace.set('ejecutando', false);
        this.set('terminoDeEjecutar', true);
        this.exerciseWorkspace.set('terminoDeEjecutar', true);
        this.clearHighlight();
      }
    });
  },

  clearHighlight() {
    this.highlighter.clear()
  },

  shouldExecuteProgram() {
    return Blockly.mainWorkspace.getTopBlocks()
      .filter(block => !block.disabled)
      .every(block => Blockly.shouldExecute(block))
      && this.thereAreNoErrors()
  },

  thereAreNoErrors() {
    return this.enabledBlocks()
      .concat(this.get('failedExpects'))
      .every(failable => !failable.hasError())
  },

  enabledBlocks() {
    return Object.values(Blockly.getMainWorkspace().blockDB_)
      .filter(block => !block.disabled)
  },

  staticAnalysis() {
    return {
      couldExecute: this.shouldExecuteProgram(),
      allExpectResults: this.persistableExpectsResults(this.get('expects')),
      score: {
        expectResults: this.scoredExpectsResults(),
        percentage: this.expectsScoring.totalScore(this.get('expects'), this.challenge)
      },
      error: this.get('staticAnalysisError')
    }
  },

  persistableExpectsResults(expects) {
    const deletableProperties = ["description", "isForControlGroup", "isSuggestion", "isScoreable", "limit", "isRelatedToUsage", "isCritical"]
    return expects.map(e => {
      const expect = { ...e }
      deletableProperties.forEach(p => delete expect[p])
      return expect
    })
  },

  scoredExpectsResults() {
    return this.expectsScoring.resultsIncludingUnusedExpects(this.get('expects'), this.challenge).reduce((expectsObj, expect) => ({ ...expectsObj, [expect.id]: expect.result }), {})
  },

  runProgramEvent() {
    return this.pilasBloquesApi.runProgram(this.challenge.id, { program: this.codigoActualEnFormatoXML, ast: this.pilasMulang.parseAll(Blockly.mainWorkspace), turboModeOn: this.pilasService.modoTurboEstaActivado(), staticAnalysis: this.staticAnalysis() })
  },

  executionFinishedEvent(solutionId, executionResult) {
    run(this, function () {
      this.pilasBloquesApi.executionFinished(solutionId, this.staticAnalysis(), {
        isTheProblemSolved: this.pilasService.estaResueltoElProblema(),
        ...executionResult
      })
    })
  },

  showBlocksWarningExpectationFeedback() {
    this.showExpectationFeedbackFor(
      notCritical,
      addWarning
    )

    this.showExpectationFeedbackFor(
      warningInControlStructureBlock,
      addWarning,
      getNestedControlStructureBlocks
    )
  },

  showBlocksErrorExpectationFeedback() {
    this.showExpectationFeedbackFor(
      isCritical,
      addError
    )
  },

  showExpectationFeedbackFor(condition, addFeedback, getBlocks = (n) => [declarationWithName(n)]) {
    this.get('failedExpects')
      .filter(condition)
      .forEach(({ declaration, description }, i) => {
        getBlocks(declaration)
          .forEach(block => addFeedback(block, description.asSuggestion, -i))
      })
  },


  async runValidations() {
    this.set('staticAnalysisError', '')

    try {
      clearValidations()
      this.set('expects', await this.pilasMulang.analyze(Blockly.mainWorkspace, this.challenge))
      // Order is important. Warnings should be added first. This way, if errors appear, warning bubbles will be painted red.
      if (this.experiments.shouldShowBlocksWarningExpectationFeedback()) this.showBlocksWarningExpectationFeedback()
      this.showBlocksErrorExpectationFeedback()
      Blockly.Events.fireRunCode()
    } catch (e) {
      console.log(e)
      this.set('staticAnalysisError', e.toString())
    }
  },

  javascriptCode() {
    // This should be EmberBlockly's responsibility. 
    // But that component's javascriptCode often won't get updated soon enough and tests will fail. See https://github.com/Program-AR/pilas-bloques/pull/878
    return Blockly.MyLanguage.workspaceToCode(Blockly.getMainWorkspace())
  },

  shouldShowCongratulationsModal() {
    return this.experiments.shouldShowCongratulationsModal(this.challenge)
  },

  actions: {

    async ejecutar(pasoAPaso = false) {
      await this.pilasService.restartScene()

      await this.runValidations()

      const analyticsSolutionId = this.runProgramEvent()

      if (!this.shouldExecuteProgram()) return;

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
      this.set('engineError', null);
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
      this.availableBlocksValidator.disableNotAvailableBlocksInWorkspace(this.challenge.bloques)
    },

    showEndModal() {
      const isOpen = this.pilasService.estaResueltoElProblema() && this.challenge.get('hasAutomaticGrading')
      this.set('isEndModalOpen', isOpen);
    },

    hideEndModal() {
      this.set('isEndModalOpen', false);
    },

    /**
     * This function bypasses EmberBlockly's responsibility
     * Because changing initial_workspace here doesn't do the trick.
     * @param {*} workspaceXML
     */
    setWorkspace(workspaceXML) {
      var xml = Blockly.Xml.textToDom(workspaceXML);

      if (Blockly.mainWorkspace) {
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(xml, Blockly.getMainWorkspace());
      }
    },
  },


});
/* jshint ignore:end */
