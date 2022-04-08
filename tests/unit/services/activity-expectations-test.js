import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import {  setUpTestLocale } from '../../helpers/utils';

module('Unit | Service | activity-expectations', function (hooks) {
  setupTest(hooks);
  setUpTestLocale(hooks)

  var activityExpectations
  const decompositionKey = 'decomposition'
  const expectationStringMock = 'ExpectationMock'
  const expectationMock = (e) => expectationStringMock // jshint ignore: line
  const idsToExpectationsMock = {
    decomposition: expectationMock,
    simpleRepetition: expectationMock
  }

  const activityMock = {
    expectations: {
        decomposition: true,
        simpleRepetition: true
    }
  }

  hooks.beforeEach(function () {
    activityExpectations = this.owner.lookup('service:activity-expectations');
    activityExpectations.set('idsToExpectations', idsToExpectationsMock)
  });

  test('if an expectation should not be applied, it is mapped to a noExceptation', function (assert) {
    assert.equal(activityExpectations.applicableExpectation([decompositionKey, false])(), '')
  })

  test('a nonexistent id is mapped to noExpectation', function (assert) {
    assert.equal(activityExpectations.applicableExpectation(['randomID', true])(), '')
  })

  test('if an expectation should be applied and id exists, it is mapped to its corresponding expectation', function (assert) {
    assert.equal(activityExpectations.applicableExpectation([decompositionKey, true])(), expectationStringMock)
  })

  test('domain expectations to mulang expectations', function (assert) {
    assert.equal(activityExpectations.expectations(activityMock)(), 'ExpectationMock\nExpectationMock')
  })

  test('if an activity does not define expectations, no expectation is applied', function (assert) {
    assert.equal(activityExpectations.expectationFor({})(), '')
  })

  test('if an activity defines expectations, its expectations should be applied', function (assert) {
    assert.equal(activityExpectations.expectationFor(activityMock)(), 'ExpectationMock\nExpectationMock')
  })

});