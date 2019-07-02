import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { pilasMock } from '../../helpers/mocks';

module('Integration | Component | pilas editor', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    this.set('pilas', pilasMock);

    this.set('model', EmberObject.extend({
      bloques: ['controls_if']
    }).create());

    await render(hbs`{{pilas-editor pilas=pilas model=model}}`);

    assert.ok(find().textContent.trim());
  });
});
