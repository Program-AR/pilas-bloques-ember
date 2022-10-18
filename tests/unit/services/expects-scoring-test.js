import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setUpTestLocale } from '../../helpers/utils';
import { createComponentMock, expectationsConfigMock } from '../../helpers/mocks';
import { mainTooLongId, doesNotNestControlStructuresId, simpleRepetitionId, doSomethingId, tooLongId, nameWasChangedId } from '../../../utils/expectations'

const solutionPassMock = {
  id: 'solution_works',
  isScoreable: true,
  description: {
    asScoring: '¡Tu solución _funciona_!',
    asSuggestion: '',
    forControlGroup: ''
  },
  result: true
}

const pilasServiceMock = {
  estaResueltoElProblema() { return true }
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
    expectsScoring.set('pilasService', pilasServiceMock)
  });

  test('Should add solution passed expectation result at the beginning', function (assert) {
    const e1 = expectation(mainTooLongId, false)
    const e2 = expectation(doesNotNestControlStructuresId, true)
    const expectations = [e1, e2]

    const results = expectsScoring.expectsResults(expectations)
    assert.propEqual(results[0], solutionPassMock)
  });

  test('Only expectations with same id should be combined', function (assert) {
    const e1 = expectation(mainTooLongId, true)
    const e2 = expectation(mainTooLongId, false)
    const e3 = expectation(mainTooLongId, false)
    const e4 = expectation(doesNotNestControlStructuresId, true)
    const e5 = expectation(simpleRepetitionId, false)
    const expectations = [e1, e2, e3, e4, e5]

    const combinedExpectations = expectsScoring.combineMultipleExpectations(expectations)
    assert.propEqual(combinedExpectations, [e1, e4, e5])
  })

  test('If a grouping of expectations passes, the result should be a passing expectation', function (assert) {
    const passingExpectation = expectation(mainTooLongId, true, 'Passed')
    const e2 = expectation(mainTooLongId, false, 'Failed')
    const e3 = expectation(mainTooLongId, false, 'Failed')
    const expectations = [e2, passingExpectation, e3]

    const result = expectsScoring.expectationGroupingResult(expectations)

    assert.propEqual(result, passingExpectation)
  })

  test('If a grouping of expectations fails, the result should be a failing expectation', function (assert) {
    const e1 = expectation(mainTooLongId, false, 'Failed')
    const e2 = expectation(mainTooLongId, false, 'Failed')
    const e3 = expectation(mainTooLongId, false, 'Failed')
    const expectations = [e1, e2, e3]

    const result = expectsScoring.expectationGroupingResult(expectations)

    assert.propEqual(result, e1)
  })

  test('Only scoreable expects should be part of the results', function (assert) {
    const nonScoreableExpectation = { id: mainTooLongId, description: { asSuggestion: 'a suggestion' }, result: true }
    const e2 = expectation(doesNotNestControlStructuresId, true)
    const e3 = expectation(simpleRepetitionId, false)
    const expectations = [nonScoreableExpectation, e2, e3]

    const results = expectsScoring.expectsResults(expectations)

    assert.propEqual(results, [solutionPassMock, e2, e3])
  })

  const assertFloatEqual = (assert, n1, n2) => {
    const round = (num) => Number((num).toFixed(3))
    assert.equal(round(n1), round(n2))
  }

  test('Total score when using all expects of configuration', function (assert) {
    const e1 = expectation(doSomethingId, true)
    const e2 = expectation(tooLongId, false)
    const e3 = expectation(mainTooLongId, true)
    const e4 = expectation(nameWasChangedId, true)
    const e5 = expectation(doesNotNestControlStructuresId, false)
    const expects = [e1, e2, e3, e4, e5]
    //The "+1" here refers to the solution passed expectation that is added to the expects.
    const passingExpects = 3 + 1
    const totalExpects = 5 + 1


    assertFloatEqual(assert, expectsScoring.totalScore(expects, challengeMock), 100 * (passingExpects / totalExpects))
  })

  test('Calculating total score when not using all expects of the challenge configuration should add the unused expects with positive results', function (assert) {
    const e1 = expectation(doSomethingId, true)
    const e2 = expectation(tooLongId, false)
    const e3 = expectation(mainTooLongId, false)
    const e4 = expectation(nameWasChangedId, false)
    //Does not nest control structures from the decomposition configuration is not used
    const expects = [e1, e2, e3, e4]
    const passingExpects = 1 + 2 //The solution passed expectation and the does not nest control structures expectation are added
    const totalExpects = 5 + 1 //The solution passed expectation is added

    assertFloatEqual(assert, expectsScoring.totalScore(expects, challengeMock), 100 * (passingExpects / totalExpects))
  })

  test('Calculating total score when not using all expects of the challenge configuration should add the unused expects with negative results', function (assert) {
    const e1 = expectation(mainTooLongId, false)
    //Does not nest control structures from the decomposition configuration is not used
    const expects = [e1]
    const passingExpects = 0 + 2 //The solution passed expectation and the does not nest control structures expectation are added
    const totalExpects = 5 + 1 //The solution passed expectation is added

    assertFloatEqual(assert, expectsScoring.totalScore(expects, challengeMock), 100 * (passingExpects / totalExpects))
  })
});