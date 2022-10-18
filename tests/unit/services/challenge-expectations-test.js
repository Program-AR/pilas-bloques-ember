import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setUpTestLocale } from '../../helpers/utils';
import { createComponentMock, challengeWithExpectationsMock, expectationsConfigMock } from '../../helpers/mocks';
import { decompositionExpectsIdsForControlGroup } from '../../../utils/expectations';

module('Unit | Service | challenge-expectations', function (hooks) {
  setupTest(hooks);
  setUpTestLocale(hooks)

  var challengeExpectations
  const decompositionKey = 'decomposition'
  const expectationStringMock = 'ExpectationMock'

  const expectationMock = (e) => expectationStringMock // jshint ignore: line
  const idsToExpectationsMock = (/* intl */) => ({
    decomposition: expectationMock,
    simpleRepetition: expectationMock,
    conditionalAlternative: expectationMock
  })

  const challengeWithoutExpectationsMock = createComponentMock({})

  let challengeMock

  hooks.beforeEach(function () {
    challengeExpectations = this.owner.lookup('service:challenge-expectations');
    challengeExpectations.set('idsToExpectations', idsToExpectationsMock)
    challengeMock = createComponentMock({
      expectations: expectationsConfigMock
    })
  });

  test('an expectation id should not be applied if its value is falsy', function (assert) {
    assert.notOk(challengeExpectations.shouldBeApplied([decompositionKey, false]))
  })

  test('an invalid expectation id should not be applied, regardless of its value', function (assert) {
    assert.notOk(challengeExpectations.shouldBeApplied(['randomID', true]))
  })

  test('an expectation id should be applied if it is valid and its value is truthy', function (assert) {
    assert.ok(challengeExpectations.shouldBeApplied([decompositionKey, true]))
  })

  test('merged expectations for a single expectation configuration', function (assert) {
    assert.propEqual(challengeExpectations.mergeConfigurations([expectationsConfigMock]), expectationsConfigMock)
  })

  test('merged expectations for no expectations configuration should be an empty object', function (assert) {
    assert.propEqual(challengeExpectations.mergeConfigurations([]), {})
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
    assert.propEqual(challengeExpectations.mergeConfigurations([expectationsConfigMock, conditionalAlternativeConfig]), mergedConfig)
  })

  test('merged expectations for multiple configurations with keys in common should prioritize values with higher priority', function (assert) {
    const configWithHigherPriority = {
      decomposition: false
    }
    const mergedConfig = {
      decomposition: false,
      simpleRepetition: true
    }
    assert.propEqual(challengeExpectations.mergeConfigurations([expectationsConfigMock, configWithHigherPriority]), mergedConfig)
  })

  test('a challenge has expectations', function (assert) {
    assert.notOk(challengeExpectations.doesNotHaveExpectations(challengeWithExpectationsMock))
  })

  test('a challenge does not have expectations', function (assert) {
    assert.ok(challengeExpectations.doesNotHaveExpectations(challengeWithoutExpectationsMock))
  })

  test('domain expectations to mulang expectations', function (assert) {
    assert.equal(challengeExpectations.configToExpectation(expectationsConfigMock)(), 'ExpectationMock\nExpectationMock')
  })

  test('multiple nonexistent expectations ids are transformed to a noExpectation', function (assert) {

    const nonexistenteEpectations = {
      foo: true,
      bar: false,
      baz: true
    }
    assert.equal(challengeExpectations.configToExpectation(nonexistenteEpectations)(), '')
  })

  test('if a challenge does not define expectations, noExpectation is applied', function (assert) {
    assert.equal(challengeExpectations.expectationFor(createComponentMock({}))(), '')
  })

  test('if a challenge defines expectations but does not belong to a group, chapter or book, its expectations should be applied', function (assert) {
    assert.equal(challengeExpectations.expectationFor(challengeMock)(), 'ExpectationMock\nExpectationMock')
  })

  test('expectations from book, chapter, group and challenge should be combined', function (assert) {
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
    const challenge = createComponentMock({
      grupo: group,
      expectations: {
        decomposition: false
      }
    })
    assert.equal(challengeExpectations.expectationFor(challenge)(), 'ExpectationMock')
  })

  test('expectations ids for control group from a challenge with a valid configuration', function (assert) {
    const challengeWithValidConfiguration = createComponentMock({
      expectations: {
        decomposition: true
      }
    })
    assert.propEqual(challengeExpectations.expectationsIdsForControlGroup(challengeWithValidConfiguration), decompositionExpectsIdsForControlGroup)
  })

  test('expectations ids for control group from a challenge with an invalid configuration', function (assert) {
    const challengeWithValidConfiguration = createComponentMock({
      expectations: {
        alf: true
      }
    })
    assert.propEqual(challengeExpectations.expectationsIdsForControlGroup(challengeWithValidConfiguration), [])
  })

  test('expectations ids for control group from a challenge with a mixed configuration', function (assert) {
    assert.propEqual(challengeExpectations.expectationsIdsForControlGroup(challengeMock), decompositionExpectsIdsForControlGroup)
  })

});