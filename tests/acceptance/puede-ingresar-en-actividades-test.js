import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";
import simulateRouterHooks from "../helpers/simulate-router.hooks";
import Ember from 'ember';

module('Acceptance | puede ingresar en actividades', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  /*
   * Realiza una validación luego de que se detengan todas las promesas pendientes.
   *
   * La validación consiste en asegurarse de que el título que se muestra en el
   * panel de consigna sea exacamente el título el esperado.
   */

  function testSePuedeVisitar(nombreDesafio) {
    test(`Se puede visitar ${nombreDesafio}`, async function (assert) {
      // La razón por la que levantamos este try catch es porque el helper visit tiene un bug
      // descrito acá: https://github.com/emberjs/ember-test-helpers/issues/332 (todavía abierto)        
      try {
        simulateRouterHooks(this.owner.lookup('service:store'));
        await visit(`/desafios/${nombreDesafio}`);
      }
      catch (e) {
        if (e.message !== 'TransitionAborted') {
          throw e;
        }
      }

      //TODO: Make this work
      var intl = Ember.inject.service();

      var tituloEsperado = intl.t("model.challenges." + nombreDesafio + ".title");
      const challengeTitle = $(".challenge-title").text().trim();
      assert.equal(challengeTitle, tituloEsperado, "La actividad se llama '" + challengeTitle + "' y no '" + tituloEsperado + "'");

      var descripcionEsperada = intl.t("model.challenges." + nombreDesafio + ".title");
      const challengeDescription = $("#challenge-description").text().trim();
      assert.equal(challengeDescription, descripcionEsperada, "La descripción es '" + challengeDescription + "' y no '" + descripcionEsperada + "'");

      var pistaEsperada = intl.t("model.challenges." + nombreDesafio + ".title");
      const challengeClue = $("#challenge-clue").text().trim();
      assert.equal(challengeClue, pistaEsperada, "La pista es '" + challengeClue + "' y no '" + pistaEsperada + "'");
    })
  }

  testSePuedeVisitar("DibujandoAlCuadrado");

  testSePuedeVisitar("DibujandoRayuelaRobotica");

  testSePuedeVisitar("DibujandoCortoPorLaDiagonal");

  testSePuedeVisitar("DibujandoMamushkaCuadrada");

  testSePuedeVisitar("DibujandoEscaleraCuadrada");

  testSePuedeVisitar("DibujandoHexagono");

  testSePuedeVisitar("DibujandoPiramideInvertida");

  testSePuedeVisitar("DibujandoFigurasDentroDeFiguras");

  testSePuedeVisitar("DibujandoLaCuevaDeEstalagtitas");

});
