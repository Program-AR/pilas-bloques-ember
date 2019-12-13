import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pilas canvas', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('pilas', this.owner.lookup('service:pilas'));
    this.set('cargando', true);
    this.set('escena', null);
    this.set('onReady', () => {});

    await render(hbs`<PilasCanvas @pilas={{pilas}} @onReady={{onReady}} @escena={{escena}} @cargando={{cargando}} />`);

    assert.dom().hasText('');

  });
});
