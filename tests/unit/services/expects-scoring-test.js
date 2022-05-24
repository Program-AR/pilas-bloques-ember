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


});