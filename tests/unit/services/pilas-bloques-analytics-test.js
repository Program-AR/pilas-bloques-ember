import { module, test } from 'qunit'
import { setupPBUnitTest } from '../../helpers/utils'

module('Unit | Service | pilas-bloques-analytics', function (hooks) {
  setupPBUnitTest(hooks)

  var pbAnalytics
  var storage
  hooks.beforeEach(function () {
    pbAnalytics = this.owner.lookup('service:pilas-bloques-analytics')
    storage = this.owner.lookup('service:storage')
  })

  test('Should create new sessionId', function (assert) {
    assert.ok(pbAnalytics.getSession().id)
  })

  test('Should save session', function (assert) {
    pbAnalytics.getSession()
    const { id, lastInteraction, answers } = getStorageSession()
    assert.ok(id)
    assert.ok(lastInteraction)
    assert.ok(answers)
  })

  test('Should add new answers', function (assert) {
    pbAnalytics.newAnswer({ id: 'TEST' })
    const { answers } = getStorageSession()
    assert.deepEqual(answers, [{ id: 'TEST' }])
  })

  test('Should keep the session for a while', function (assert) {
    const firstSessionId = pbAnalytics.getSession().id
    substractMinutesFromStorageSession(1)
    const currentSessionId = pbAnalytics.getSession().id
    assert.equal(firstSessionId, currentSessionId)
  })

  test('Should change the session after a long time', function (assert) {
    const firstSessionId = pbAnalytics.getSession().id
    substractMinutesFromStorageSession(31)
    const currentSessionId = pbAnalytics.getSession().id
    assert.notEqual(firstSessionId, currentSessionId)
  })

  test('Should update lastInteraction after an interaction', function (assert) {
    pbAnalytics.getSession() // Creates session
    substractMinutesFromStorageSession(15)
    const firstSessionInteraction = getStorageSession().lastInteraction

    assert.ok(pbAnalytics.getSession().lastInteraction > firstSessionInteraction)
  })

  function getStorageSession() {
    return storage.getAnalyticsSession()
  }

  function substractMinutesFromStorageSession(minutes) {
    const session = getStorageSession()
    session.lastInteraction.setMinutes(session.lastInteraction.getMinutes() - minutes)
    storage.saveAnalyticsSession(session)
  }

})