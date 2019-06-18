import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pilas canvas', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.pilas = this.owner.lookup('service:pilas');

    await render(hbs`{{pilas-canvas pilas=pilas}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#pilas-canvas pilas=pilas}}
        template block text
      {{/pilas-canvas}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
