import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupPBIntegrationTest, testSimpleReadModeDisabled, testSimpleReadModeEnabled } from '../../helpers/utils'
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { pilasMock, simpleReadMock } from '../../helpers/mocks';

module('Integration | Component | challenge-workspace', function (hooks) {
  setupPBIntegrationTest(hooks);
  const workspace = hbs`{{challenge-workspace pilas=pilas model=model}}`

  hooks.beforeEach(function() {
    this.set('pilas', pilasMock);
    this.set('model', EmberObject.extend({
      bloques: ['controls_if'],
      escena: 'AlienInicial'
    }).create());
    this.owner.register('service:simpleRead', simpleReadMock);
  });

  test('it renders', async function (assert) {
    await render(workspace);
    assert.dom().hasAnyText('Hay algo de texto');
  });

  testSimpleReadModeEnabled(() => render(workspace))
  testSimpleReadModeDisabled(() => render(workspace))

});
