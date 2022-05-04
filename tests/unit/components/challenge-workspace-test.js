import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import {
  pilasMock,
  interpreterFactoryMock,
  actividadMock
} from '../../helpers/mocks';
import sinon from 'sinon';

module('Unit | Components | challenge-workspace', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:interpreterFactory', interpreterFactoryMock)
    this.owner.register('service:pilas', pilasMock)
    this.ctrl = this.owner.factoryFor('component:challenge-workspace').create();
    this.ctrl.set('pilasBloquesApi', sinon.stub(this.ctrl.pilasBloquesApi))
    this.ctrl.set('model', actividadMock);
    sinon.resetHistory();
  });

  test('Si el desafío necesita modo de lectura simple debería indicárselo a pilas', function (assert) {
    const pilasService = this.owner.lookup('service:pilas')
    this.ctrl.send('onSceneReady', pilasService);
    assert.ok(pilasService.cambiarAModoDeLecturaSimple.called);
  });
  
});