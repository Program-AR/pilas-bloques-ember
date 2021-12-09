import { module, test } from 'qunit';
import { setupPBIntegrationTest } from '../../helpers/utils'
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pilas canvas', function (hooks) {
  setupPBIntegrationTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('cargando', true);
    this.set('challenge', {escena: 'AlienInicial'});
    this.set('onReady', () => { });

    await render(hbs`<PilasCanvas @onReady={{onReady}} @challenge={{challenge}} @cargando={{cargando}} />`);

    assert.dom().hasText('');

  });
});
