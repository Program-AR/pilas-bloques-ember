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

  test('an expectation id should not be applied if its value is falsy', function (assert) {
    assert.notOk(activityExpectations.shouldBeApplied([decompositionKey, false]))
  })

  test('an invalid expectation id should not be applied, regardless of its value', function (assert) {
    assert.notOk(activityExpectations.shouldBeApplied(['randomID', true]))
  })

  test('an expectation id should be applied if it is valid and its value is truthy', function (assert) {
    assert.ok(activityExpectations.shouldBeApplied([decompositionKey, true]))
  })

  test('domain expectations to mulang expectations', function (assert) {
    assert.equal(activityExpectations.expectations(activityMock)(), 'ExpectationMock\nExpectationMock')
  })

  test('multiple nonexistent expectations ids are transformed to a noExpectation', function (assert) {
    const wrongActivityMock = {
      expectations: {
        foo: true,
        bar: false,
        baz: true
      }
    }
    assert.equal(activityExpectations.expectations(wrongActivityMock)(), '')
  })

  test('if an activity does not define expectations, noExpectation is applied', function (assert) {
    assert.equal(activityExpectations.expectationFor({})(), '')
  })

  test('if an activity defines expectations, its expectations should be applied', function (assert) {
    assert.equal(activityExpectations.expectationFor(activityMock)(), 'ExpectationMock\nExpectationMock')
  })

});