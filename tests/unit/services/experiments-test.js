import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | experiments', function (hooks) {
  let experiments

  let storageMock

  setupTest(hooks);

  hooks.beforeEach(function () {
    experiments = this.owner.lookup('service:experiments')
    storageMock = {
      getSolvedChallenges(){
        return []
      }
    }
    experiments.storage = storageMock
  })

  test('Should show congratulations modal when group is not affected', function (assert) {
    experiments.set('group', "notAffected")
    assert.ok(experiments.shouldShowCongratulationsModal())
  })

  test('Should NOT show congratulations modal when group is affected', function (assert) {
    experiments.set('group', "control")
    assert.notOk(experiments.shouldShowCongratulationsModal())
  })

});



