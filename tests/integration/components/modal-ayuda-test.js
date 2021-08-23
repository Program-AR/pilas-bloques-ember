import { module, test } from 'qunit';
import { setupPBIntegrationTest } from '../../helpers/utils'
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | modal ayuda', function (hooks) {
  setupPBIntegrationTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`{{modal-ayuda}}`);
    assert.dom().hasText('', "No imprime texto si está oculto.");
  });
});
