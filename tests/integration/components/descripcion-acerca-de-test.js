import { module, test } from 'qunit'
import { setupPBIntegrationTest } from '../../helpers/utils'
import { render } from '@ember/test-helpers'
import { hbs } from 'ember-cli-htmlbars'

module('Integration | Component | descripcion-acerca-de', function (hooks) {
  setupPBIntegrationTest(hooks)

  test('it renders', async function (assert) {
    await render(hbs`<DescripcionAcercaDe />`);
    assert.ok(this.element.textContent.includes('Acerca de'))
  })
})
