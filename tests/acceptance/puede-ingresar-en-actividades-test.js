import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | puede ingresar en actividades', function(hooks) {
  setupApplicationTest(hooks);

  /*
   * Realiza una validación luego de que se detengan todas las promesas pendientes.
   *
   * La validación consiste en asegurarse de que el título que se muestra en el
   * panel de consigna sea exacamente el título el esperado.
   */
  async function validar_que_se_muestra_el_titulo(assert, tituloEsperado) {
    let tituloVisibleEnPantalla = $(".contenedor-panel-ayuda h4").text();
    assert.equal(tituloVisibleEnPantalla, tituloEsperado, "La actividad se llama efectivamente " + tituloEsperado);
    await visit('/');
  }

  test('Nombres de actividades en la URL', async function(assert) {

    await visit('/desafios/DibujandoAlCuadrado');
    validar_que_se_muestra_el_titulo(assert, "Dibujando: Al cuadrado");

    await visit('/desafios/DibujandoRayuelaRobotica');
    validar_que_se_muestra_el_titulo(assert, "Dibujando: Rayuela robótica");

    await visit('/desafios/DibujandoCortoPorLaDiagonal');
    validar_que_se_muestra_el_titulo(assert, "Dibujando: Corto por la diagonal");

    await visit('/desafios/DibujandoMamushkaCuadrada');
    validar_que_se_muestra_el_titulo(assert, "Dibujando: Mamushka cuadrada");

    await visit('/desafios/DibujandoEscaleraCuadrada');
    validar_que_se_muestra_el_titulo(assert, "Dibujando: Escalera cuadrada");

    await visit('/desafios/DibujandoHexagono');
    validar_que_se_muestra_el_titulo(assert, "Dibujando: Hexágono");

    await visit('/desafios/DibujandoPiramideInvertida');
    validar_que_se_muestra_el_titulo(assert, "Dibujando: Pirámide invertida");

    await visit('/desafios/DibujandoFigurasDentroDeFiguras');
    validar_que_se_muestra_el_titulo(assert, "Dibujando: Figuras dentro de figuras");

    await visit('/desafios/DibujandoLaCuevaDeEstalagtitas');
    validar_que_se_muestra_el_titulo(assert, "Dibujando: La cueva de estalagtitas");

  });
});
