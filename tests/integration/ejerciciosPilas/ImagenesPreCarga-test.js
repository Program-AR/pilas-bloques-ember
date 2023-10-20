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
      "fondo.duba.png",
      "actor.duba.png", "actor.churrasco.png",
      "marcador-duba.png",
      "obstaculo.duba1.png", "obstaculo.duba2.png", "obstaculo.duba3.png", "obstaculo.duba4.png",
      "casillas.duba.png"
    ]
  )

  testDePrecarga('EscenaLita', `new EscenaLita("[O,-,A,T,L,E]")`,
    [
      "fondo.lita.png",
      "actor.lita.png", "actor.ensaladera.png", "actor.tomate.png", "actor.lechuga.png",
      "marcador-lita.png",
      "obstaculo.lita1.png", "obstaculo.lita2.png", "obstaculo.lita3.png", "obstaculo.lita4.png",
      "casillas.lita.png"
    ]
  )

  testDePrecarga('EscenaChuy', `new EscenaChuy("[O,-,A,T,E,U,P,G]")`,
    [
      "fondo.chuy.png",
      "actor.chuy.png", "actor.trofeo.png", "actor.paleta.png", 'pelotaAnimada.png', "actor.pelota.png", 'actor.pelotita.png',
      "marcador-chuy.png",
      "obstaculo.chuy1.png", "obstaculo.chuy2.png", "obstaculo.chuy3.png", "obstaculo.chuy4.png",
      "casillas.chuy.png"
    ]
  )

  testDePrecarga('EscenaCapy', `new EscenaCapy("[O,-,A,T,Y,L,P]")`,
    [
      "fondo.capy.png",
      "actor.capy.png", "actor.tacho.png", "actor.lata.png", "actor.papel.png",
      "marcador-capy.png",
      "obstaculo.capy1.png", "obstaculo.capy2.png", "obstaculo.capy3.png", "obstaculo.capy4.png",
      "casillas.capy.png"
    ]
  )

  testDePrecarga('EscenaManic', `new EscenaManic("[O,-,A,T,R,E,P]")`,
    [
      "fondo.manic.png",
      "actor.manic.png", "actor.telescopio.png", "actor.estrella.png", "actor.planeta.png",
      "marcador-manic.png",
      "obstaculo.manic1.png", "obstaculo.manic2.png", "obstaculo.manic3.png", "obstaculo.manic4.png",
      "casillas.manic.png"
    ]
  )

  testDePrecarga('EscenaYvoty', `new EscenaYvoty("[O,-,A,C,P,K,L,M,T]")`,
    [
      "fondo.yvoty.png",
      "actor.yvoty.png", "actor.celular.png", "actor.luciernaga.png", "actor.cargador.png", "actor.mariposa.png", "compu_animada.png",
      "marcador-yvoty.png",
      "obstaculo.yvoty1.png", "obstaculo.yvoty2.png", "obstaculo.yvoty3.png", "obstaculo.yvoty4.png",
      "casillas.yvoty.png"
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