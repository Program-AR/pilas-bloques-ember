import { module, test } from 'qunit'
import { setupPBUnitTest, setupLoggedUser } from '../../helpers/utils'
import { fakeUser } from '../../helpers/mocks'
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

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

  test('Fingerprint should only be generated once by ClientJs', function(assert){
    localStorage.clear()
    const spy = sinon.spy(service, 'newFingerprint')
    const newFingerprint = service.getFingerprint()
    const fingerprintSaved = service.getFingerprint()

    assert.ok(spy.calledOnce);    
    assert.equal(newFingerprint, fingerprintSaved)
  })
})

module('Unit | Service | storage | SimpleRead', function(hooks) {
  let service
  setupTest(hooks);

  hooks.beforeEach(function() {
    service = this.owner.lookup('service:storage')
    service.clear()
  })

  test('By default simple read mode is disabled', function (assert) {
    assert.notOk(service.getUseSimpleRead())
  })

  test('Enabled simple read mode', function (assert) {
    service.toggleSimpleRead()
    assert.ok(service.getUseSimpleRead())
  })
})

