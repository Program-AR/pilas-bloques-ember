import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | collapsable', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async () => {
    await render(hbs`
      <Collapsable>
        content
      </Collapsable>
    `);
  })

  test('Initial collapsable does not show content', async function(assert) {
    assert.notOk(this.element.textContent.includes("content"));
  });

  test('Content appears when clicked', async function(assert) {
    await click('.collapsable-title');    
    assert.ok(this.element.textContent.includes("content"));
  });
});
