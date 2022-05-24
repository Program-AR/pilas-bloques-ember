import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setUpTestLocale } from '../../helpers/utils';

const solutionPassMock = {
  id: 'solution_works',
  description: '¡Tu solución funciona! Resuelve el problema.\n',
  result: true
}

const expectation = (id, description, result) => ({ id, description, result })

module('Unit | Service | expects-scoring', function (hooks) {
  setupTest(hooks);
  setUpTestLocale(hooks)

  var expectsScoring

  hooks.beforeEach(function () {
    expectsScoring = this.owner.lookup('service:expects-scoring');
  });

  test('Should add solution passed expectation at the beginning', function (assert) {
    const e1 = expectation('1', '', false)
    const e2 = expectation('2', '', true)
    const expectations = [e1, e2]

    const results = expectsScoring.expectsResults(expectations)
    assert.propEqual(results[0], solutionPassMock)
  });

  test('A combined expectation with at least a passed expectation', function (assert) {
    const e1 = expectation('1', '', true)
    const e2 = expectation('1', '', false)

    const combinedExpectation = expectsScoring.combineExpectPair(e1, e2)

    assert.propEqual(combinedExpectation, e1)
  })

  test('A combined expectation without a passed expectation', function (assert) {
    const e1 = expectation('1', '', false)
    const e2 = expectation('1', '', false)

    const combinedExpectation = expectsScoring.combineExpectPair(e1, e2)

    assert.propEqual(combinedExpectation, e1)
  })


  test('Only expectations with same id should be combined', function (assert) {
    const e1 = expectation('1', '', true)
    const e2 = expectation('1', '', false)
    const e3 = expectation('1', '', false)
    const e4 = expectation('2', '', true)
    const e5 = expectation('3', '', false)
    const expectations = [e1, e2, e3, e4, e5]

    const combinedExpectations = expectsScoring.combineMultipleExpectations(expectations)
    assert.propEqual(combinedExpectations, [e1, e4, e5])
  })

  test('Should map to generic description only the relevant expectations', function (assert) {
    const relevant1 = expectation('too_long', '', true)
    const nonRelevant1 = expectation('does_not_use_recursion', '', false)
    const nonRelevant2 = expectation('is_used', '', true)
    const relevant2 = expectation('do_something', '', false)
    const expectations = [relevant1, nonRelevant1, nonRelevant2, relevant2]

    const relevantGenericExpectations = expectsScoring.relevantGenericExpectations(expectations)

    const genericRelevant1 = { ...relevant1, description: 'Tus procedimientos están divididos en subtareas también.\n' }
    const genericRelevant2 = { ...relevant2, description: 'Tus procedimientos no hacen nada (están vacíos).\n' }

    assert.propEqual(relevantGenericExpectations, [genericRelevant1, genericRelevant2])
  })

  test('Non generic expectations should not change description', function (assert) {
    const exp = expectation('pepita', 'Pepita usa repeticion condicional', true)

    const result = expectsScoring.genericDescriptionFor(exp)

    assert.propEqual(result, exp)
  })

});