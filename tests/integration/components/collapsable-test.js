import { module, test } from 'qunit';
import { setupPBIntegrationTest } from '../../helpers/utils'
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | collapsable', function (hooks) {
  setupPBIntegrationTest(hooks);

  hooks.beforeEach(async () => {
    await render(hbs`
      <Collapsable>
        content
      </Collapsable>
    `);
  })

  test('Initial collapsable does not show content', async function (assert) {
    assert.notOk(this.element.textContent.includes("content"));
  });

  test('Content appears when clicked', async function (assert) {
    await click('.collapsable-title');
    assert.ok(this.element.textContent.includes("content"));
  });
});
