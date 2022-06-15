import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | experiments', function (hooks) {
  let experiments
  let storageMock
  let challengeExpectationsMock

  const solvedChallenge = {id: "13"}
  setupTest(hooks);

  hooks.beforeEach(function () {
    experiments = this.owner.lookup('service:experiments')
    experiments.set('decompositionTreatmentLength', 2)

    storageMock = {
      solvedChallenges: [],
      getSolvedChallenges(){
        return this.solvedChallenges
      }
    }
    experiments.storage = storageMock

    challengeExpectationsMock = {
      _decomposition: true,

      hasDecomposition(){
        return this._decomposition
      }
    }

    experiments.challengeExpectations = challengeExpectationsMock
  })


  test('Should show non scored expects - control group and feedback is enabled', function(assert) {
    experiments.set('group', 'control')
    assert.ok(experiments.shouldShowNonScoredExpects())
  })

  test('Should show non scored expects - treatment group and feedback is disabled', function(assert) {
    experiments.set('group', 'treatment')
    storageMock.solvedChallenges = ["13", "14", "15"]
    assert.ok(experiments.shouldShowNonScoredExpects())
  })

  test('Should NOT show non scored expects - treatment group and feedback is enabled', function(assert) {
    experiments.set('group', 'treatment')
    assert.notOk(experiments.shouldShowNonScoredExpects())
  })

  test('Should show congratulations modal - group is not affected', function (assert) {
    experiments.set('group', 'notAffected')
    assert.ok(experiments.shouldShowCongratulationsModal())
  })

  test('Should NOT show congratulations modal - group is affected', function (assert) {
    experiments.set('group', 'treatment')
    assert.notOk(experiments.shouldShowCongratulationsModal())
  })

  test('Feedback is disabled - solved challenges longer than decompositionTreatmentLength', function (assert) {
    storageMock.solvedChallenges = ["13", "14", "16"]
    assert.ok(experiments.feedbackIsDisabled())
  })

  test('Feedback is enabled - solved challenges equal decompositionTreatmentLength', function (assert) {
    storageMock.solvedChallenges = ["13", "14"]
    assert.notOk(experiments.feedbackIsDisabled())
  })

  test('Feedback is enabled - solved challenges shorter than decompositionTreatmentLength', function (assert) {
    storageMock.solvedChallenges = ["13"]
    assert.notOk(experiments.feedbackIsDisabled())
  })

  test('Should NOT update solved challenges if challenge was already solved', function (assert){
    storageMock.solvedChallenges = ["13"]
    
    assert.notOk(experiments.shouldUpdateSolvedChallenges(solvedChallenge))
  })

  test('Should NOT update solved challenges if challenge does not decomposition expect', function (assert){
    challengeExpectationsMock._decomposition = false
    assert.notOk(experiments.shouldUpdateSolvedChallenges(solvedChallenge))
  })

  test('Should update solved challenges when challenge has decomposition expect and is not already solved', function (assert){
    assert.ok(experiments.shouldUpdateSolvedChallenges(solvedChallenge))
  })


});




