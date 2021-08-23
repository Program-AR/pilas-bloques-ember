import { module, test } from 'qunit';
import { setupPBIntegrationTest } from '../../helpers/utils'
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | toast', function (hooks) {
  setupPBIntegrationTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.set('needShowTurboModeIndicator', true);

    await render(hbs`<Toast @message={{"Modo Turbo"}} @needShowToast={{needShowTurboModeIndicator}} />`);

    assert.equal(this.element.textContent.trim(), '');

  });
});
