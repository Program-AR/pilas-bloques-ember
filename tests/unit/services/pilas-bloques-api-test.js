import { module, test } from 'qunit'
import { later } from '@ember/runloop'
import fetchMock from 'fetch-mock'
import { fetchCalled, fetchCallBody, fetchCallHeader, setupPBUnitTest, mockApi } from '../../helpers/utils'
import config from '../../../config/environment'
import { fakeUser } from '../../helpers/mocks'

const { baseURL } = config.pbApi

module('Unit | Service | pilas-bloques-api', function (hooks) {
  setupPBUnitTest(hooks)

  var api
  var storage
  hooks.beforeEach(function () {
    api = this.owner.lookup('service:pilas-bloques-api')
    storage = this.owner.lookup('service:storage')
  })

  authTest('On login should save user data', () => api.login({}))
  authTest('On register should save user data', () => api.register({}))
  authTest('On change password should save user data', () => api.changePassword({}))
  authTest('On new user answer should update user data', () => api.newAnswer({}))

  test('On logout should delete user & session data', function (assert) {
    storage.saveUser(fakeUser)
    storage.saveAnalyticsSession(fakeUser)
    api.logout()
    assert.notOk(storage.getUser())
    assert.notOk(storage.getAnalyticsSession())
  })

  test('On run program should create new solution id', function (assert) {
    const done = assert.async()
    assert.ok(api.runProgram())
    later(done)
  })


  test('If not connected does not send request', async function (assert) {
    api.connected = false
    await api.login({})
    assert.notOk(fetchCalled(baseURL))
  })

  test('If not connected should alert server error', async function (assert) {
    api.connected = false
    await api.login({})
    assert.ok(api.paperToaster.show.called)
  })

  test('should not alert server error on no critical requests', function (assert) {
    fetchMock.mock(`begin:${baseURL}`, { throws: 'ERROR' })
    const done = assert.async()
    api.openChallenge(1)
    api.runProgram(1, "program", {}, false)
    api.executionFinished(1010, {})
    assert.notOk(api.paperToaster.show.called)
    later(done)
  })

  test('should set flags during request', async function (assert) {
    const response = api.login({})
    assert.ok(api.loading.login)
    await response
    assert.notOk(api.loading.login)
  })

  test('should add session to body', async function (assert) {
    await api.login({})
    assert.ok(fetchCallBody().session)
  })

  test('if user is logged should set authorization header', async function (assert) {
    storage.saveUser(fakeUser)
    await api.login({})
    assert.equal(fetchCallHeader().Authorization, 'Bearer TOKEN')
  })

  test('should handle server error', async function (assert) {
    mockApi(`login`, { body: "SERVER ERROR", status: 400 })
    await api.login({}).catch(err => {
      assert.deepEqual(err, {
        message: "SERVER ERROR",
        status: 400
      })
    })
  })

  test('should handle fetch error', async function (assert) {
    await api._send('GET', 'error').catch(err => {
      assert.equal(err, 'ERROR')
    })
  })

  async function authTest(description, action) {
    test(description, async function (assert) {
      await action()
      assert.deepEqual(storage.getUser(), fakeUser)
    })
  }
})
