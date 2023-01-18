import { module, test } from 'qunit'
import { setupPBAcceptanceTest, setupLoggedUser } from '../helpers/utils'
import { currentURL, visit } from '@ember/test-helpers'
import ENV from 'pilasbloques/config/environment'

module('Acceptance | clear', function (hooks) {
  setupPBAcceptanceTest(hooks)
  setupLoggedUser(hooks)

  test('should clear all storage data', async function (assert) {
    await visit(`${ENV.rootURL}clear`)
    let storage = this.owner.lookup('service:storage')
    assert.notOk(storage.getUser())
  })

  test('should redirect to home', async function (assert) {
    await visit(`${ENV.rootURL}clear`)
    assert.equal(currentURL(), '/libros')
  })

})
