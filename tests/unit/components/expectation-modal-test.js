import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { experimentsMock } from '../../helpers/mocks';

const failedExpects = [
  newExpectation(false),
  newExpectation(false)]

const passedExpects = [
  newExpectation(true),
  newExpectation(true)]


function newExpectation(status) {
  return { id: '', description: '', results: status }
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

    component.set('failedExpects', [])
    component.set('passedExpects', passedExpects)

    assert.notOk(component.isControl())
    assert.ok(component.allExpectationsPassed())
  })

  test('Is treatment group - not all expectations passed', function (assert) {
    const experimentsMock = this.owner.lookup('service:experiments')
    experimentsMock.setTreatment()

    component.set('failedExpects', failedExpects)
    component.set('passedExpects', passedExpects)

    assert.notOk(component.isControl())
    assert.notOk(component.allExpectationsPassed())
  })
});
