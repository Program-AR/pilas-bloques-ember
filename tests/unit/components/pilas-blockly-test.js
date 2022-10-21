import { later } from '@ember/runloop'
import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import { pilasMock, interpreterFactoryMock, interpreteMock, actividadMock, blocklyWorkspaceMock, componentMock, challengeExpectationsMock, experimentsMock, challengeWithExpectationsMock, idsToExpectationsMock } from '../../helpers/mocks'
import { findBlockByTypeIn, assertProps, assertWarning, assertNotWarning, assertHasProps, setUpTestLocale } from '../../helpers/utils'
import { usesSimpleRepetition, doesNotUseRecursionId } from '../../../utils/expectations'
import sinon from 'sinon'
import { settled } from '@ember/test-helpers';

module('Unit | Components | pilas-blockly', function (hooks) {
  setupTest(hooks)
  setUpTestLocale(hooks)

  hooks.beforeEach(function () {
    this.owner.register('service:interpreterFactory', interpreterFactoryMock)
    this.owner.register('service:pilas', pilasMock)
    this.owner.register('service:experiments', experimentsMock)
    this.owner.lookup('service:highlighter').workspace = blocklyWorkspaceMock()
    this.owner.lookup('service:blocksGallery').start()

    this.ctrl = this.owner.factoryFor('component:pilas-blockly').create()

    this.ctrl.set('exerciseWorkspace', componentMock)
    this.ctrl.set('pilasBloquesApi', sinon.stub(this.ctrl.pilasBloquesApi))
    sinon.resetHistory()
  })

  const filledProgram =
    `<block type="al_empezar_a_ejecutar">
    <statement name="program">
      <block type="MoverACasillaDerecha">
      </block>
    </statement>
    </block>`

  const nonFilledProgram =
    `<block type="al_empezar_a_ejecutar">
    <statement name="program">
      <block type="repetir">
        <value name="count">
          <block type="math_number">
            <field name="NUM">10</field>
          </block>
        </value>
      </block>
    </statement>
    </block>`

  test('On restarting should set flags and restart pilas scene', async function (assert) {
    this.ctrl.send('reiniciar')
    await settled()
    assert.notOk(this.ctrl.get('ejecutando'))
    assert.notOk(this.ctrl.get('terminoDeEjecutar'))
    assert.notOk(this.ctrl.get('engineError'))
    assert.ok(this.owner.lookup('service:pilas').restartScene.called)
  })

  test("setWorkspace replaces Blockly's workspace", function (assert) {
    const initialWorkspaceXml =
      `<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\"></shadow></statement></block></xml>`
    Blockly.textToBlock(filledProgram)
    this.ctrl.send('setWorkspace', initialWorkspaceXml)

    const xmlAfterSetWorkspace = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)

    const xmlAfterSetWorkspaceWithoutId = Blockly.Xml.domToText(xmlAfterSetWorkspace).replace(/ id="[^"]*"/g, "")

    assert.equal(initialWorkspaceXml, xmlAfterSetWorkspaceWithoutId)
  })

  module('pilas-blockly | execution', function (hooks) {

    hooks.beforeEach(function () {
      this.ctrl.set('challenge', actividadMock)
      this.owner.register('service:challengeExpectations', challengeExpectationsMock)
    })

    test('On running should be running and run the interpreter', async function (assert) {
      this.ctrl.send('ejecutar')
      await settled()

      assert.notOk(this.ctrl.get('pausadoEnBreakpoint'))
      assert.ok(interpreteMock.run.called)
    })

    test('Running step by step should pause the run on a breakpoint', async function (assert) {
      this.ctrl.send('ejecutar', true)
      await settled()

      later(() => {
        assert.ok(interpreteMock.run.calledOnce)
        assert.ok(this.ctrl.get('pausadoEnBreakpoint'))
      })

    })

    test('Stepping should unpause the breakpoint', async function (assert) {
      this.ctrl.send('ejecutar', true)
      await settled()

      later(() => {
        assert.ok(this.ctrl.get('pausadoEnBreakpoint'))
        this.ctrl.send('step')
        assert.notOk(this.ctrl.get('pausadoEnBreakpoint'))
      })

    })

    test('After running should finish running', async function (assert) {
      this.ctrl.send('ejecutar')
      await settled()

      later(() => {
        assert.notOk(this.ctrl.get('ejecutando'))
        assert.ok(this.ctrl.get('terminoDeEjecutar'))
      })

    })
  })

  module('pilas-blockly | programs-with-holes-execution', function (hooks) {

    hooks.beforeEach(function () {
      this.ctrl.set('challenge', actividadMock)
      this.owner.register('service:challengeExpectations', challengeExpectationsMock)
    })

    test('A filled program should run', async function (assert) {
      Blockly.textToBlock(filledProgram)
      this.ctrl.send('ejecutar')
      await settled()
      assert.ok(interpreteMock.run.called)
    })

    test('A non filled program should not run', async function (assert) {
      Blockly.textToBlock(nonFilledProgram)
      this.ctrl.send('ejecutar')
      await settled()
      assert.notOk(interpreteMock.run.called)
    })

    test('A program with unused non filled blocks should run', async function (assert) {
      let bloqueSuelto = `    
    <block type="repetir" disabled="true">
      <value name="count">
        <block type="math_number">
          <field name="NUM">10</field>
        </block>
      </value>
    </block>
    `

      Blockly.textToBlock(filledProgram)
      Blockly.textToBlock(bloqueSuelto)
      this.ctrl.send('ejecutar')
      await settled()
      assert.ok(interpreteMock.run.called)
    })

    let emptyProcedure =
      `<block type="procedures_defnoreturn">
    <field name="NAME">Hacer algo</field>
    </block>`

    let emptyProcedureWithParam =
      `<block type="procedures_defnoreturn">
    <mutation>
      <arg name="parámetro 1"></arg>
    </mutation>
    <field name="NAME">Hacer algo</field>
    <field name="ARG0">parámetro 1</field>
    <statement name="STACK">
      <shadow type="required_statement"></shadow>
    </statement>
    </block>`

    let nonFilledProcedure =
      `<block type="procedures_defnoreturn">
      <field name="NAME">Hacer algo</field>
      <statement name="STACK">
        <block type="GirarGrados">
          <value name="grados">
            <shadow type="required_value"></shadow>
          </value>
        </block>
      </statement>
    </block>`

    test('A program with empty procedures should run', async function (assert) {
      Blockly.textToBlock(emptyProcedure)
      this.ctrl.send('ejecutar')
      await settled()
      assert.ok(interpreteMock.run.called)
    })

    test('A program with empty procedures with parameters should run', async function (assert) {
      Blockly.textToBlock(emptyProcedureWithParam)
      this.ctrl.send('ejecutar')
      await settled()
      assert.ok(interpreteMock.run.called)
    })

    test('A program with a non filled procedure should not run', async function (assert) {
      Blockly.textToBlock(nonFilledProcedure)
      this.ctrl.send('ejecutar')
      await settled()
      assert.notOk(interpreteMock.run.called)
    })

    test('On running a non filled program should show non filled blocks warning', async function (assert) {
      let program = Blockly.textToBlock(nonFilledProgram)
      let required = findBlockByTypeIn(program, "required_statement")
      assertNotWarning(assert, required)
      this.ctrl.send('ejecutar')
      await settled()
      later(() => assertWarning(assert, required, "¡Acá faltan bloques comandos!"))
    })
  })

  module('pilas-blockly | execution-with-expects', function (hooks) {

    hooks.beforeEach(function () {
      this.ctrl.set('challenge', actividadMock)
      this.owner.register('service:challengeExpectations', challengeExpectationsMock)
    })

    test('should execute program if all expectations passed', function (assert) {
      this.ctrl.set('expects', [{ id: 'is_used', description: "Is used", result: true, declaration: 'block_id' }])
      assert.ok(this.ctrl.shouldExecuteProgram())
    })

    test('should execute program if there are no errors', function (assert) {
      this.ctrl.set('expects', [{ id: 'is_used', description: "Is used", result: false, declaration: 'block_id', hasError() { return false } }])
      assert.ok(this.ctrl.shouldExecuteProgram())
    })

    test('should not execute program if there are errors', function (assert) {
      this.ctrl.set('expects', [{ id: doesNotUseRecursionId, description: "Does not use recursion", result: false, declaration: 'block_id', isCritical: true, hasError() { return true } }])
      assert.notOk(this.ctrl.shouldExecuteProgram())
    })

    test('Al resolver el problema con expectativas fallidas', async function (assert) { 
      Blockly.textToBlock(filledProgram)
      this.owner.lookup('service:challengeExpectations').expectations = usesSimpleRepetition
      this.ctrl.send('ejecutar')
      await settled()
      later(() => {
        assert.notOk(this.ctrl.get('allExpectsPassed'))
      })
    })

    test('Al resolver el problema sin expectativas fallidas', async function (assert) {
      this.ctrl.send('ejecutar')
      await settled()
      later(() => {
        assert.ok(this.ctrl.get('allExpectsPassed'))
      })
    })
  })

  module('pilas-blockly | execution-with-blocks-errors', function () {

    test('should execute program if enabled blocks have no errors', function (assert) {
      const xmlWorkspace = "<xml><variables></variables><block type=\"al_empezar_a_ejecutar\" id=\"|U)5+na!D;9STcTQQz.K\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"383\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\" id=\"e%]$z2Vs,fU50xT}U78h\"></shadow><block type=\"MoverACasillaDerecha\" id=\"{q9{V=,$o,yvDJ`TmuEf\"><next><block type=\"EscribirTextoDadoEnOtraCuadricula\" id=\"tD=)qkbk1t|l{/RA?tTo\"><field name=\"texto\">g</field></block></next></block></statement></block></xml>"
      this.ctrl.send('setWorkspace', xmlWorkspace)
      assert.ok(this.ctrl.shouldExecuteProgram())
    })

    test('should execute program if any disabled block has errors', function (assert) {
      const xmlWorkspace = "<xml><variables></variables><block type=\"al_empezar_a_ejecutar\" id=\"|U)5+na!D;9STcTQQz.K\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"383\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\" id=\"e%]$z2Vs,fU50xT}U78h\"></shadow><block type=\"MoverACasillaDerecha\" id=\"{q9{V=,$o,yvDJ`TmuEf\"></block></statement></block><block type=\"EscribirTextoDadoEnOtraCuadricula\" id=\"tD=)qkbk1t|l{/RA?tTo\" disabled=\"true\" x=\"776\" y=\"107\"><field name=\"texto\"></field></block></xml>"
      this.ctrl.send('setWorkspace', xmlWorkspace)
      assert.ok(this.ctrl.shouldExecuteProgram())
    })

    test('should not execute program if any enabled block has errors', function (assert) {
      const xmlWorkspace = "<xml><variables></variables><block type=\"al_empezar_a_ejecutar\" id=\"|U)5+na!D;9STcTQQz.K\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"383\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\" id=\"e%]$z2Vs,fU50xT}U78h\"></shadow><block type=\"MoverACasillaDerecha\" id=\"{q9{V=,$o,yvDJ`TmuEf\"><next><block type=\"EscribirTextoDadoEnOtraCuadricula\" id=\"tD=)qkbk1t|l{/RA?tTo\"><field name=\"texto\"></field></block></next></block></statement></block></xml>"
      this.ctrl.send('setWorkspace', xmlWorkspace)
      assert.notOk(this.ctrl.shouldExecuteProgram())
    })
  })

  module('pilas-blockly | end-modal', function (hooks) {

    hooks.beforeEach(function () {
      this.ctrl.set('challenge', actividadMock)
      this.owner.register('service:challengeExpectations', challengeExpectationsMock)
    })

    test('On solving a challenge should show finished challenge modal', async function (assert) {
      this.ctrl.send('ejecutar')
      await settled()
      later(() => {
        assert.ok(this.ctrl.get('isEndModalOpen'))
      })
    })

  })


  module('pilas-blockly | expectation-feedback-bubbles', function (hooks) {
    let experimentsMock
    hooks.beforeEach(function () {
      this.ctrl.set('challenge', challengeWithExpectationsMock)
      experimentsMock = this.owner.lookup('service:experiments')
      this.owner.lookup('service:challengeExpectations').idsToExpectations = idsToExpectationsMock
    })

    const failingExpectationsProgram =
      `<block type="al_empezar_a_ejecutar">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaIzquierda"></block>
          </next>
        </block>
      </statement>
    </block>`

    const blockFromProgram = (program) => {
      const block = Blockly.textToBlock(program)
      return findBlockByTypeIn(block, "al_empezar_a_ejecutar")
    }

    const colourFromBlock = (block) => block.warning.bubble_.bubbleBack_.getAttribute('fill')

    test('Should show expectation feedback bubbles when required by experiments', async function (assert) {
      experimentsMock.setShouldShowBlocksWarningExpectationFeedback(true)

      this.ctrl.send('ejecutar')
      const required = blockFromProgram(failingExpectationsProgram)
      await settled()
      later(() => assertWarning(assert, required, '¿Tu programa anda a veces sí y a veces no?'))
    })

    test('Should not show expectation feedback bubbles when not required by experiments', async function (assert) {
      experimentsMock.setShouldShowBlocksWarningExpectationFeedback(false)

      this.ctrl.send('ejecutar')
      const required = blockFromProgram(failingExpectationsProgram)
      await settled()
      later(() => assertNotWarning(assert, required))
    })

    test('Feedback bubbles should keep their colour after hiding them', async function (assert) {
      experimentsMock.setShouldShowBlocksWarningExpectationFeedback(true)

      this.ctrl.send('ejecutar')
      const required = blockFromProgram(failingExpectationsProgram)
      await settled()
      later(() => {
        const initialColour = colourFromBlock(required)
        required.warning.setVisible(false)
        required.warning.setVisible(true)
        const colourAfterHiding = colourFromBlock(required)
        assert.equal(colourAfterHiding, initialColour)
      })
    })
  })

  module('pilas-blockly | API', function (hooks) {

    hooks.beforeEach(function () {
      this.ctrl.set('challenge', actividadMock)
      this.owner.register('service:challengeExpectations', challengeExpectationsMock)
    })

    test('On running should send to the API', async function (assert) {
      this.ctrl.send('ejecutar')
      await settled()
      const staticAnalysis = this.ctrl.pilasBloquesApi.runProgram.lastCall.lastArg.staticAnalysis
      assertProps(assert, staticAnalysis, { couldExecute: true })
    })

    test('On running should send the metadata to the API', async function (assert) {
      Blockly.textToBlock(filledProgram)
      this.ctrl.send('onChangeWorkspace', filledProgram) // Fire property change :(
      this.ctrl.send('ejecutar')
      await settled()
      const metadata = this.ctrl.pilasBloquesApi.runProgram.lastCall.lastArg
      assertHasProps(assert, metadata, 'ast', 'staticAnalysis', 'turboModeOn', 'program')
      assert.deepEqual(metadata.staticAnalysis, {
        couldExecute: true,
        allExpectResults: [],
        score: {
          expectResults: {solution_works: true},
          percentage: 100
        },
        error: ''
      })
    })

    test('On finished run should send to the API', async function (assert) {
      this.ctrl.send('ejecutar')
      await settled()
      later(() => {
        assertProps(assert, this.ctrl.pilasBloquesApi.executionFinished.lastCall.lastArg, { finished: true })
      })
    })

    test('On finishing run with an error should send to the API', async function (assert) {
      this.ctrl.engineError = {message: "ERROR"}
      this.ctrl.send('ejecutar')
      await settled()
      later(() => {
        assertProps(assert, this.ctrl.pilasBloquesApi.executionFinished.lastCall.lastArg, { error: {message: "ERROR"} })
      })
    })

    test('On running should send the metadata to the API', async function (assert) {
      this.ctrl.send('ejecutar')
      await settled()
      const metadata = this.ctrl.pilasBloquesApi.runProgram.lastCall.lastArg
      assertHasProps(assert, metadata, 'ast', 'staticAnalysis', 'turboModeOn',)
      assert.ok(metadata.program || metadata.program.length === 0)
    })
  })

})

