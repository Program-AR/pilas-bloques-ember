import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';
import { safeVisit, setupPBAcceptanceTest, awaitChallengeLoading, setUpTestLocale } from "../helpers/utils"

module('Acceptance | language change', function (hooks) {
  setupPBAcceptanceTest(hooks)
  setUpTestLocale(hooks)

  hooks.beforeEach(async function () {
    await safeVisit('/desafio/1');
    await awaitChallengeLoading();
    this.owner.factoryFor('component:language-menu').create().send('setLanguage', 'en-us')
  })

  test('On language change should change challenge description language', async function (assert) {
    const description = this.element.querySelector('.exercise-text').textContent
    assert.ok(description.includes('Help our Alien push the button of his lab.'))
  });
});
