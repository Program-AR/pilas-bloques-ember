import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupPBIntegrationTest } from '../../helpers/utils'
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { pilasMock } from '../../helpers/mocks';
import Ember from 'ember';

// jshint unused: false
const simpleReadStub = Ember.Service.extend({
  shouldShow: true,

  // param is necessary because simpleRead service expects an argument
  shouldShowSimpleRead(_){
    return this.shouldShow
  } 
})

module('Integration | Component | challenge-workspace', function (hooks) {
  setupPBIntegrationTest(hooks);
  const workspace = hbs`{{challenge-workspace pilas=pilas model=model}}`

  hooks.beforeEach(function(assert) {
    this.set('pilas', pilasMock);
    this.set('model', EmberObject.extend({
      bloques: ['controls_if']
    }).create());
    this.owner.register('service:simpleRead', simpleReadStub);
  });

  test('it renders', async function (assert) {
    await render(workspace);
    assert.dom().hasAnyText('Hay algo de texto');
  });

  test('when simple read mode is enabled, simple read mode css class should be applied', async function (assert) {
    await render(workspace)
    assert.dom('div.simple-read-mode').exists()
  })

  test('when simple read mode is disabled, simple read mode css class should not be applied', async function (assert) {
    this.simpleReadMock = this.owner.lookup('service:simpleRead');
    this.simpleReadMock.shouldShow = false
    await render(workspace)
    assert.dom('div.simple-read-mode').doesNotExist()
  })
});
