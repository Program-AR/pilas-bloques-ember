import { moduleFor, test } from 'ember-qunit';
import { pilasMock, interpreterFactoryMock } from '../../helpers/mocks';

moduleFor('component:pilas-blockly', 'Unit | Components | pilas-blockly', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  setup() {
    this.register('service:interpreterFactory', interpreterFactoryMock);
  }
});

test('Al ejecutar se está ejecutando', function(assert) {
  let ctrl = this.subject();
  ctrl.pilas = pilasMock;
  
  ctrl.send("ejecutar");
  
  assert.ok(ctrl.get('ejecutando'));
});
