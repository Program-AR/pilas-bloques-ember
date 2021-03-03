import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import { hbs } from 'ember-cli-htmlbars'
import { setupLoggedUser } from '../../helpers/utils'

module('Integration | Component | survey-window', function(hooks) {
  setupRenderingTest(hooks)
  setupLoggedUser(hooks)

  hooks.afterEach(function () {
    this.owner.lookup('component:personal-survey').close()
  })

  test('it renders', async function(assert) {
    await render(hbs`<PersonalSurvey />`)

    assert.equal(this.element.textContent.trim(), '')
  })
})
