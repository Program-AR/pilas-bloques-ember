import {test} from 'ember-qunit';
import {moduloEjerciciosPilas} from '../../helpers/ejerciciosPilasTest';
import createPilasTest from '../../helpers/createPilasTest';

moduloEjerciciosPilas('Imagenes Pre-carga');

let escena = `new EscenaDuba("[O]")`;

test('EscenaDuba', function(assert) {
  return createPilasTest(this, escena, (pilas, resolve, pilasService) => {
    let imagenes = pilasService.imagenesParaPrecargar(escena);
    let imagenesEsperadas = ["flechaEscenarioAleatorio.png", "actor.duba.png", "fondo.duba.png", "actor.churrasco.png", 'casillas.duba.png', "obstaculo.duba1.png", "obstaculo.duba2.png", "obstaculo.duba3.png", "obstaculo.duba4.png"];
    assert.deepEqual(imagenes, imagenesEsperadas);
    resolve();
  });
});

