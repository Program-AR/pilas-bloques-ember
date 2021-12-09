import { module, test } from 'qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import { mockApi, setupLoggedUser, setupPBIntegrationTest } from '../../helpers/utils'
import { actividadMock, pilasMock } from '../../helpers/mocks'

module('Integration | Component | pilas-blockly', function (hooks) {
  setupPBIntegrationTest(hooks)
  setupLoggedUser(hooks)

  const code = `PHhtbCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCI+CiAgPHZhcmlhYmxlcz48L3ZhcmlhYmxlcz4KICA8YmxvY2sgdHlwZT0iYWxfZW1wZXphcl9hX2VqZWN1dGFyIiBkZWxldGFibGU9ImZhbHNlIiBtb3ZhYmxlPSJmYWxzZSIgZWRpdGFibGU9ImZhbHNlIiB4PSIyNjYiIHk9IjE1Ij4KICAgIDxzdGF0ZW1lbnQgbmFtZT0icHJvZ3JhbSI+CiAgICAgIDxzaGFkb3cgdHlwZT0icmVxdWlyZWRfc3RhdGVtZW50Ij48L3NoYWRvdz4KICAgIDwvc3RhdGVtZW50PgogIDwvYmxvY2s+CiAgPGJsb2NrIHR5cGU9IkNvbWVyQ2h1cnJhc2NvIiBkaXNhYmxlZD0idHJ1ZSIgeD0iNTg5IiB5PSI4NyI+PC9ibG9jaz4KPC94bWw+`

  test('should start with code param in workspace', async function (assert) {
    await renderComponent.call(this, { code })
    assertBlockTypes(assert, 'al_empezar_a_ejecutar', 'ComerChurrasco')
  })

  const program = `
  <xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar">
      <statement name="program">
        <shadow type="required_statement"></shadow>
      </statement>
    </block>
    <block type="MoverACasillaArriba"></block>
  </xml>`

  test('should start with api last solution in workspace', async function (assert) {
    mockApi('challenges', { program })
    await renderComponent.call(this)
    assertBlockTypes(assert, 'al_empezar_a_ejecutar', 'MoverACasillaArriba')
  })

  const solucionInicial = `
  <xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar">
      <statement name="program">
        <shadow type="required_statement"></shadow>
      </statement>
    </block>
    <block type="MoverACasillaAbajo"></block>
  </xml>`

  const createActivity = (owner, fields) => {
    const group = owner.lookup('service:store').createRecord('grupo')
    return owner.lookup('service:store').createRecord('desafio', { grupo: group, escena: "AlienInicial", bloques: ['controls_if'], ...fields })
  }

  test('should start with activity initial solution in workspace', async function (assert) {
    const activityWithInitialSolution = createActivity(this.owner, { solucionInicial })
    await renderComponent.call(this, { model: activityWithInitialSolution })
    assertBlockTypes(assert, 'al_empezar_a_ejecutar', 'MoverACasillaAbajo')
  })

  test('without initial code should start only with main block', async function (assert) {
    await renderComponent.call(this, { model: createActivity(this.owner) })
    assertBlockTypes(assert, 'al_empezar_a_ejecutar')
  })
})

function assertBlockTypes(assert, ...expectedTypes) {
  const blocks = Blockly.mainWorkspace.getTopBlocks()
  const blockTypes = blocks.map(b => b.type)
  assert.deepEqual(blockTypes, expectedTypes)
}

async function renderComponent(options) {
  const { model, code } = {
    model: actividadMock,
    ...options
  }
  return new Promise(async (success) => {
    this.set('pilas', pilasMock)
    this.set('model', model)
    this.set('onReady', () => { success() })
    this.set('codigo', code)

    // This render a `challenge-workspace` instead of `pilas-blockly` because it is coupled to his parent & grandparent
    await render(hbs`
    {{ challenge-workspace
      pilas=pilas
      model=model
      onReady=onReady
      codigo=codigo
    }}`)
  })
}