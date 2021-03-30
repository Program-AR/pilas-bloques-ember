import { later } from '@ember/runloop'
import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import { pilasMock, interpreterFactoryMock, interpreteMock, actividadMock, blocklyWorkspaceMock, componentMock } from '../../helpers/mocks'
import { findBlockByTypeIn, assertProps, assertWarning, assertNotWarning } from '../../helpers/utils'
import sinon from 'sinon'

module('Unit | Components | pilas-blockly', function (hooks) {
  setupTest(hooks)

  hooks.beforeEach(function () {
    this.owner.register('service:interpreterFactory', interpreterFactoryMock)
    this.owner.lookup('service:highlighter').workspace = blocklyWorkspaceMock()
    this.owner.lookup('service:blocksGallery').start()

    this.ctrl = this.owner.factoryFor('component:pilas-blockly').create()
    this.ctrl.pilas = pilasMock //TODO: Injectar como service
    this.ctrl.set('modelActividad', actividadMock)
    this.ctrl.set('exerciseWorkspace', componentMock)
    this.ctrl.set('pilasBloquesApi', sinon.stub(this.ctrl.pilasBloquesApi))
    sinon.resetHistory()
  })

  //TODO: Ver de agrupar en modules
  test('Al ejecutar se encuentra ejecutando y ejecuta el intérprete', function (assert) {
    this.ctrl.send('ejecutar')

    assert.ok(this.ctrl.get('ejecutando'))
    assert.notOk(this.ctrl.get('pausadoEnBreakpoint'))
    assert.ok(interpreteMock.run.called)
  })

  test('Ejecutar paso a paso bloquea la ejecución', function (assert) {
    this.ctrl.send('ejecutar', true)

    later(() => {
      assert.ok(interpreteMock.run.calledOnce)
      assert.ok(this.ctrl.get('pausadoEnBreakpoint'))
    })

  })

  test('Step desbloquea el breakpoint', function (assert) {
    this.ctrl.send('ejecutar', true)

    later(() => {
      assert.ok(this.ctrl.get('pausadoEnBreakpoint'))
      this.ctrl.send('step')
      assert.notOk(this.ctrl.get('pausadoEnBreakpoint'))
    })

  })

  test('Luego de ejecutar termina de ejecutar', function (assert) {
    this.ctrl.send('ejecutar')

    later(() => {
      assert.notOk(this.ctrl.get('ejecutando'))
      assert.ok(this.ctrl.get('terminoDeEjecutar'))
    })

  })

  test('Al resolver el problema muestra el fin del desafío', function (assert) {
    this.ctrl.set('debeMostrarFinDeDesafio', true)
    this.ctrl.send('ejecutar')

    later(() => {
      assert.ok(this.ctrl.get('mostrarDialogoFinDesafio'))
    })

  })

  test('Al reiniciar settea flags y reinicia la escena de pilas', function (assert) {
    this.ctrl.send('reiniciar')
    assert.notOk(this.ctrl.get('ejecutando'))
    assert.notOk(this.ctrl.get('terminoDeEjecutar'))
    assert.notOk(this.ctrl.get('errorDeActividad'))
    assert.ok(pilasMock.reiniciarEscenaCompleta.called)
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

  test('Ejecuta cuando todos los bloques están completos', function (assert) {
    Blockly.textToBlock(filledProgram)
    this.ctrl.send('ejecutar')
    assert.ok(interpreteMock.run.called)
  })

  test('No ejecuta cuando el programa tiene algún agujero', function (assert) {
    Blockly.textToBlock(nonFilledProgram)
    this.ctrl.send('ejecutar')
    assert.notOk(interpreteMock.run.called)
  })

  test('Ejecuta cuando existe algún bloque con agujeros pero no se usa', function (assert) {
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

  test('Ejecuta aún cuando existe procedimiento vacío', function (assert) {
    Blockly.textToBlock(emptyProcedure)
    this.ctrl.send('ejecutar')
    assert.ok(interpreteMock.run.called)
  })

  test('Ejecuta aún cuando existe procedimiento vacío con parámetros', function (assert) {
    Blockly.textToBlock(emptyProcedureWithParam)
    this.ctrl.send('ejecutar')
    assert.ok(interpreteMock.run.called)
  })

  test('No ejecuta cuando existe procedimiento con algún agujero', function (assert) {
    Blockly.textToBlock(nonFilledProcedure)
    this.ctrl.send('ejecutar')
    assert.notOk(interpreteMock.run.called)
  })

  test('Al ejecutar aparecen los warnings de bloques vacíos', function (assert) {
    let program = Blockly.textToBlock(nonFilledProgram)
    let required = findBlockByTypeIn(program, "required_statement")
    assertNotWarning(assert, required)
    this.ctrl.send('ejecutar')
    later(() => assertWarning(assert, required, "¡Acá faltan bloques comandos!"))
  })

  // API
  test('Avisa a la api al ejecutar', function (assert) {
    this.ctrl.send('ejecutar')
    assertProps(assert, this.ctrl.pilasBloquesApi.runProgram.lastCall.lastArg, { couldExecute: true })
  })

  test('Avisa a la api al finalizar la ejecucion', function (assert) {
    this.ctrl.send('ejecutar')
    later(() => {
      assertProps(assert, this.ctrl.pilasBloquesApi.executionFinished.lastCall.lastArg, { finished: true })
    })
  })

  test('Avisa a la api al finalizar la ejecucion con error', function (assert) {
    this.ctrl.errorDeActividad = "ERROR"
    this.ctrl.send('ejecutar')
    later(() => {
      assertProps(assert, this.ctrl.pilasBloquesApi.executionFinished.lastCall.lastArg, { error: "ERROR" })
    })
  })

  test('Se envia la metadata en cada aviso a la api', function (assert) {
    this.ctrl.send('ejecutar')
    const metadata = this.ctrl.pilasBloquesApi.runProgram.lastCall.lastArg
    assert.ok(metadata.ast)
    assert.ok(metadata.program || metadata.program.length === 0)
    assert.ok(metadata.staticAnalysis)
    assert.ok(metadata.turboModeOn)
  })

})

