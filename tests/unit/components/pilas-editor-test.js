import { moduleFor, test } from 'ember-qunit';
import { pilasMock, interpreterFactoryMock, actividadMock } from '../../helpers/mocks';
import sinon from 'sinon';

moduleFor('component:pilas-editor', 'Unit | Components | pilas-editor', {
  setup() {
    this.register('service:interpreterFactory', interpreterFactoryMock);
    let ctrl = this.subject();
    ctrl.set('model', actividadMock);
    sinon.resetHistory();
  }
});

test('Si el desafío necesita modo de lectura simple debería indicárselo a pilas', function(assert) {
  let ctrl = this.subject();
  ctrl.send('onReady', pilasMock);

  assert.ok(pilasMock.cambiarAModoDeLecturaSimple.called);
});