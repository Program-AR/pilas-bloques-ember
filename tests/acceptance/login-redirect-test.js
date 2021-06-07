import { module, test } from 'qunit';
import { setupPBAcceptanceTest } from '../helpers/utils'
import { currentURL, visit} from '@ember/test-helpers';
import simulateRouterHooks from "../helpers/simulate-router.hooks";

module('Acceptance | puede redireccionar despues de login', function (hooks) {
  setupPBAcceptanceTest(hooks)

  test('redirecciona desde register', async function (assert) {
      try {
        await visit('register');
        let ctrl = this.owner.factoryFor('component:login').create();
        ctrl.send("doLogin");
        await assert.equal(currentURL(), "libros", "redirecciona a libros");
      }
      catch (e) {
        if (e.message !== 'TransitionAborted') {
          throw e;
        }
      }

  });

});
