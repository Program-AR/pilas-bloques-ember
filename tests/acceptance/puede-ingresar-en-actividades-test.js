import { test } from 'qunit';
import moduleForAcceptance from 'pilas-engine-bloques/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | puede ingresar en actividades');

/*
 * Realiza una validación luego de que se detengan todas las promesas pendientes.
 *
 * La validación consiste en asegurarse de que el título que se muestra en el
 * panel de consigna sea exacamente el título el esperado.
 */
function validar_que_se_muestra_el_titulo(assert, tituloEsperado) {
  andThen(function() {
    let tituloVisibleEnPantalla = $(".contenedor-panel-ayuda h4").text();
    assert.equal(tituloVisibleEnPantalla, tituloEsperado, "La actividad se llama efectivamente " + tituloEsperado);
  });
}

test('Nombres de actividades en la URL', function(assert) {

  visit('/desafios/DibujandoAlCuadrado');
  validar_que_se_muestra_el_titulo(assert, "Dibujando: Al cuadrado");

  visit('/desafios/DibujandoRayuelaRobotica');
  validar_que_se_muestra_el_titulo(assert, "Dibujando: Rayuela robótica");

  visit('/desafios/DibujandoCortoPorLaDiagonal');
  validar_que_se_muestra_el_titulo(assert, "Dibujando: Corto por la diagonal");

  visit('/desafios/DibujandoMamushkaCuadrada');
  validar_que_se_muestra_el_titulo(assert, "Dibujando: Mamushka cuadrada");

  visit('/desafios/DibujandoEscaleraCuadrada');
  validar_que_se_muestra_el_titulo(assert, "Dibujando: Escalera cuadrada");

  visit('/desafios/DibujandoHexagono');
  validar_que_se_muestra_el_titulo(assert, "Dibujando: Hexágono");

  visit('/desafios/DibujandoPiramideInvertida');
  validar_que_se_muestra_el_titulo(assert, "Dibujando: Pirámide invertida");

  visit('/desafios/DibujandoFigurasDentroDeFiguras');
  validar_que_se_muestra_el_titulo(assert, "Dibujando: Figuras dentro de figuras");

  visit('/desafios/DibujandoLaCuevaDeEstalagtitas');
  validar_que_se_muestra_el_titulo(assert, "Dibujando: La cueva de estalagtitas");

});
