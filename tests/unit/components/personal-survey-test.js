import { module, test } from 'qunit'
import { setupLoggedUser, setupPBTest } from '../../helpers/utils'
import config from '../../../config/environment'
import { fakeUser } from '../../helpers/mocks'
import fetchMock from 'fetch-mock'
import sinon from 'sinon'

const { baseURL } = config.pbApi

module('Unit | Components | personal-survey', function (hooks) {
  setupPBTest(hooks)
  setupLoggedUser(hooks)

  let personalSurvey
  hooks.beforeEach(function () {
    fetchMock.mock(`${baseURL}/answers`, fakeUser) //TODO: Abstraer
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

  async function testSaveAnswer(assert, storage) {
    await personalSurvey.saveAnswer({ text: "RESPONSE" })
    const { question, response } = storage.newAnswer.lastCall.lastArg
    assert.equal(question.id, 1)
    assert.equal(response.text, "RESPONSE")
    assert.ok(response.timestamp)
  }

  function answerUserQuestion(id) {
    const user = personalSurvey.pilasBloquesApi.getUser()
    user.answers.push(id) //TODO: Rename
    localStorage.setItem('PB_USER', JSON.stringify(user)) //TODO: Const
  }

  function answerSessionQuestion(id) {
    personalSurvey.pilasBloquesAnalytics.newAnswer(makeAnswer(id))
  }

  function makeAnswer(id, response) { return { question: { id }, response } }

})