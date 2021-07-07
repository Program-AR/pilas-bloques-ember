import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import { hbs } from 'ember-cli-htmlbars'

module('Integration | Component | descripcion-acerca-de', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {
    this.owner.lookup('service:intl').setLocale('es-ar')
    await render(hbs`<DescripcionAcercaDe />`);
    assert.ok(this.element.textContent.includes('Acerca de'))
  })
})
