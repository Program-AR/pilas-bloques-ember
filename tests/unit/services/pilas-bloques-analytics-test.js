import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Service | pilas-bloques-analytics', function (hooks) {
  setupTest(hooks)

  var pbAnalytics

  hooks.beforeEach(function () {
    pbAnalytics = this.owner.lookup('service:pilas-bloques-analytics')
    localStorage.clear()
  })

  test('Should create new sessionId', function (assert) {
    assert.ok(pbAnalytics.getSession().id)
  })

  test('Should save session', function (assert) {
    pbAnalytics.getSession().id
    const { id, timestamp } = getSession()
    assert.ok(id)
    assert.ok(timestamp)
  })

  test('Should keep the session for a while', function (assert) {
    const firstSessionId = pbAnalytics.getSession().id
    changeSessionTimestampByMinutes(1)
    const currentSessionId = pbAnalytics.getSession().id
    assert.equal(firstSessionId, currentSessionId)
  })

  test('Should change the session after a long time', function (assert) {
    const firstSessionId = pbAnalytics.getSession().id
    changeSessionTimestampByMinutes(31)
    const currentSessionId = pbAnalytics.getSession().id
    assert.notEqual(firstSessionId, currentSessionId)
  })
  
  function getSession() {
    return JSON.parse(localStorage.getItem(pbAnalytics.ANALYTICS_KEY))
  }
  
  function changeSessionTimestampByMinutes(minutes) {
    const session = getSession()
    const before = new Date()
    before.setMinutes(before.getMinutes() - minutes)
    session.timestamp = before
    localStorage.setItem(pbAnalytics.ANALYTICS_KEY, JSON.stringify(session))
  }

})