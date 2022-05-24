import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { experimentsMock } from '../../helpers/mocks';

const failedExpects = [
  newExpectation('4', false),
  newExpectation('1', false)]

const passedExpects = [
  newExpectation('3', true),
  newExpectation('2', true)]


function newExpectation(id, status) {
  return { id, description: '', result: status }
}

module('Unit | Component | expectation-modal', function (hooks) {
  setupTest(hooks);

  var component

  hooks.beforeEach(function () {
    component = this.owner.factoryFor('component:expectation-modal').create();
    this.owner.register('service:experiments', experimentsMock)
  })

  test('Is control group', function (assert) {
    const experimentsMock = this.owner.lookup('service:experiments')
    experimentsMock.setControl()

    assert.ok(component.isControl())
  })

  test('Is treatment group - all expectations passed', function (assert) {
    const experimentsMock = this.owner.lookup('service:experiments')
    experimentsMock.setTreatment()

    component.set('expects', passedExpects)

    assert.notOk(component.isControl())
    assert.ok(component.allExpectationsPassed())
  })

  test('Is treatment group - not all expectations passed', function (assert) {
    const experimentsMock = this.owner.lookup('service:experiments')
    experimentsMock.setTreatment()

    component.set('expects', passedExpects.concat(failedExpects))

    assert.notOk(component.isControl())
    assert.notOk(component.allExpectationsPassed())
  })
});
