import { module, skip } from 'qunit'
import { setupPBAcceptanceTest } from '../helpers/utils'
import { currentURL, visit} from '@ember/test-helpers'
import ENV from 'pilasbloques/config/environment'

module('Acceptance | puede redireccionar despues de login', function (hooks) {
  setupPBAcceptanceTest(hooks)

  skip('redirecciona desde register', async function (assert) {
    await visit(`${ENV.rootURL}register`)
    let ctrl = this.owner.factoryFor('component:login').create()
    ctrl.send("doLogin")
    assert.equal(currentURL(), "libros", "redirecciona a libros")
  });

});
