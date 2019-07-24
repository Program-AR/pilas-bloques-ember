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
      this.owner.register('service:interpreterFactory', interpreterFactoryMock);
      this.ctrl = this.owner.factoryFor('component:pilas-editor').create();
      this.ctrl.set('model', actividadMock);
      sinon.resetHistory();
  });

  test('Si el desafío necesita modo de lectura simple debería indicárselo a pilas', function(assert) {
    this.ctrl.send('onReady', pilasMock);

    assert.ok(pilasMock.cambiarAModoDeLecturaSimple.called);
  });
});