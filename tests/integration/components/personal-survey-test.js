import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import { hbs } from 'ember-cli-htmlbars'
import { setupLoggedUser } from '../../helpers/utils'
import fetchMock from 'fetch-mock'

module('Integration | Component | survey-window', function (hooks) {
  var api

  setupRenderingTest(hooks)
  setupLoggedUser(hooks)

  hooks.beforeEach(function () {
    api = this.owner.lookup('service:pilas-bloques-api')
  })

  hooks.afterEach(function () {
    this.owner.lookup('component:personal-survey').close()
    fetchMock.reset()
  })

  const personalSurveyDidRender = (element) => element.innerHTML.toString().includes("Nothing to show, it's all javascript")

  test('it renders', async function (assert) {
    await render(hbs`<PersonalSurvey />`)
    assert.equal(this.element.textContent.trim(), '')
    assert.ok(window.surveyWindow.isShowing)
  })

  test('When the user is not logged in, should not show questions', async function (assert) {
    api.logout()
    await render(hbs`<SessionButton />`)
    assert.notOk(personalSurveyDidRender(this.element))
  })

  test('When the user is logged in and the api is accessible, should show questions', async function (assert) {
    await render(hbs`<SessionButton />`)
    assert.ok(personalSurveyDidRender(this.element))
  })

  test('When the user is logged in and the api is not accessible, should not show questions', async function (assert) {
    fetchMock.get(/.*/, { throws: 'Error' })
    await api.userExists('pepita').catch(() => { }) // Errors set connected in false.
    await render(hbs`<SessionButton />`)
    assert.ok(!(window.surveyWindow && window.surveyWindow.isShowing)) // 50% de las veces el surveyWindow no se crea, y las otras veces si, con el isShowing en falso.
  })
})
