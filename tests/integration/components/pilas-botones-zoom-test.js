import { module, test } from 'qunit';
import { setupPBIntegrationTest } from '../../helpers/utils'
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pilas botones zoom', function (hooks) {
  setupPBIntegrationTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`{{pilas-botones-zoom}}`);
    assert.dom().hasText('100%');
  });
});