module('Unit | Components | pilas-blockly | ToolboxForBlockTypes', function (hooks) {
  setupTest(hooks)

  const operator = { categoryId: 'operators' }
  const primitive = { categoryId: 'primitives' }

  const separator = { categoryId: 'separator', isSeparator: true }
  const blockId = "A block id"

  const doThis = 'Do this'
  const doThat = 'Do that'

  const myProcedures = { categoryId: 'procedures', blocks: [doThis, doThat] }

  const toolbox = [blockId, myProcedures, separator]

  const emberBlocklySeparator = {
    isSeparator: true
  }

  hooks.beforeEach(function () {
    this.owner.lookup('service:blocksGallery').start()
    this.ctrl = this.owner.factoryFor('component:pilas-blockly').create()
    this.ctrl.set('challenge', actividadMock)
    this.ctrl.challenge.set('estiloToolbox', 'conCategorias')
    this.ctrl.get('intl').setLocale('en-us') // This is necessary because categories are tied to locale and translation.
  })

  function setCategoriesNotRequired(ctrl) {
    ctrl.challenge.set('estiloToolbox', 'sinCategorias')
  }

  test('ToolboxForBlockTypes should fail if blockTypes is undefined', function (assert) {
    assert.throws(() => this.ctrl.toolboxForBlockTypes(undefined))
  })

  test('Toolbox should be sorted based on Pilas Bloques stablished order', function (assert) {
    const alternative = { categoryId: 'alternatives' }
    assert.propEqual(this.ctrl.sortedToolbox([operator, primitive, alternative]), [primitive, alternative, operator])
  })

  test('Uncategorized category should be the last item in the toolbox after sorting', function (assert) {
    const uncategorized = { categoryId: 'uncategorized' }
    assert.propEqual(this.ctrl.sortedToolbox([operator, uncategorized, primitive]), [primitive, operator, uncategorized])
  })

  test('If categories are required in toolbox, it should stay unchanged', function (assert) {
    assert.propEqual(this.ctrl._styledToolbox(toolbox), toolbox)
  })

  test('If categories are not required in toolbox, it should be flattened', function (assert) {
    setCategoriesNotRequired(this.ctrl)
    assert.propEqual(this.ctrl._styledToolbox(toolbox), [blockId, doThis, doThat, separator])
  })

  test('When styling, separators should be left unchanged', function (assert) {
    setCategoriesNotRequired(this.ctrl)
    assert.propEqual(this.ctrl._styledToolbox([separator]), [separator])
  })

  test('When styling, blocks ids should be left unchanged', function (assert) {
    setCategoriesNotRequired(this.ctrl)
    assert.propEqual(this.ctrl._styledToolbox([blockId]), [blockId])
  })

  test('ToolboxForBlockTypes should add one separator', function (assert) {
    assert.equal(
      this.ctrl.toolboxForBlockTypes(['Saludar'])
        .filter(block => block.isSeparator)
        .length,
      1
    )
  })

  test('ToolboxForBlockTypes should add a separator between commands and expressions', function (assert) {
    const moveRight = 'MoverACasillaDerecha'
    const sensor = 'HayObstaculoDerecha'
    const emberBlocklyCommands = {
      category: 'Primitives',
      blocks: [moveRight]
    }
    const emberBlocklySensors = {
      category: 'Sensors',
      blocks: [sensor]
    }
    const emberToolbox = [emberBlocklyCommands, emberBlocklySeparator, emberBlocklySensors]
    assert.propEqual(this.ctrl.toolboxForBlockTypes([sensor, moveRight]), emberToolbox)
  })

  // WARNING: categories are tied to translation.
  test('If a blocktype is not a valid blockly block, is should be uncategorized', function (assert) {
    const nonExistentBlockTypeName = 'NonExistentBlockType'
    const nonExistentEmberBlockly = {
      category: 'Uncategorized',
      blocks: [nonExistentBlockTypeName]
    }
    assert.propEqual(this.ctrl.toolboxForBlockTypes([nonExistentBlockTypeName]), [emberBlocklySeparator, nonExistentEmberBlockly])
  })

  test('ToolboxForBlockTypes should group block types by their category', function (assert) {
    const moveRight = 'MoverACasillaDerecha'
    const moveLeft = 'MoverACasillaIzquierda'
    const repeat = 'Repetir'
    const emberBlocklyPrimitives = {
      category: 'Primitives',
      blocks: [moveRight, moveLeft]
    }
    const emberBlocklyRepetitions = {
      category: 'Repetition',
      blocks: [repeat]
    }
    assert.propEqual(
      this.ctrl.toolboxForBlockTypes([moveRight, repeat, moveLeft]),
      [emberBlocklyPrimitives, emberBlocklyRepetitions, emberBlocklySeparator]
    )
  })

  test('Transformation: _toEmberBlocklyToolboxItem should not change a BlockType', function (assert) {
    const blockType = 'MoverACasillaDerecha'
    assert.propEqual(this.ctrl._toEmberBlocklyToolboxItem(blockType), blockType)
  })

  test('Transformation: Separator to EmberSeparator', function (assert) {
    assert.propEqual(this.ctrl._toEmberBlocklyToolboxItem(separator), emberBlocklySeparator)
  })

  test('Transformation: Category to EmberCategory', function (assert) {
    const moveRight = 'MoverACasillaDerecha'
    const category = {
      categoryId: 'primitives',
      blocks: [moveRight]
    }
    const emberCategory = {
      category: 'Primitives',
      blocks: [moveRight]
    }
    assert.propEqual(this.ctrl._toEmberBlocklyToolboxItem(category), emberCategory)
  })

  test('toolboxBlock without custom category', function (assert) {
    const blockType = 'MoverACasillaDerecha'
    const blockWithoutCustomCategory = {
      categoryId: 'primitives',
      blocks: [blockType]
    }
    assert.propEqual(this.ctrl.toolboxBlock(blockType), blockWithoutCustomCategory)
  })

  test('toolboxBlock with custom category', function (assert) {
    const blockType = 'Procedimiento'
    const blockWithCustomCategory = {
      categoryId: 'myProcedures',
      blocks: [blockType],
      custom: 'PROCEDURE'
    }
    assert.propEqual(this.ctrl.toolboxBlock(blockType), blockWithCustomCategory)
  })

  test('group by categories without custom categories', function (assert) {
    const moveRight = 'MoverACasillaDerecha'
    const moveLeft = 'MoverACasillaIzquierda'
    const repeat = 'Repetir'
    const primitives = 'primitives'
    const repetitions = 'repetitions'
    const moveRightToolboxBlock = {
      categoryId: primitives,
      blocks: [moveRight]
    }
    const moveLeftToolboxBlock = {
      categoryId: primitives,
      blocks: [moveLeft]
    }
    const repeatToolboxBlock = {
      categoryId: repetitions,
      blocks: [repeat]
    }
    const groupedPrimitives = {
      categoryId: primitives,
      blocks: [moveRight, moveLeft]
    }
    const groupedRepetitions = {
      categoryId: repetitions,
      blocks: [repeat]
    }
    assert.propEqual(
      this.ctrl.groupByCategories([moveRightToolboxBlock, moveLeftToolboxBlock, repeatToolboxBlock]),
      [groupedPrimitives, groupedRepetitions]
    )
  })

  test('group by categories with custom categories should prioritize last value', function (assert) {
    const myProcedures = 'myProcedures'
    const aProcedure = 'A procedure'
    const otherProcedure = 'Other procedure'
    const customWithPriority = 'CUSTOM'
    const aProcedureToolboxBlock = {
      categoryId: myProcedures,
      blocks: [aProcedure],
      custom: 'EMPTY'
    }
    const otherProcedureToolboxBlock = {
      categoryId: myProcedures,
      blocks: [otherProcedure],
      custom: customWithPriority
    }
    const groupedBlocks = {
      categoryId: myProcedures,
      blocks: [aProcedure, otherProcedure],
      custom: customWithPriority
    }
    assert.propEqual(
      this.ctrl.groupByCategories([aProcedureToolboxBlock, otherProcedureToolboxBlock]),
      [groupedBlocks]
    )
  })

})
