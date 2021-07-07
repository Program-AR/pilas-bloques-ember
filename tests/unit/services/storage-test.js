import { module, test } from 'qunit'
import { setupPBUnitTest, setupLoggedUser } from '../../helpers/utils'
import { fakeUser } from '../../helpers/mocks'

module('Unit | Service | storage', function(hooks) {
  let service
  setupPBUnitTest(hooks)
  setupLoggedUser(hooks)

  hooks.beforeEach(function() {
    service = this.owner.lookup('service:storage')
  })

  test('should get localstorage data', function(assert) {
    assert.deepEqual(service.getUser(), fakeUser)
  })

  test('should return null when data not exist', function(assert) {
    localStorage.clear()
    assert.deepEqual(service.getUser(), null)
  })

  test('on fails should redirect to /clear', function(assert) {
    brokeStorageData()
    service.getUser()
    assert.ok(service.router.transitionTo.calledWith('clear'))
  })

  function brokeStorageData() {
    localStorage.setItem(service.USER_KEY, "123{ASD")
  }
})


