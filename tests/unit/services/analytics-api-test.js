import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Service | analytics-api', function (hooks) {
  setupTest(hooks)

  var api

  hooks.beforeEach(function () {
    api = this.owner.lookup('service:analytics-api')
    localStorage.clear()
  })

  test('Should create new sessionId', function (assert) {
    assert.ok(api.checkSessionId())
  })

  test('Should save session', function (assert) {
    api.checkSessionId()
    const { id, timestamp } = getSession()
    assert.ok(id)
    assert.ok(timestamp)
  })

  test('Should keep the session for a while', function (assert) {
    const firstSessionId = api.checkSessionId()
    changeSessionTimestampByMinutes(1)
    const currentSessionId = api.checkSessionId()
    assert.equal(firstSessionId, currentSessionId)
  })

  test('Should change the session after a long time', function (assert) {
    const firstSessionId = api.checkSessionId()
    changeSessionTimestampByMinutes(31)
    const currentSessionId = api.checkSessionId()
    assert.notEqual(firstSessionId, currentSessionId)
  })
  
  function getSession() {
    return JSON.parse(localStorage.getItem(api.ANALYTICS_KEY))
  }
  
  function changeSessionTimestampByMinutes(minutes) {
    const session = getSession()
    const before = new Date()
    before.setMinutes(before.getMinutes() - minutes)
    session.timestamp = before
    localStorage.setItem(api.ANALYTICS_KEY, JSON.stringify(session))
  }

})