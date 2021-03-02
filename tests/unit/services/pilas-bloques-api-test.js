import { module, test } from 'qunit'
import { later } from '@ember/runloop'
import fetchMock from 'fetch-mock'
import { fetchCalled, fetchCallBody, fetchCallHeader, setupPBTest } from '../../helpers/utils'
import config from '../../../config/environment'
import { fakeUser } from '../../helpers/mocks'

const { baseURL } = config.pbApi

module('Unit | Service | pilas-bloques-api', function (hooks) {
  setupPBTest(hooks)

  var api

  hooks.beforeEach(function () {
    fetchMock.mock(`${baseURL}/login`, fakeUser)
    fetchMock.mock(`${baseURL}/register`, fakeUser)
    fetchMock.mock(`${baseURL}/error`, { throws: 'ERROR' })
    fetchMock.mock(`begin:${baseURL}`, 200)
    api = this.owner.lookup('service:pilas-bloques-api')
  })

  test('On login should save user data', async function (assert) {
    await api.login({})
    assert.deepEqual(getUser(), fakeUser)
  })

  test('On register should save user data', async function (assert) {
    await api.register({})
    assert.deepEqual(getUser(), fakeUser)
  })

  test('On logout should delete user data', function (assert) {
    saveUser(fakeUser)
    api.logout()
    assert.notOk(getUser())
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
    api.runProgram(1, "program", {})
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
    saveUser(fakeUser)
    await api.login({})
    assert.equal(fetchCallHeader().Authorization, 'Bearer TOKEN')
  })

  test('should handle server error', async function (assert) {
    fetchMock.mock(`${baseURL}/login`, { body: "SERVER ERROR", status: 400 })
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


  function getUser() {
    return JSON.parse(localStorage.getItem(api.USER_KEY))
  }

  function saveUser(data) {
    return localStorage.setItem(api.USER_KEY, JSON.stringify(data))
  }
})