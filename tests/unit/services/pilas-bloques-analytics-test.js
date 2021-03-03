import { module, test } from 'qunit'
import { setupPBTest } from '../../helpers/utils'

module('Unit | Service | pilas-bloques-analytics', function (hooks) {
  setupPBTest(hooks)

  var pbAnalytics
  hooks.beforeEach(function () {
    pbAnalytics = this.owner.lookup('service:pilas-bloques-analytics')
  })

  test('Should create new sessionId', function (assert) {
    assert.ok(pbAnalytics.getSession().id)
  })

  test('Should save session', function (assert) {
    pbAnalytics.getSession()
    const { id, timestamp, answers } = getSession()
    assert.ok(id)
    assert.ok(timestamp)
    assert.ok(answers)
  })

  test('Should add new answers', function (assert) {
    pbAnalytics.newAnswer({ id: 'TEST' })
    const { answers } = getSession()
    assert.deepEqual(answers, [{ id: 'TEST' }])
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