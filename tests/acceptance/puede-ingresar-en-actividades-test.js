import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module('Acceptance | puede ingresar en actividades', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  /*
   * Realiza una validación luego de que se detengan todas las promesas pendientes.
   *
   * La validación consiste en asegurarse de que el título que se muestra en el
   * panel de consigna sea exacamente el título el esperado.
   */

  function testSePuedeVisitar(nombreDesafio, tituloEsperado) {
    test(`Se puede visitar ${nombreDesafio}`, async function (assert) {
      // La razón por la que levantamos este try catch es porque el helper visit tiene un bug
      // descrito acá: https://github.com/emberjs/ember-test-helpers/issues/332 (todavía abierto)        
      try {
        await visit(`/desafios/${nombreDesafio}`);
      } catch (e) {
        if (e.message !== 'TransitionAborted') {
          throw e;
        }
      }
      let tituloVisibleEnPantalla = $(".header-title").text();
      assert.equal(tituloVisibleEnPantalla, tituloEsperado, "La actividad se llama efectivamente " + tituloEsperado);
    })
  }

  testSePuedeVisitar("DibujandoAlCuadrado", "Dibujando: Al cuadrado");

  testSePuedeVisitar("DibujandoRayuelaRobotica", "Dibujando: Rayuela robótica");

  testSePuedeVisitar("DibujandoCortoPorLaDiagonal", "Dibujando: Corto por la diagonal");

  testSePuedeVisitar("DibujandoMamushkaCuadrada", "Dibujando: Mamushka cuadrada");

  testSePuedeVisitar("DibujandoEscaleraCuadrada", "Dibujando: Escalera cuadrada");

  testSePuedeVisitar("DibujandoHexagono", "Dibujando: Hexágono");

  testSePuedeVisitar("DibujandoPiramideInvertida", "Dibujando: Pirámide invertida");

  testSePuedeVisitar("DibujandoFigurasDentroDeFiguras", "Dibujando: Figuras dentro de figuras");

  testSePuedeVisitar("DibujandoLaCuevaDeEstalagtitas", "Dibujando: La cueva de estalagtitas");

});
