import { test } from 'qunit';
import {
  moduloEjerciciosPilas,
  hacerLuegoConCallback
} from '../../helpers/ejerciciosPilasTest';
import createPilasTest from '../../helpers/createPilasTest';

const nombre = 'Cuadricula';

moduloEjerciciosPilas(nombre, () => {

  /**
   * Preparar cuadricula y actores para los tests de este archivo
   *
   * @return diccionario con todos los elementos de la escena
   */
  function prepararEscena(pilas, pilasService) {
    let escena = {};
    let Cuadricula = pilasService.evaluar("Cuadricula");
    let AlienAnimado = pilasService.evaluar("AlienAnimado");
    escena.cuadricula = new Cuadricula(0, 0, 3, 5,
      { alto: 300, ancho: 200 },
      { grilla: 'invisible.png', cantColumnas: 1 }
    );

    escena.actor1 = new AlienAnimado(0, 0);
    escena.actor2 = new AlienAnimado(0, 0);
    escena.actor3 = new AlienAnimado(0, 0);

    return escena;
  }

  test('Set Ancho', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let escena = prepararEscena(pilas, pilasService);

      escena.cuadricula.setAncho(100);
      assert.equal(escena.cuadricula.ancho, 100);
      assert.equal(escena.cuadricula.casilla(0, 0).ancho, 20);
      assert.equal(escena.cuadricula.casilla(0, 0).alto, 100);
      resolve();
    });
  });

  test('Set Alto', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let escena = prepararEscena(pilas, pilasService);

      escena.cuadricula.setAlto(600);
      assert.equal(escena.cuadricula.alto, 600);
      assert.equal(escena.cuadricula.casilla(0, 0).ancho, 40);
      assert.equal(escena.cuadricula.casilla(0, 0).alto, 200);
      resolve();
    });
  });

  test('Colisionan', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let escena = prepararEscena(pilas, pilasService);

      escena.cuadricula.agregarActor(escena.actor1, 0, 0);
      escena.cuadricula.agregarActor(escena.actor2, 0, 0);
      escena.cuadricula.agregarActor(escena.actor3, 0, 1);

      assert.equal(escena.cuadricula.colisionan(escena.actor1, escena.actor2), true);
      assert.equal(escena.cuadricula.colisionan(escena.actor2, escena.actor1), true);
      assert.equal(escena.cuadricula.colisionan(escena.actor1, escena.actor3), false);
      assert.equal(escena.cuadricula.colisionan(escena.actor3, escena.actor1), false);
      assert.equal(escena.cuadricula.colisionan(escena.actor3, escena.actor2), false);
      assert.equal(escena.cuadricula.colisionan(escena.actor2, escena.actor3), false);
      resolve();
    });
  });

  test('Casilla', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let escena = prepararEscena(pilas, pilasService);

      assert.equal(escena.cuadricula.casilla(0, 0) !== escena.cuadricula.casilla(0, 1), true, 'son distintas');
      assert.equal(escena.cuadricula.casilla(0, 0).nroFila, 0);
      assert.equal(escena.cuadricula.casilla(0, 0).nroColumna, 0);
      assert.equal(escena.cuadricula.casilla(0, 1).nroFila, 0);
      assert.equal(escena.cuadricula.casilla(0, 1).nroColumna, 1);
      assert.equal(escena.cuadricula.casilla(1, 1).nroColumna, 1);
      assert.equal(escena.cuadricula.casilla(1, 1).nroFila, 1);
      resolve();
    });
  });

  // test('Constructor', function(assert) {
  //   return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
  //     let escena = prepararEscena(pilas, pilasService);

  //     assert.equal(escena.cuadricula.cantidadCasillas(),3*5,'tiene la cantidad de casillas que debe');

  //     function estaFueraRango(casillas,index,filas,cols){
  //       return casillas[index].nroFila<0 || casillas[index].nroFila>=filas || casillas[index].nroColumna<0 && casillas[index].nroColumna>=cols;
  //     }

  //     function sonLaMismaCasilla(casillas,i,j) {
  //       return casillas[i].nroFila===casillas[j].nroFila&&casillas[i].nroColumna===casillas[j].nroColumna;
  //     }

  //     function todasCoordenadasDistintasEInRange(casillas,cantFilas,cantColumnas) {
  //       for (var i = 0; i < casillas.size; i++) {

  //         if(estaFueraRango(casillas,i,cantFilas,cantColumnas)){
  //           return false;
  //         }

  //         for (var j = i; j < casillas.size; j++) {
  //           if(sonLaMismaCasilla(casillas,i,j)){
  //             return false;
  //           }
  //         }

  //       }

  //       return true;
  //     }

  //     assert.equal(todasCoordenadasDistintasEInRange(escena.cuadricula.casillas,3,5),true,'todas las casillas tienen coordenadas distintas e in_range');
  //     resolve();
  //   });
  // });

  test('Mover a la casilla derecha', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let escena = prepararEscena(pilas, pilasService);

      let MoverACasillaDerecha = pilasService.evaluar("MoverACasillaDerecha");

      escena.cuadricula.agregarActor(escena.actor1, 0, 0);
      var x = escena.actor1.x;
      var y = escena.actor1.y;

      hacerLuegoConCallback(escena.actor1, MoverACasillaDerecha, {}, function () {
        assert.equal(escena.actor1.x, x + escena.cuadricula.casilla(0, 0).ancho, 'Movi a la derecha bien');
        assert.equal(escena.actor1.y, y, 'Me mantuve en altura');
        assert.equal(escena.actor1.casillaActual(), escena.cuadricula.casilla(0, 1), 'Mi casillaActual es la correspondiente');
        resolve();
      });
    });
  });

  test('Mover a la casilla izquierda', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let escena = prepararEscena(pilas, pilasService);

      let MoverACasillaIzquierda = pilasService.evaluar("MoverACasillaIzquierda");

      escena.cuadricula.agregarActor(escena.actor1, 0, 1);
      var x = escena.actor1.x;
      var y = escena.actor1.y;

      hacerLuegoConCallback(escena.actor1, MoverACasillaIzquierda, {}, function () {
        assert.equal(escena.actor1.x, x - escena.cuadricula.casilla(0, 0).ancho, 'Movi a la izquierda bien');
        assert.equal(escena.actor1.y, y, 'Me mantuve en altura');
        assert.equal(escena.actor1.casillaActual(), escena.cuadricula.casilla(0, 0), 'Mi casillaActual es la correspondiente');
        resolve();
      });
    });
  });

  test('Mover a casilla abajo', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let escena = prepararEscena(pilas, pilasService);

      let MoverACasillaAbajo = pilasService.evaluar("MoverACasillaAbajo");

      escena.cuadricula.agregarActor(escena.actor1, 1, 0);
      var x = escena.actor1.x;
      var y = escena.actor1.y;

      hacerLuegoConCallback(escena.actor1, MoverACasillaAbajo, {}, function () {
        assert.equal(escena.actor1.y, y - escena.cuadricula.casilla(0, 0).alto, 'Movi abajo bien');
        assert.equal(escena.actor1.x, x, 'Me mantuve en eje x');
        assert.equal(escena.actor1.casillaActual(), escena.cuadricula.casilla(2, 0), 'Mi casillaActual es la correspondiente');
        resolve();
      });
    });
  });

  test('Mover a casilla arriba', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let escena = prepararEscena(pilas, pilasService);

      let MoverACasillaArriba = pilasService.evaluar("MoverACasillaArriba");

      escena.cuadricula.agregarActor(escena.actor1, 1, 0);
      var x = escena.actor1.x;
      var y = escena.actor1.y;

      hacerLuegoConCallback(escena.actor1, MoverACasillaArriba, {}, function () {
        assert.equal(escena.actor1.y, y + escena.cuadricula.casilla(0, 0).alto, 'Movi arriba bien');
        assert.equal(escena.actor1.x, x, 'Me mantuve en eje x');
        assert.equal(escena.actor1.casillaActual(), escena.cuadricula.casilla(0, 0), 'Mi casillaActual es la correspondiente');
        resolve();
      });
    });
  });

});