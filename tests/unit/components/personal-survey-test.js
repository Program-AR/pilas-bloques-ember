import sinon from 'sinon'
import { module, test } from 'qunit'
import { setupLoggedUser, setupPBUnitTest } from '../../helpers/utils'

module('Unit | Components | personal-survey', function (hooks) {
  setupPBUnitTest(hooks)
  setupLoggedUser(hooks)

  let personalSurvey
  var storage
  hooks.beforeEach(function () {
    storage = this.owner.lookup('service:storage')
    personalSurvey = this.owner.factoryFor('component:personal-survey').create()
    sinon.spy(personalSurvey.pilasBloquesApi)
    sinon.spy(personalSurvey.pilasBloquesAnalytics)
  })

  test('At the beginnig should be first question', function (assert) {
    assert.equal(personalSurvey.nextQuestion().id, 1)
  })

  test('Should not ask already user answered questions', function (assert) {
    answerUserQuestion(1)
    assert.equal(personalSurvey.nextQuestion().id, 2)
  })

  test('Should not ask already session answered questions', function (assert) {
    answerSessionQuestion(1)
    assert.equal(personalSurvey.nextQuestion().id, 2)
  })

  test('Should save user answers', async function (assert) {
    await testSaveAnswer(assert, personalSurvey.pilasBloquesApi)
  })

  test('Should save session answers', async function (assert) {
    personalSurvey.questions[0].askEachSession = true
    await testSaveAnswer(assert, personalSurvey.pilasBloquesAnalytics)
  })

  test('Should hide on complete question', async function (assert) {
    window.surveyWindow = { hide: sinon.stub() }
    await doResponse()
    assert.ok(window.surveyWindow.hide.called)
  })

  async function testSaveAnswer(assert, storage) {
    await doResponse()
    const { question, response } = storage.newAnswer.lastCall.lastArg
    assert.equal(question.id, 1)
    assert.equal(response.text, "RESPONSE")
    assert.ok(response.timestamp)
  }

  function doResponse() {
    return personalSurvey.completeAnswer({ text: "RESPONSE" })
  }

  function answerUserQuestion(id) {
    const user = personalSurvey.pilasBloquesApi.getUser()
    user.answeredQuestionIds.push(id)
    storage.saveUser(user)
  }

  async function answerSessionQuestion(id) {
    await personalSurvey.pilasBloquesAnalytics.newAnswer(makeAnswer(id))
  }

  function makeAnswer(id, response) { return { question: { id }, response } }

})