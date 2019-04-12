import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import { pilasMock, interpreterFactoryMock, interpreteMock, actividadMock, blocklyWorkspaceMock } from '../../helpers/mocks';
import sinon from 'sinon';

moduleFor('component:pilas-blockly', 'Unit | Components | pilas-blockly', {
  needs: ['service:highlighter'],
  setup() {
    this.register('service:interpreterFactory', interpreterFactoryMock);
    this.container.lookup('service:highlighter').workspace = blocklyWorkspaceMock()

    let ctrl = this.subject();
    ctrl.pilas = pilasMock; //TODO: Injectar como service
    ctrl.descargar = sinon.spy();
    ctrl.set('modelActividad', actividadMock);
    sinon.resetHistory();
  }
});

//TODO: Ver de agrupar en modules
test('Al ejecutar se encuentra ejecutando y ejecuta el intérprete', function(assert) {
  let ctrl = this.subject();
  ctrl.send('ejecutar');

  assert.ok(ctrl.get('ejecutando'));
  assert.notOk(ctrl.get('pausadoEnBreakpoint'));
  assert.ok(interpreteMock.run.called);
});

test('Ejecutar paso a paso bloquea la ejecución', function(assert) {
  let ctrl = this.subject();
  ctrl.send('ejecutar', true);
  
  Ember.run.later(() => {
    assert.ok(interpreteMock.run.calledOnce);
    assert.ok(ctrl.get('pausadoEnBreakpoint'));
  });
});

test('Step desbloquea el breakpoint', function(assert) {
  let ctrl = this.subject();
  ctrl.send('ejecutar', true);
  
  Ember.run.later(() => {
    assert.ok(ctrl.get('pausadoEnBreakpoint'));
    ctrl.send('step');
    assert.notOk(ctrl.get('pausadoEnBreakpoint'));
  });
});

test('Luego de ejecutar termina de ejecutar', function(assert) {
  let ctrl = this.subject();
  ctrl.send('ejecutar');

  Ember.run.later(() => {
    assert.notOk(ctrl.get('ejecutando'));
    assert.ok(ctrl.get('terminoDeEjecutar'));
  });
});

test('Al resolver el problema muestra el fin del desafío', function(assert) {
  let ctrl = this.subject();
  ctrl.set('debeMostrarFinDeDesafio', true);
  ctrl.send('ejecutar');

  Ember.run.later(() => {
    assert.ok(ctrl.get('mostrarDialogoFinDesafio'));
  });
});

test('Al reiniciar settea flags y reinicia la escena de pilas', function(assert) {
  let ctrl = this.subject();
  ctrl.send('reiniciar');

  assert.notOk(ctrl.get('ejecutando'));
  assert.notOk(ctrl.get('terminoDeEjecutar'));
  assert.notOk(ctrl.get('errorDeActividad'));
  assert.ok(pilasMock.reiniciarEscenaCompleta.called);
});


test('Al guardar solución hace una descarga con la solución', function(assert) {
  let ctrl = this.subject();
  ctrl.send('guardarSolucion');

  assert.ok(ctrl.descargar.calledWith(
    JSON.stringify({version:1, actividad:"Actividad_Mock", solucion:""}),
    'Actividad_Mock.spbq',
    'application/octet-stream'
  ));
});