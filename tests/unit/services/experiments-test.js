import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | experiments', function (hooks) {
  let experiments
  let storageMock
  let challengeExpectationsMock

  const solvedChallenge = {id: "13"}

  const solvedChallengesFeedbackDisabled = ["13", "14"]

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

  //Show non scored expects

  testShouldShowScoredExpectations('control', 'enabled', false)
  testShouldShowScoredExpectations('treatment', 'enabled', true)
  testShouldShowScoredExpectations('treatment', 'disabled', false, solvedChallengesFeedbackDisabled)

  //Show feedback expectations (bubbles)

  testShouldShowBlocksExpectationsFeedback('control', 'enabled', false)
  testShouldShowBlocksExpectationsFeedback('treatment', 'enabled', true)
  testShouldShowBlocksExpectationsFeedback('treatment', 'disabled', false, solvedChallengesFeedbackDisabled)


  //Congratulations modal

  test('Should show congratulations modal - group is not affected', function (assert) {
    experiments.set('group', 'notAffected')
    assert.ok(experiments.shouldShowCongratulationsModal())
  })

  test('Should NOT show congratulations modal - group is affected', function (assert) {
    experiments.set('group', 'treatment')
    assert.notOk(experiments.shouldShowCongratulationsModal())
  })

  //Feedback is disabled
  test('Feedback is disabled - solved challenges longer than decompositionTreatmentLength', function (assert) {
    storageMock.solvedChallenges = ["13", "14", "16"]
    assert.ok(experiments.feedbackIsDisabled())
  })

  test('Feedback is disabled - solved challenges equal decompositionTreatmentLength', function (assert) {
    storageMock.solvedChallenges = ["13", "14"]
    assert.ok(experiments.feedbackIsDisabled())
  })

  test('Feedback is enabled - solved challenges shorter than decompositionTreatmentLength', function (assert) {
    storageMock.solvedChallenges = ["13"]
    assert.notOk(experiments.feedbackIsDisabled())
  })

  //update challenges

  test('Should NOT update solved challenges if challenge was already solved', function (assert){
    storageMock.solvedChallenges = ["13"]
    
    assert.notOk(experiments.shouldUpdateSolvedChallenges(solvedChallenge))
  })

  test('Should NOT update solved challenges if challenge does not have decomposition expect', function (assert){
    challengeExpectationsMock._decomposition = false
    assert.notOk(experiments.shouldUpdateSolvedChallenges(solvedChallenge))
  })

  test('Should update solved challenges when challenge has decomposition expect and is not already solved', function (assert){
    assert.ok(experiments.shouldUpdateSolvedChallenges(solvedChallenge))
  })

  function testShouldShowScoredExpectations(group, feedback, shouldShow, solvedChallenges){
    testShouldShow('scored expects', group, feedback, shouldShow, (() => experiments.shouldShowScoredExpectations()), solvedChallenges)
  }

  function testShouldShowBlocksExpectationsFeedback(group, feedback, shouldShow, solvedChallenges){
    testShouldShow('blocks expectation feedback', group, feedback, shouldShow, (() => experiments.shouldShowBlocksExpectationFeedback()), solvedChallenges)
  }

  function testShouldShow(name, group, feedback, shouldShow, callback, solvedChallenges = []){
    test(`Should ${shouldShow ? "" : "NOT"} show ${name} - ${group} group and feedback ${feedback}`, function(assert){
      storageMock.solvedChallenges = solvedChallenges
      experiments.set('group', group)
      const result = callback()
      if(shouldShow){
        assert.ok(result)
      }else{
        assert.notOk(result)
      }
    })
  }


});




