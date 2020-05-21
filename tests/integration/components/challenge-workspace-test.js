import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { pilasMock } from '../../helpers/mocks';

module('Integration | Component | challenge-workspace', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {

    this.set('pilas', pilasMock);

    this.set('model', EmberObject.extend({
      bloques: ['controls_if']
    }).create());

    await render(hbs`{{challenge-workspace pilas=pilas model=model}}`);

    assert.dom().hasAnyText('Hay algo de texto');
  });
});
