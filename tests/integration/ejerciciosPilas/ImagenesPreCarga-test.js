import {test} from 'ember-qunit';
import {moduloEjerciciosPilas} from '../../helpers/ejerciciosPilasTest';
import createPilasTest from '../../helpers/createPilasTest';

moduloEjerciciosPilas('Imagenes Pre-carga');


test('EscenaDuba', function(assert) {
  let escena = `new EscenaDuba("[O,-,A,P,*]")`;
  return createPilasTest(this, escena, (pilas, resolve, pilasService) => {
    let imagenes = pilasService.imagenesParaPrecargar(escena);
    let imagenesEsperadas = ["fondo.duba.png", "actor.duba.png", "actor.churrasco.png", "flechaEscenarioAleatorio.png", "casillas.duba.png", "obstaculo.duba1.png", "obstaculo.duba2.png", "obstaculo.duba3.png", "obstaculo.duba4.png"];
    assert.deepEqual(imagenes, imagenesEsperadas);
    resolve();
  });
});

test('EscenaLita', function(assert) {
  let escena = `new EscenaLita("[O,-,A,T,L,E]")`;
  return createPilasTest(this, escena, (pilas, resolve, pilasService) => {
    let imagenes = pilasService.imagenesParaPrecargar(escena);
    let imagenesEsperadas = ["fondo.lita.png", "actor.lita.png", "actor.ensaladera.png", "actor.tomate.png", "actor.lechuga.png", "flechaEscenarioAleatorio.png", "casillas.lita.png", "obstaculo.lita1.png", "obstaculo.lita2.png", "obstaculo.lita3.png", "obstaculo.lita4.png"];
    assert.deepEqual(imagenes, imagenesEsperadas);
    resolve();
  });
});

test('EscenaCoty', function(assert) {
  let escena = `new EscenaCoty(
    [],
    [{x:-120,y:50},{x:20,y:50}],
    {xCoty: -0, yCoty: 0, puedeHaberCharco: true}
  )`;
  return createPilasTest(this, escena, (pilas, resolve, pilasService) => {
    let imagenes = pilasService.imagenesParaPrecargar(escena);
    let imagenesEsperadas = ["fondo.coty.png", "actor.coty.png", "actor.charco.png", "flechaEscenarioAleatorio.png"];
    assert.deepEqual(imagenes, imagenesEsperadas);
    resolve();
  });
});

test('EscenaTotoEscritor', function(assert) {
  let escena = `new EscenaTotoEscritor(new ObjetivoCopiar())`;
  return createPilasTest(this, escena, (pilas, resolve, pilasService) => {
    let imagenes = pilasService.imagenesParaPrecargar(escena);
    let imagenesEsperadas = ["fondo.toto.png", "actor.toto.png", "actor.letra.tablero.png", "actor.letra.manuscrita.png", "casillas.toto.png", "manoToto.png", "libretaToto.png"];
    assert.deepEqual(imagenes, imagenesEsperadas);
    resolve();
  });
});


test('EscenaTotoLector', function(assert) {
  let escena = `new EscenaTotoLector([['A', 'r', 'e']], "")`;
  return createPilasTest(this, escena, (pilas, resolve, pilasService) => {
    let imagenes = pilasService.imagenesParaPrecargar(escena);
    let imagenesEsperadas = ["fondo.toto.png", "actor.toto.png", "actor.letra.tablero.png", "actor.letra.leida.png", "casillas.toto.png", "pensamientoToto.png"];
    assert.deepEqual(imagenes, imagenesEsperadas);
    resolve();
  });
});