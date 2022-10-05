import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setUpTestLocale } from '../../helpers/utils';
import { createComponentMock, expectationsConfigMock } from '../../helpers/mocks';
import { mainTooLongID, doesNotNestControlStructuresId, simpleRepetitionId } from '../../../utils/expectations'

const solutionPassMock = {
  id: 'solution_works',
  isScoreable: true,
  description: {
    asScoring: '¡Tu solución funciona!',
    asSuggestion: '',
    forControlGroup: ''
  },
  result: true
}

const expectation = (id, result, description = 'Bien :)') => ({ id, description: { asScoring: description }, result })

module('Unit | Service | expects-scoring', function (hooks) {
  setupTest(hooks);
  setUpTestLocale(hooks)

  var expectsScoring

  const challengeMock = createComponentMock({
    expectations: expectationsConfigMock
  })

  hooks.beforeEach(function () {
    expectsScoring = this.owner.lookup('service:expects-scoring');
  });

  test('Should add solution passed expectation result at the beginning', function (assert) {
    const e1 = expectation(mainTooLongID, false)
    const e2 = expectation(doesNotNestControlStructuresId, true)
    const expectations = [e1, e2]

    const results = expectsScoring.expectsResults(expectations)
    assert.propEqual(results[0], solutionPassMock)
  });

  test('Only expectations with same id should be combined', function (assert) {
    const e1 = expectation(mainTooLongID, true)
    const e2 = expectation(mainTooLongID, false)
    const e3 = expectation(mainTooLongID, false)
    const e4 = expectation(doesNotNestControlStructuresId, true)
    const e5 = expectation(simpleRepetitionId, false)
    const expectations = [e1, e2, e3, e4, e5]

    const combinedExpectations = expectsScoring.combineMultipleExpectations(expectations)
    assert.propEqual(combinedExpectations, [e1, e4, e5])
  })

  test('If a grouping of expectations passes, the result should be a passing expectation', function (assert) {
    const passingExpectation = expectation(mainTooLongID, true, 'Passed')
    const e2 = expectation(mainTooLongID, false, 'Failed')
    const e3 = expectation(mainTooLongID, false, 'Failed')
    const expectations = [e2, passingExpectation, e3]

    const result = expectsScoring.expectationGroupingResult(expectations)

    assert.propEqual(result, passingExpectation)
  })

  test('If a grouping of expectations fails, the result should be a failing expectation', function (assert) {
    const e1 = expectation(mainTooLongID, false, 'Failed')
    const e2 = expectation(mainTooLongID, false, 'Failed')
    const e3 = expectation(mainTooLongID, false, 'Failed')
    const expectations = [e1, e2, e3]

    const result = expectsScoring.expectationGroupingResult(expectations)

    assert.propEqual(result, e1)
  })

  test('Only scoreable expects should be part of the results', function (assert) {
    const nonScoreableExpectation = { id: mainTooLongID, description: { asSuggestion: 'a suggestion' }, result: true }
    const e2 = expectation(doesNotNestControlStructuresId, true)
    const e3 = expectation(simpleRepetitionId, false)
    const expectations = [nonScoreableExpectation, e2, e3]
    const results = expectsScoring.expectsResults(expectations)
    assert.propEqual(results, [solutionPassMock, e2, e3])
  })

});