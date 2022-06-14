import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setUpTestLocale } from '../../helpers/utils';
import { createComponentMock } from '../../helpers/mocks';

module('Unit | Service | activity-expectations', function (hooks) {
  setupTest(hooks);
  setUpTestLocale(hooks)

  var activityExpectations
  const decompositionKey = 'decomposition'
  const expectationStringMock = 'ExpectationMock'
  const expectationsName = 'expectations'
  const expectationsConfig = {
    decomposition: true,
    simpleRepetition: true
  }
  const expectationMock = (e) => expectationStringMock // jshint ignore: line
  const idsToExpectationsMock = (/* intl */) => ({
    decomposition: expectationMock,
    simpleRepetition: expectationMock,
    conditionalAlternative: expectationMock
  })

  let activityMock

  hooks.beforeEach(function () {
    activityExpectations = this.owner.lookup('service:activity-expectations');
    activityExpectations.set('idsToExpectations', idsToExpectationsMock)
    activityMock = createComponentMock({
      expectations: expectationsConfig
    })
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

  test('expectations do not exist', function (assert) {
    assert.notOk(activityExpectations.expectationsExist([undefined]))
  })

  test('expectations exist', function (assert) {
    assert.ok(activityExpectations.expectationsExist([activityMock.get(expectationsName)]))
  })

  test('merged expectations for a single expectation configuration', function (assert) {
    assert.propEqual(activityExpectations.mergeConfigurations([expectationsConfig]), expectationsConfig)
  })

  test('merged expectations for multiple configurations without keys in common', function (assert) {
    const conditionalAlternativeConfig = {
      conditionalAlternative: true
    }
    const mergedConfig = {
      decomposition: true,
      simpleRepetition: true,
      conditionalAlternative: true
    }
    assert.propEqual(activityExpectations.mergeConfigurations([expectationsConfig, conditionalAlternativeConfig]), mergedConfig)
  })

  test('merged expectations for multiple configurations with keys in common should prioritize values with higher priority', function (assert) {
    const configWithHigherPriority = {
      decomposition: false
    }
    const mergedConfig = {
      decomposition: false,
      simpleRepetition: true
    }
    assert.propEqual(activityExpectations.mergeConfigurations([expectationsConfig, configWithHigherPriority]), mergedConfig)
  })

  test('domain expectations to mulang expectations', function (assert) {
    assert.equal(activityExpectations.configToExpectation(expectationsConfig)(), 'ExpectationMock\nExpectationMock')
  })

  test('multiple nonexistent expectations ids are transformed to a noExpectation', function (assert) {

    const nonexistenteEpectations = {
      foo: true,
      bar: false,
      baz: true
    }
    assert.equal(activityExpectations.configToExpectation(nonexistenteEpectations)(), '')
  })

  test('if an activity does not define expectations, noExpectation is applied', function (assert) {
    assert.equal(activityExpectations.expectationFor(createComponentMock({}))(), '')
  })

  test('if an activity defines expectations but does not belong to a group, chapter or book, its expectations should be applied', function (assert) {
    assert.equal(activityExpectations.expectationFor(activityMock)(), 'ExpectationMock\nExpectationMock')
  })

  test('expectations from book, chapter, group and activity should be combined', function (assert) {
    const book = createComponentMock({
      expectations: {
        decomposition: true
      }
    })
    const chapter = createComponentMock({
      libro: book,
      expectations: {
        simpleRepetition: true
      }
    })
    const group = createComponentMock({
      capitulo: chapter
    })
    const activity = createComponentMock({
      grupo: group,
      expectations: {
        decomposition: false
      }
    })
    assert.equal(activityExpectations.expectationFor(activity)(), 'ExpectationMock')
  })

});