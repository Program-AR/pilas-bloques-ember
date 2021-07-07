import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";
import simulateRouterHooks from "../helpers/simulate-router.hooks";
import { awaitForElementToExist } from "../helpers/utils"

module('Acceptance | puede ingresar en actividades', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  /*
   * Realiza una validación luego de que se detengan todas las promesas pendientes.
   *
   * Valida que el titulo, descripción y pista de los desafíos se haya traducido correctamente.
   */

  function testSePuedeVisitar(challengeId) {
    test(`Se puede visitar ${challengeId}`, async function (assert) {
      // La razón por la que levantamos este try catch es porque el helper visit tiene un bug
      // descrito acá: https://github.com/emberjs/ember-test-helpers/issues/332 (todavía abierto)


      try {
        simulateRouterHooks(this.owner.lookup('service:store'));
        await visit(`/desafio/${challengeId}`);
      }
      catch (e) {
        if (e.message !== 'TransitionAborted') {
          throw e;
        }
      }

      var intl = this.owner.lookup('service:intl');
      
      var expectedTitle = intl.t("model.challenges." + challengeId + ".title").string.trim();
      const challengeTitle = $(".challenge-title").text().trim();
      assert.equal(challengeTitle, expectedTitle, "La actividad se llama '" + challengeTitle + "' y no '" + expectedTitle + "'");

      //await for challenge to render, 5 seconds max.
      await awaitForElementToExist("[data-test-challenge-description]", 5000);

      var expectedescription = intl.t("model.challenges." + challengeId + ".description").string.trim();
      assert.dom("[data-test-challenge-description]").containsText(expectedescription);

      var expectedClue = intl.t("model.challenges." + challengeId + ".clue").string.trim();
      assert.dom("[data-test-challenge-clue]").containsText(expectedClue);
    })
  }

  testSePuedeVisitar(29);
  testSePuedeVisitar(30);
  testSePuedeVisitar(31);
  testSePuedeVisitar(32);
  testSePuedeVisitar(33);
  testSePuedeVisitar(34);
  testSePuedeVisitar(35);
  testSePuedeVisitar(36);
  testSePuedeVisitar(37);

});
