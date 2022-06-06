import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | experiments', function (hooks) {
  let experiments
  let storageMock
  let activityExpectationsMock

  const solvedChallenge = {id: "13"}
  setupTest(hooks);

  hooks.beforeEach(function () {
    experiments = this.owner.lookup('service:experiments')
    experiments.set('group', "treatment")
    experiments.set('subtaskDivisionTreatmentLength', 2)

    storageMock = {
      solvedChallenges: [],
      getSolvedChallenges(){
        return this.solvedChallenges
      }
    }
    experiments.storage = storageMock

    activityExpectationsMock = {
      _decomposition: true,

      combinedExpectations(){
        return {decomposition: this._decomposition}
      },
      expectationsExist() { return true },
      mergedExpectations() {
        return this.combinedExpectations()
      }
    }

    experiments.activityExpectations = activityExpectationsMock
  })

  test('Should show congratulations modal when group is not affected', function (assert) {
    experiments.set('group', "notAffected")
    assert.ok(experiments.shouldShowCongratulationsModal())
  })

  test('Should NOT show congratulations modal when group is affected and feedback is enabled', function (assert) {
    assert.notOk(experiments.shouldShowCongratulationsModal())
  })

  test('Should show congratulations modal when feedback is disabled', function (assert) {
    storageMock.solvedChallenges = ["13", "14", "16"]
    assert.ok(experiments.shouldShowCongratulationsModal())
  })

  test('Should NOT update solved challenges if challenge was already solved', function (assert){
    storageMock.solvedChallenges = ["13"]
    
    assert.notOk(experiments.shouldUpdateSolvedChallenges(solvedChallenge))
  })

  test('Should NOT update solved challenges if challenge does not have subtask division expect', function (assert){
    activityExpectationsMock._decomposition = false
    assert.notOk(experiments.shouldUpdateSolvedChallenges(solvedChallenge))
  })

  test('Should update solved challenges when challenge has subtask division expect and is not already solved', function (assert){
    assert.ok(experiments.shouldUpdateSolvedChallenges(solvedChallenge))
  })


});



