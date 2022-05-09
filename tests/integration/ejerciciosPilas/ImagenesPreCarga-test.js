import { test } from 'qunit';
import { moduloEjerciciosPilas } from '../../helpers/ejerciciosPilasTest';
import createPilasTest from '../../helpers/createPilasTest';

moduloEjerciciosPilas('Imagenes Pre-carga', () => {

  function testDePrecarga(escena, sceneConstructor, imagenesEsperadas) {
    test(escena, function (assert) {
      return createPilasTest(this, sceneConstructor, (pilas, resolve, pilasService) => {
        let imagenes = pilasService.imagenesParaPrecargar({ escena: sceneConstructor });
        assert.deepEqual(imagenes, imagenesEsperadas);
        resolve();
      });
    });
  }

  testDePrecarga('EscenaDuba', `new EscenaDuba("[O,-,A,P,*]")`,
    [
      "fondo.duba.png", "actor.duba.png", "actor.churrasco.png",
      "casillas.duba.png", "obstaculo.duba1.png",
      "obstaculo.duba2.png", "obstaculo.duba3.png", "obstaculo.duba4.png"
    ]
  )

  testDePrecarga('EscenaLita', `new EscenaLita("[O,-,A,T,L,E]")`,
    [
      "fondo.lita.png", "actor.lita.png", "actor.ensaladera.png", "actor.tomate.png", "actor.lechuga.png",
      "casillas.lita.png", "obstaculo.lita1.png",
      "obstaculo.lita2.png", "obstaculo.lita3.png", "obstaculo.lita4.png"
    ]
  )

  testDePrecarga('EscenaCoty',
    `new EscenaCoty(
    [],
    [{x:-120,y:50},{x:20,y:50}],
    {xCoty: -0, yCoty: 0, puedeHaberCharco: true}
  )`,
    [
      "fondo.coty.png", "actor.coty.png", "actor.charco.png"
    ]
  )

  testDePrecarga('EscenaTotoEscritor', `new EscenaTotoEscritor(new ObjetivoCopiar())`,
    [
      "fondo.toto.png", "actor.toto.png", "actor.letra.tablero.png", "actor.letra.manuscrita.png",
      "casillas.toto.png", "manoToto.png", "libretaToto.png"
    ]
  )

  testDePrecarga('EscenaTotoLector', `new EscenaTotoLector([['A', 'r', 'e']], "")`,
    [
      "fondo.toto.png", "actor.toto.png", "actor.letra.tablero.png", "actor.letra.leida.png",
      "casillas.toto.png", "pensamientoToto.png"
    ]
  )

});