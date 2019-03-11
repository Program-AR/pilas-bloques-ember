import {test} from 'ember-qunit';
import {moduloEjerciciosPilas} from '../../helpers/ejerciciosPilasTest';
import createPilasTest from '../../helpers/createPilasTest';

moduloEjerciciosPilas('Imagenes Pre-carga');


test('EscenaDuba', function(assert) {
  let escena = `new EscenaDuba("[O]")`;
  return createPilasTest(this, escena, (pilas, resolve, pilasService) => {
    let imagenes = pilasService.imagenesParaPrecargar(escena);
    let imagenesEsperadas = ["fondo.duba.png", "actor.duba.png", "actor.churrasco.png", "flechaEscenarioAleatorio.png", "casillas.duba.png", "obstaculo.duba1.png", "obstaculo.duba2.png", "obstaculo.duba3.png", "obstaculo.duba4.png"];
    assert.deepEqual(imagenes, imagenesEsperadas);
    resolve();
  });
});

test('EscenaLita', function(assert) {
  let escena = `new EscenaLita("[O]")`;
  return createPilasTest(this, escena, (pilas, resolve, pilasService) => {
    let imagenes = pilasService.imagenesParaPrecargar(escena);
    let imagenesEsperadas = ["fondo.lita.png", "actor.lita.png", "actor.ensaladera.png", "actor.tomate.png", "actor.lechuga.png", "flechaEscenarioAleatorio.png", "casillas.lita.png", "obstaculo.lita1.png", "obstaculo.lita2.png", "obstaculo.lita3.png", "obstaculo.lita4.png"];
    assert.deepEqual(imagenes, imagenesEsperadas);
    resolve();
  });
});