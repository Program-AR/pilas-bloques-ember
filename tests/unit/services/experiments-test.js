import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon'

module('Unit | Service | experiments', function (hooks) {
  let experiments
  let storageMock
  let challengeExpectationsMock
  let pilasBloquesApiMock

  const solvedChallenge = { id: "13" }
  const solvedChallengesFeedbackDisabled = ["13", "14"]
  const userLogged = { experimentGroup: "control" }

  setupTest(hooks);

  hooks.beforeEach(function () {
    experiments = this.owner.lookup('service:experiments')
    experiments.set('decompositionTreatmentLength', 2)

    storageMock = {
      solvedChallenges: [],
      experimentGroup: null,
      ip: "123.1.123.123",
      getSolvedChallenges() { return this.solvedChallenges },
      getExperimentGroup() { return this.experimentGroup },
      saveExperimentGroup() { this.user = { experimentGroup: "treatment" } },
      getUserIp() { return this.ip }
    }

    challengeExpectationsMock = {
      challengeDoesNotHaveExpectations: false,
      _decomposition: true,
      hasDecomposition() { return this._decomposition },
      doesNotHaveExpectations(/* challenge */) { return this.challengeDoesNotHaveExpectations }
    }

    const stub = sinon.stub()
    stub.callsFake(function () {
      this.user = { experimentGroup: "treatment" }
    })

    pilasBloquesApiMock = {
      user: null,
      getUser() { return this.user },
      saveExperimentGroup: stub
    }

    experiments.storage = storageMock
    experiments.challengeExpectations = challengeExpectationsMock
    experiments.pilasBloquesApi = pilasBloquesApiMock
  })

  //Show non scored expects

  testShouldShowScoredExpectations('control', 'enabled', false)
  testShouldShowScoredExpectations('treatment', 'enabled', true)
  testShouldShowScoredExpectations('treatment', 'disabled', false, solvedChallengesFeedbackDisabled)

  //Show feedback expectations (bubbles)

  testShouldShowBlocksWarningExpectationsFeedback('control', 'enabled', false)
  testShouldShowBlocksWarningExpectationsFeedback('treatment', 'enabled', true)
  testShouldShowBlocksWarningExpectationsFeedback('treatment', 'disabled', false, solvedChallengesFeedbackDisabled)


  //Congratulations modal

  test('Should show congratulations modal - group is not affected', function (assert) {
    experiments.set('groupSelectionStrategy', 'notAffected')
    assert.ok(experiments.shouldShowCongratulationsModal())
  })

  test('Should show congratulations modal - challenge does not has expectations', function (assert) {
    experiments.set('groupSelectionStrategy', 'treatment')
    challengeExpectationsMock.challengeDoesNotHaveExpectations = true
    assert.ok(experiments.shouldShowCongratulationsModal())
  })

  test('Should NOT show congratulations modal - group is affected and challenge has expectations', function (assert) {
    experiments.set('groupSelectionStrategy', 'treatment')
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

  test('Should NOT update solved challenges if challenge was already solved', function (assert) {
    storageMock.solvedChallenges = ["13"]
    assert.notOk(experiments.shouldUpdateSolvedChallenges(solvedChallenge))
  })

  test('Should NOT update solved challenges if challenge does not have decomposition expect', function (assert) {
    challengeExpectationsMock._decomposition = false
    assert.notOk(experiments.shouldUpdateSolvedChallenges(solvedChallenge))
  })

  test('Should update solved challenges when challenge has decomposition expect and is not already solved', function (assert) {
    assert.ok(experiments.shouldUpdateSolvedChallenges(solvedChallenge))
  })

  //autoassign

  test('ExperimentGroup gets group from storage if exists and user is not logged', function (assert) {
    experiments.set('groupSelectionStrategy', 'autoassign')
    storageMock.experimentGroup = "notAffected"
    assert.deepEqual(experiments.experimentGroup(), "notAffected")
  })

  test('ExperimentGroup gets group from api if user is logged and has group', function (assert) {
    experiments.set('groupSelectionStrategy', 'autoassign')
    pilasBloquesApiMock.user = userLogged
    assert.deepEqual(experiments.experimentGroup(), "control")
  })

  test('Random experimentGroup is generated when user is NOT logged, and is NOT in storage ', function (assert) {
    experiments.set('groupSelectionStrategy', 'autoassign')
    assert.ok(experiments.possibleGroups.includes(experiments.experimentGroup()))
  })

  test('Random group is saved in api if user is logged and does NOT have a group', function (assert) {
    experiments.set('groupSelectionStrategy', 'autoassign')
    pilasBloquesApiMock.user = { experimentGroup: null }

    assert.ok(experiments.possibleGroups.includes(experiments.experimentGroup()))
    assert.deepEqual(pilasBloquesApiMock.user.experimentGroup, "treatment")
  })

  test('Should assign notAffected group if could not get api', function (assert) {
    experiments.set('groupSelectionStrategy', 'autoassign')
    storageMock.ip = null
    assert.deepEqual(experiments.experimentGroup(), "notAffected")
  })

  test('Experiment group should not be sent to the API if it could not be calculated', function (assert) {
    storageMock.ip = undefined
    pilasBloquesApiMock.user = { experimentGroup: "treatment" }
    experiments.randomizeAndSaveExperimentGroup()
    assert.notOk(pilasBloquesApiMock.saveExperimentGroup.called)
  })

  test('Experiment group should not be sent to the API if it could be calculated but user does not exist', function (assert) {
    storageMock.ip = undefined
    experiments.randomizeAndSaveExperimentGroup()
    assert.notOk(pilasBloquesApiMock.saveExperimentGroup.called)
  })

  test('Experiment group should be sent to the API if it could be calculated and user exists', function (assert) {
    storageMock.ip = '127.0.0.1'
    pilasBloquesApiMock.user = { experimentGroup: "treatment" }
    experiments.randomizeAndSaveExperimentGroup()
    assert.ok(pilasBloquesApiMock.saveExperimentGroup.called)
  })

  function testShouldShowScoredExpectations(group, feedback, shouldShow, solvedChallenges) {
    testShouldShow('scored expects', group, feedback, shouldShow, (() => experiments.shouldShowScoredExpectations()), solvedChallenges)
  }

  function testShouldShowBlocksWarningExpectationsFeedback(group, feedback, shouldShow, solvedChallenges) {
    testShouldShow('blocks warning expectation feedback', group, feedback, shouldShow, (() => experiments.shouldShowBlocksWarningExpectationFeedback()), solvedChallenges)
  }

  function testShouldShow(name, group, feedback, shouldShow, callback, solvedChallenges = []) {
    test(`Should ${shouldShow ? "" : "NOT"} show ${name} - ${group} group and feedback ${feedback}`, function (assert) {
      storageMock.solvedChallenges = solvedChallenges
      experiments.set('groupSelectionStrategy', group)
      const result = callback()
      if (shouldShow) {
        assert.ok(result)
      } else {
        assert.notOk(result)
      }
    })
  }


});




