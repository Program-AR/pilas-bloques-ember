import { later } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import {
  pilasMock,
  interpreterFactoryMock,
  interpreteMock,
  actividadMock,
  blocklyWorkspaceMock
} from '../../helpers/mocks';
import sinon from 'sinon';

module('Unit | Components | pilas-blockly', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.setup = function() {
      this.owner.register('service:interpreterFactory', interpreterFactoryMock);
      this.owner.lookup('service:highlighter').workspace = blocklyWorkspaceMock()

      let ctrl = this.owner.factoryFor('component:pilas-blockly').create();
      ctrl.pilas = pilasMock; //TODO: Injectar como service
      ctrl.set('modelActividad', actividadMock);
      sinon.resetHistory();
    };
  });

  //TODO: Ver de agrupar en modules
  test('Al ejecutar se encuentra ejecutando y ejecuta el intérprete', function(assert) {
    let ctrl = this.owner.factoryFor('component:pilas-blockly').create();
    ctrl.send('ejecutar');

    assert.ok(ctrl.get('ejecutando'));
    assert.notOk(ctrl.get('pausadoEnBreakpoint'));
    assert.ok(interpreteMock.run.called);
  });

  test('Ejecutar paso a paso bloquea la ejecución', function(assert) {
    let ctrl = this.owner.factoryFor('component:pilas-blockly').create();
    ctrl.send('ejecutar', true);
    
    later(() => {
      assert.ok(interpreteMock.run.calledOnce);
      assert.ok(ctrl.get('pausadoEnBreakpoint'));
    });
  });

  test('Step desbloquea el breakpoint', function(assert) {
    let ctrl = this.owner.factoryFor('component:pilas-blockly').create();
    ctrl.send('ejecutar', true);
    
    later(() => {
      assert.ok(ctrl.get('pausadoEnBreakpoint'));
      ctrl.send('step');
      assert.notOk(ctrl.get('pausadoEnBreakpoint'));
    });
  });

  test('Luego de ejecutar termina de ejecutar', function(assert) {
    let ctrl = this.owner.factoryFor('component:pilas-blockly').create();
    ctrl.send('ejecutar');

    later(() => {
      assert.notOk(ctrl.get('ejecutando'));
      assert.ok(ctrl.get('terminoDeEjecutar'));
    });
  });

  test('Al resolver el problema muestra el fin del desafío', function(assert) {
    let ctrl = this.owner.factoryFor('component:pilas-blockly').create();
    ctrl.set('debeMostrarFinDeDesafio', true);
    ctrl.send('ejecutar');

    later(() => {
      assert.ok(ctrl.get('mostrarDialogoFinDesafio'));
    });
  });

  test('Al reiniciar settea flags y reinicia la escena de pilas', function(assert) {
    let ctrl = this.owner.factoryFor('component:pilas-blockly').create();
    ctrl.send('reiniciar');

    assert.notOk(ctrl.get('ejecutando'));
    assert.notOk(ctrl.get('terminoDeEjecutar'));
    assert.notOk(ctrl.get('errorDeActividad'));
    assert.ok(pilasMock.reiniciarEscenaCompleta.called);
  });
});

