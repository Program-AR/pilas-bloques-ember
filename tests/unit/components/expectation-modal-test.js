import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const failedExpects = [
  newExpectation('4', false),
  newExpectation('1', false)]

const passedExpects = [
  newExpectation('3', true),
  newExpectation('2', true)]


function newExpectation(id, status) {
  return { id, description: { asScoring: 'Scoring' }, result: status }
}

const pilasServiceMock = {
  estaResueltoElProblema() { return true }
}

module('Unit | Component | expectation-modal', function (hooks) {
  setupTest(hooks);

  var component

  hooks.beforeEach(function () {
    component = this.owner.factoryFor('component:expectation-modal').create();
    this.owner.lookup('service:expects-scoring').set('pilasService', pilasServiceMock)
  })

  test('All expectations passed', function (assert) {
    component.set('expects', passedExpects)
    assert.ok(component.allExpectationsPassed())
  })

  test('Not all expectations passed', function (assert) {
    component.set('expects', passedExpects.concat(failedExpects))
    assert.notOk(component.allExpectationsPassed())
  })
});
