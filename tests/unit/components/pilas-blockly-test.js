import { moduleFor, test } from 'ember-qunit';
import { pilasMock, interpreterFactoryMock } from '../../helpers/mocks';

moduleFor('component:pilas-blockly', 'Unit | Components | pilas-blockly', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  setup() {
    this.register('service:interpreterFactory', interpreterFactoryMock);
    let ctrl = this.subject();
    ctrl.pilas = pilasMock;
  }
});

test('Al ejecutar settea flags y ejecuta el intérprete', function(assert) {
  let ctrl = this.subject();
  
  ctrl.send('ejecutar');

  assert.ok(ctrl.get('ejecutando'));
  assert.notOk(ctrl.get('pausadoEnBreakpoint'));
  //TODO: testing sobre la ejecución (async)
});


test('Al reiniciar settea flags y reinicia la escena de pilas', function(assert) {
  let ctrl = this.subject();
  
  ctrl.send('reiniciar');

  assert.notOk(ctrl.get('highlightedBlock'));
  assert.notOk(ctrl.get('ejecutando'));
  assert.notOk(ctrl.get('terminoDeEjecutar'));
  assert.notOk(ctrl.get('errorDeActividad'));
  //TODO: testing sobre mock pilas.reiniciarEscenaCompleta()
});