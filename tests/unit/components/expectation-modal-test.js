import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const failedExpects = [
  newExpectation('4', false),
  newExpectation('1', false)]

function expectsScoringMock(failedExpects) {
  return {
    failedExpects(/*expectsResults, challenge */) {
      return failedExpects
    }
  }
}

function newExpectation(id, status) {
  return { id, description: { asScoring: 'Scoring' }, result: status }
}

module('Unit | Component | expectation-modal', function (hooks) {
  setupTest(hooks);

  var component

  hooks.beforeEach(function () {
    component = this.owner.factoryFor('component:expectation-modal').create();
  })

  test('All expectations passed', function (assert) {
    component.expectScoring = expectsScoringMock([])
    assert.ok(component.allExpectationsPassed())
  })

  test('Not all expectations passed', function (assert) {
    component.expectScoring = expectsScoringMock(failedExpects)
    assert.notOk(component.allExpectationsPassed())
  })
});
