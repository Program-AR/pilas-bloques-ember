import { module, test } from 'qunit'
import { assertHasProps, setupPBUnitTest } from '../../helpers/utils'

module('Unit | Service | pilas-bloques-analytics', function (hooks) {
  setupPBUnitTest(hooks)

  var pbAnalytics
  var storage
  var firstSessionId
  hooks.beforeEach(function () {
    pbAnalytics = this.owner.lookup('service:pilas-bloques-analytics')
    storage = this.owner.lookup('service:storage')
    firstSessionId = pbAnalytics.getSession().id // Creates session
  })

  test('Context saves session, online, browserId, usserId, version, experimentGroup, url, ip', async function(assert){
    const context = await pbAnalytics.context()
    assertHasProps(assert, context, 'answers', 'browserId', 'lastInteraction', 'id', 'online', 'userId', 'version', 'experimentGroup', 'url', 'ip')
  })

  test('Should create new sessionId', function (assert) {
    assert.ok(firstSessionId)
  })

  test('Should save session', function (assert) {
    const { id, lastInteraction, answers } = getStorageSession()
    assert.ok(id)
    assert.ok(lastInteraction)
    assert.ok(answers)
  })

  test('Should add new answers', async function (assert) {
    await pbAnalytics.newAnswer({ id: 'TEST' })
    const { answers } = getStorageSession()
    assert.deepEqual(answers, [{ id: 'TEST' }])
  })

  test('Should keep the session for a while', function (assert) {
    substractMinutesFromStorageSession(1)
    const currentSessionId = pbAnalytics.getSession().id
    assert.equal(firstSessionId, currentSessionId)
  })

  test('Should change the session after a long time', function (assert) {
    substractMinutesFromStorageSession(31)
    const currentSessionId = pbAnalytics.getSession().id
    assert.notEqual(firstSessionId, currentSessionId)
  })

  test('Should update lastInteraction after an interaction', function (assert) {
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