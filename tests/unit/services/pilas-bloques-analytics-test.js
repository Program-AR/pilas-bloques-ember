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
    const { id, firstInteraction, answers } = getSession()
    assert.ok(id)
    assert.ok(firstInteraction)
    assert.ok(answers)
  })

  test('Should add new answers', function (assert) {
    pbAnalytics.newAnswer({ id: 'TEST' })
    const { answers } = getSession()
    assert.deepEqual(answers, [{ id: 'TEST' }])
  })

  test('Should keep the session for a while', function (assert) {
    const firstSessionId = pbAnalytics.getSession().id
    changeSessionFirstInteractionByMinutes(1)
    const currentSessionId = pbAnalytics.getSession().id
    assert.equal(firstSessionId, currentSessionId)
  })

  test('Should change the session after a long time', function (assert) {
    const firstSessionId = pbAnalytics.getSession().id
    changeSessionFirstInteractionByMinutes(31)
    const currentSessionId = pbAnalytics.getSession().id
    assert.notEqual(firstSessionId, currentSessionId)
  })

  function getSession() {
    return storage.getAnalyticsSession()
  }

  function changeSessionFirstInteractionByMinutes(minutes) {
    const session = getSession()
    const before = new Date()
    before.setMinutes(before.getMinutes() - minutes)
    session.firstInteraction = before
    storage.saveAnalyticsSession(session)
  }

})