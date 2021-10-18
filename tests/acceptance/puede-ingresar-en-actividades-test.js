import { module, test } from 'qunit'
import { setupPBAcceptanceTest, safeVisit } from '../helpers/utils'

module('Acceptance | puede ingresar en actividades', function (hooks) {
  setupPBAcceptanceTest(hooks)

  /*
   * Realiza una validación luego de que se detengan todas las promesas pendientes.
   *
   * La validación consiste en asegurarse de que el título que se muestra en el
   * panel de consigna sea exacamente el título el esperado.
   */

  function testSePuedeVisitar(nombreDesafio, tituloEsperado) {
    test(`Se puede visitar ${nombreDesafio}`, async function (assert) {
      await safeVisit(`/desafios/${nombreDesafio}`)
      const tituloVisibleEnPantalla = $(".challenge-title").text().trim();
      assert.equal(tituloVisibleEnPantalla, tituloEsperado, "La actividad se llama " + tituloVisibleEnPantalla + " y no " + tituloEsperado);
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

  testSePuedeVisitar("DibujandoLaCuevaDeEstalagtitas", "Dibujando: La cueva de estalactitas");

});
