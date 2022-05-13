import { later } from '@ember/runloop'
import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import { pilasMock, interpreterFactoryMock, interpreteMock, actividadMock, blocklyWorkspaceMock, componentMock, activityExpectationsMock } from '../../helpers/mocks'
import { findBlockByTypeIn, assertProps, assertWarning, assertNotWarning, assertHasProps, setUpTestLocale } from '../../helpers/utils'
import { declaresAnyProcedure, doesNotUseRecursionId } from '../../../utils/expectations'
import sinon from 'sinon'
import { settled } from '@ember/test-helpers';

module('Unit | Components | pilas-blockly', function (hooks) {
  setupTest(hooks)
  setUpTestLocale(hooks)

  hooks.beforeEach(function () {
    this.owner.register('service:interpreterFactory', interpreterFactoryMock)
    this.owner.register('service:activityExpectations', activityExpectationsMock)
    this.owner.register('service:pilas', pilasMock)
    this.owner.lookup('service:highlighter').workspace = blocklyWorkspaceMock()
    this.owner.lookup('service:blocksGallery').start()

    this.ctrl = this.owner.factoryFor('component:pilas-blockly').create()
    this.ctrl.set('challenge', actividadMock)
    this.ctrl.set('exerciseWorkspace', componentMock)
    this.ctrl.set('pilasBloquesApi', sinon.stub(this.ctrl.pilasBloquesApi))
    sinon.resetHistory()
  })

  //TODO: Ver de agrupar en modules
  test('Al ejecutar se encuentra ejecutando y ejecuta el intérprete', async function (assert) {
    this.ctrl.send('ejecutar')
    await settled()

    assert.notOk(this.ctrl.get('pausadoEnBreakpoint'))
    assert.ok(interpreteMock.run.called)
  })

  test('Ejecutar paso a paso bloquea la ejecución', async function (assert) {
    this.ctrl.send('ejecutar', true)
    await settled()

    later(() => {
      assert.ok(interpreteMock.run.calledOnce)
      assert.ok(this.ctrl.get('pausadoEnBreakpoint'))
    })

  })

  test('Step desbloquea el breakpoint', async function (assert) {
    this.ctrl.send('ejecutar', true)
    await settled()

    later(() => {
      assert.ok(this.ctrl.get('pausadoEnBreakpoint'))
      this.ctrl.send('step')
      assert.notOk(this.ctrl.get('pausadoEnBreakpoint'))
    })

  })

  test('Luego de ejecutar termina de ejecutar', async function (assert) {
    this.ctrl.send('ejecutar')
    await settled()

    later(() => {
      assert.notOk(this.ctrl.get('ejecutando'))
      assert.ok(this.ctrl.get('terminoDeEjecutar'))
    })

  })

  test('Al resolver el problema muestra el fin del desafío', async function (assert) {
    this.ctrl.send('ejecutar')
    await settled()
    later(() => {
      assert.ok(this.ctrl.get('isEndModalOpen'))
    })
  })

  test('Al resolver el problema con expectativas fallidas', async function (assert) {
    Blockly.textToBlock(filledProgram)
    this.owner.lookup('service:activityExpectations').expectations = declaresAnyProcedure
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

  test('Al reiniciar settea flags y reinicia la escena de pilas', async function (assert) {
    this.ctrl.send('reiniciar')
    await settled()
    assert.notOk(this.ctrl.get('ejecutando'))
    assert.notOk(this.ctrl.get('terminoDeEjecutar'))
    assert.notOk(this.ctrl.get('errorDeActividad'))
    assert.ok(this.owner.lookup('service:pilas').restartScene.called)
  })


  // PROGRAM EXECUTION
  let filledProgram =
    `<block type="al_empezar_a_ejecutar">
      <statement name="program">
        <block type="MoverACasillaDerecha">
        </block>
      </statement>
    </block>`

  let nonFilledProgram =
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

  test('Ejecuta cuando todos los bloques están completos', async function (assert) {
    Blockly.textToBlock(filledProgram)
    this.ctrl.send('ejecutar')
    await settled()
    assert.ok(interpreteMock.run.called)
  })

  test('No ejecuta cuando el programa tiene algún agujero', async function (assert) {
    Blockly.textToBlock(nonFilledProgram)
    this.ctrl.send('ejecutar')
    await settled()
    assert.notOk(interpreteMock.run.called)
  })

  test('Ejecuta cuando existe algún bloque con agujeros pero no se usa', async function (assert) {
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

  test('Ejecuta aún cuando existe procedimiento vacío', async function (assert) {
    Blockly.textToBlock(emptyProcedure)
    this.ctrl.send('ejecutar')
    await settled()
    assert.ok(interpreteMock.run.called)
  })

  test('Ejecuta aún cuando existe procedimiento vacío con parámetros', async function (assert) {
    Blockly.textToBlock(emptyProcedureWithParam)
    this.ctrl.send('ejecutar')
    await settled()
    assert.ok(interpreteMock.run.called)
  })

  test('No ejecuta cuando existe procedimiento con algún agujero', async function (assert) {
    Blockly.textToBlock(nonFilledProcedure)
    this.ctrl.send('ejecutar')
    await settled()
    assert.notOk(interpreteMock.run.called)
  })

  test('Al ejecutar aparecen los warnings de bloques vacíos', async function (assert) {
    let program = Blockly.textToBlock(nonFilledProgram)
    let required = findBlockByTypeIn(program, "required_statement")
    assertNotWarning(assert, required)
    this.ctrl.send('ejecutar')
    await settled()
    later(() => assertWarning(assert, required, "¡Acá faltan bloques comandos!"))
  })

  // API
  test('Avisa a la api al ejecutar', async function (assert) {
    this.ctrl.send('ejecutar')
    await settled()
    const staticAnalysis = this.ctrl.pilasBloquesApi.runProgram.lastCall.lastArg.staticAnalysis
    assertProps(assert, staticAnalysis, { couldExecute: true })
  })

  test('Envia metadata a la api al ejecutar', async function (assert) {
    Blockly.textToBlock(filledProgram)
    this.ctrl.send('onChangeWorkspace', filledProgram) // Fire property change :(
    this.ctrl.send('ejecutar')
    const metadata = this.ctrl.pilasBloquesApi.runProgram.lastCall.lastArg
    await settled()
    assertHasProps(assert, metadata, 'ast', 'staticAnalysis', 'turboModeOn', 'program')
    assert.deepEqual(metadata.staticAnalysis, {
      couldExecute: true,
      expects: [],
    })
  })

  test('Avisa a la api al finalizar la ejecucion', async function (assert) {
    this.ctrl.send('ejecutar')
    await settled()
    later(() => {
      assertProps(assert, this.ctrl.pilasBloquesApi.executionFinished.lastCall.lastArg, { finished: true })
    })
  })

  test('Avisa a la api al finalizar la ejecucion con error', async function (assert) {
    this.ctrl.errorDeActividad = "ERROR"
    this.ctrl.send('ejecutar')
    await settled()
    later(() => {
      assertProps(assert, this.ctrl.pilasBloquesApi.executionFinished.lastCall.lastArg, { error: "ERROR" })
    })
  })

  test('Envia metadata a la api al ejecutar', async function (assert) {
    this.ctrl.send('ejecutar')
    const metadata = this.ctrl.pilasBloquesApi.runProgram.lastCall.lastArg
    await settled()
    assertHasProps(assert, metadata, 'ast', 'staticAnalysis', 'turboModeOn',)
    assert.ok(metadata.program || metadata.program.length === 0)
  })

  test('should execute program if all expectations passed', function (assert) {
    this.ctrl.set('expects', [{ id: 'is_used', description: "Is used", result: true, declaration: 'block_id' }])
    assert.ok(this.ctrl.shouldExecuteProgram())
  })

  test('should execute program if any non critical exceptation fails', function (assert) {
    this.ctrl.set('expects', [{ id: 'is_used', description: "Is used", result: false, declaration: 'block_id' }])
    assert.ok(this.ctrl.shouldExecuteProgram())
  })

  test('should not execute program if any critical exceptation fails', function (assert) {
    this.ctrl.set('expects', [{ id: doesNotUseRecursionId, description: "Does not use recursion", result: false, declaration: 'block_id' }])
    assert.notOk(this.ctrl.shouldExecuteProgram())
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

})
