import { module, test } from 'qunit';
import { setupPBIntegrationTest } from '../../helpers/utils'
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pilas notificador', function (hooks) {
  setupPBIntegrationTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`{{pilas-notificador}}`);
    assert.dom().hasAnyText('Hay algo de texto');
  });
});
