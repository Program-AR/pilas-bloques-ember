import { visit } from '@ember/test-helpers'
import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import setupMirage from "ember-cli-mirage/test-support/setup-mirage"
import simulateRouterHooks from "../helpers/simulate-router.hooks"
import { awaitChallengeLoading } from "../helpers/utils"

module('Acceptance | challenge content internationalization test', function (hooks) {
  setupApplicationTest(hooks)
  setupMirage(hooks)

  /*
   * Validates after all promises finish.
   * Checks title, description and clue of the challenge are translated.
   */

  function testCanVisit(challengeId) {
    test(`Challenge ${challengeId} is internationalized`, async function (assert) {
      // The visit helper has a known bug, so we need this try/catch
      // https://github.com/emberjs/ember-test-helpers/issues/332 (still open)


      try {
        simulateRouterHooks(this.owner.lookup('service:store'))
        await visit(`/desafio/${challengeId}`)
      }
      catch (e) {
        if (e.message !== 'TransitionAborted') {
          throw e
        }
      }

      var intl = this.owner.lookup('service:intl')

      var expectedTitle = intl.t("model.challenges." + challengeId + ".title").string.trim()
      const challengeTitle = $(".challenge-title").text().trim()
      assert.equal(challengeTitle, expectedTitle)

      await awaitChallengeLoading()

      var expectedescription = intl.t("model.challenges." + challengeId + ".description").string.trim().replace(/\s+/g, " ")
      assert.dom("[data-test-challenge-description]").containsText(expectedescription)

      var expectedClue = intl.t("model.challenges." + challengeId + ".clue").string.trim()
      assert.dom("[data-test-challenge-clue]").containsText(expectedClue)
    })
  }

// Some second book's challenges:
  testCanVisit(1)
  testCanVisit(2)
  testCanVisit(3)

// Conditional Alternative:
  testCanVisit(13)
  testCanVisit(14)

// Challenge with no clues:
  testCanVisit(15)

// Some first book's challenges:
  testCanVisit(230)
  testCanVisit(201)

})
