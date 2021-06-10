import { module, skip } from 'qunit'
import { setupPBAcceptanceTest } from '../helpers/utils'
import { currentURL, visit} from '@ember/test-helpers'

module('Acceptance | puede redireccionar despues de login', function (hooks) {
  setupPBAcceptanceTest(hooks)

  skip('redirecciona desde register', async function (assert) {
    await visit('register')
    let ctrl = this.owner.factoryFor('component:login').create()
    ctrl.send("doLogin")
    assert.equal(currentURL(), "libros", "redirecciona a libros")
  });

});
