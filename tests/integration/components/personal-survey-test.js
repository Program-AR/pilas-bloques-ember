import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import { hbs } from 'ember-cli-htmlbars'
import { setupLoggedUser, setUpTestLocale } from '../../helpers/utils'
import fetchMock from 'fetch-mock'

module('Integration | Component | survey-window', function (hooks) {
  var api, experiments

  setupRenderingTest(hooks)
  setupLoggedUser(hooks)
  setUpTestLocale(hooks)

  hooks.beforeEach(function () {
    api = this.owner.lookup('service:pilas-bloques-api')
    experiments = this.owner.lookup('service:experiments')
    experiments.set('groupSelectionStrategy', 'notAffected')
  })

  hooks.afterEach(function () {

    this.owner.lookup('component:personal-survey').close()
    fetchMock.reset()
  })

  const surveyExists = () => window.surveyWindow && window.surveyWindow.isShowing

  test('it renders', async function (assert) {
    await render(hbs`<PersonalSurvey />`)
    assert.equal(this.element.textContent.trim(), '')
    assert.ok(surveyExists())
  })

  test('When the user is not logged in, should not show questions', async function (assert) {
    api.logout()
    await render(hbs`<SessionButton />`)
    assert.notOk(surveyExists())
  })

  test('When the user is logged in and the api is accessible, should show questions', async function (assert) {
    await render(hbs`<SessionButton />`)
    assert.ok(surveyExists())
  })

  test('When the user is logged in and the api is not accessible, should not show questions', async function (assert) {
    api.connected = false
    await render(hbs`<SessionButton />`)
    assert.notOk(surveyExists())
  })

  test('When experiments are off, survey doesnt show', async function (assert) {
    experiments.set('groupSelectionStrategy', 'off')
    await render(hbs`<SessionButton />`)
    assert.notOk(surveyExists())
  })
})
