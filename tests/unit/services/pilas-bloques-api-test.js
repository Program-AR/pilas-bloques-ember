import { module, test } from 'qunit'
import { later } from '@ember/runloop'
import { fetchCallBody, fetchCallHeader, setupPBUnitTest, mockApi, assertHasProps, failAllApiFetchs } from '../../helpers/utils'
import { fakeUser } from '../../helpers/mocks'

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

  test('If fetch succeeds should be connected', async function (assert) {
    await api.ping()
    assert.ok(api.connected)
  })

  test('If fetch fails should not be connected', async function (assert) {
    failAllApiFetchs()
    await api.ping().catch(() => { })
    assert.notOk(api.connected)
  })

  test('If not connected should alert server error', async function (assert) {
    failAllApiFetchs()
    await api.login({}).catch(() => { })
    assert.ok(api.paperToaster.show.called)
  })

  test('should not alert server error on no critical requests', function (assert) {
    failAllApiFetchs()
    const done = assert.async()
    api.openChallenge(1)
    api.runProgram(1, "program", {})
    api.executionFinished(1010, {}, {})
    assert.notOk(api.paperToaster.show.called)
    later(done)
  })

  test('should set flags during request', async function (assert) {
    const response = api.login({})
    assert.ok(api.loading.login)
    await response
    assert.notOk(api.loading.login)
  })

  test('should add context to body', async function (assert) {
    await api.login({})
    const context = fetchCallBody().context
    assertHasProps(assert, context, 'answers', 'browserId', 'lastInteraction', 'id', 'online', 'userId', 'version')
  })

  test('should add timestamp to body', async function (assert) {
    await api.login({})
    assert.ok(fetchCallBody().timestamp)
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
