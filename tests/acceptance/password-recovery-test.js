import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import { create, visitable, text, collection } from 'ember-cli-page-object'


module('Acceptance | password-recovery', function (hooks) {
  setupApplicationTest(hooks)
  
  test('visiting /password-recovery should require username', async function (assert) {
    const page = create({
      visit: visitable('/password-recovery'),
      input: text('.md-required'),
    })
    await page.visit()
    assert.equal(page.input, "Usuario")
  })

  test('visiting /password-recovery with mail token should require new password', async function (assert) {
    const page = create({
      visit: visitable('/password-recovery?token=TOKEN'),
      inputs: collection('.md-required'),
    })
    await page.visit()
    assert.deepEqual(page.inputs.mapBy('text'), ["Nueva contraseña", "Confirmar contraseña"])
  })
})
