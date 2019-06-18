import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import {
  pilasMock,
  interpreterFactoryMock,
  actividadMock
} from '../../helpers/mocks';
import sinon from 'sinon';

module('Unit | Components | pilas-editor', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.setup = function() {
      this.owner.register('service:interpreterFactory', interpreterFactoryMock);
      let ctrl = this.owner.factoryFor('component:pilas-editor').create();
      ctrl.set('model', actividadMock);
      sinon.resetHistory();
    };
  });

  test('Si el desafío necesita modo de lectura simple debería indicárselo a pilas', function(assert) {
    let ctrl = this.owner.factoryFor('component:pilas-editor').create();
    ctrl.send('onReady', pilasMock);

    assert.ok(pilasMock.cambiarAModoDeLecturaSimple.called);
  });
});