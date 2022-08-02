import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setUpTestLocale } from '../../helpers/utils';
import { createComponentMock } from '../../helpers/mocks';

module('Unit | Service | challenge-expectations', function (hooks) {
  setupTest(hooks);
  setUpTestLocale(hooks)

  var challengeExpectations
  const expectationStringMock = 'ExpectationMock'
  const expectationsConfig = {
    decomposition: true,
    simpleRepetition: true
  }
  const expectationMock = (/* expectation */) => expectationStringMock
  const idsMapperMock = {
    idsToSingleEvaluation: function (/* ...ids */) {
      return {
        expectation(/* intl */) {
          return expectationMock
        },
        partialFeedbackItems(/* intl */) {
          return []
        }
      }
    }
  }

  let challengeMock

  hooks.beforeEach(function () {
    challengeExpectations = this.owner.lookup('service:challenge-expectations');
    challengeExpectations.set('idsMapper', idsMapperMock)
    challengeMock = createComponentMock({
      expectations: expectationsConfig
    })
  });

  test('merged expectations for a single expectation configuration', function (assert) {
    assert.propEqual(challengeExpectations.mergeConfigurations([expectationsConfig]), expectationsConfig)
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
    assert.propEqual(challengeExpectations.mergeConfigurations([expectationsConfig, conditionalAlternativeConfig]), mergedConfig)
  })

  test('merged expectations for multiple configurations with keys in common should prioritize values with higher priority', function (assert) {
    const configWithHigherPriority = {
      decomposition: false
    }
    const mergedConfig = {
      decomposition: false,
      simpleRepetition: true
    }
    assert.propEqual(challengeExpectations.mergeConfigurations([expectationsConfig, configWithHigherPriority]), mergedConfig)
  })

  test('domain expectations to mulang expectations', function (assert) {
    assert.equal(challengeExpectations.configToEvaluation(expectationsConfig).expectation()(), 'ExpectationMock')
  })

  test('if a challenge does not define expectations, noExpectation is applied', function (assert) {
    assert.equal(challengeExpectations.expectationFor(createComponentMock({}))(), '')
  })

  test('if a challenge defines expectations but does not belong to a group, chapter or book, its expectations should be applied', function (assert) {
    assert.equal(challengeExpectations.expectationFor(challengeMock)(), 'ExpectationMock')
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

});