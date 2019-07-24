import { test } from 'qunit';
import { moduloEjerciciosPilas } from '../../helpers/ejerciciosPilasTest';
import createPilasTest from '../../helpers/createPilasTest';

const nombre = 'Cuadricula Esparsa';

moduloEjerciciosPilas(nombre, () => {

  test('Constructor', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let CuadriculaEsparsa = pilasService.evaluar("CuadriculaEsparsa");

      let matriz = [
        ['T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'F', 'F', 'F', 'F', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'F', 'F', 'F', 'F', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T']];

      let cuadricula = new CuadriculaEsparsa(0, 0, { alto: 100 },
        { grilla: 'invisible.png', cantColumnas: 1 },
        matriz);
      assert.ok(cuadricula.cantidadCasillas() === 22);
      resolve();
    });
  });

  test('Direcciones', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let CuadriculaEsparsa = pilasService.evaluar("CuadriculaEsparsa");

      let matriz = [
        ['T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'F', 'F', 'F', 'F', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'F', 'F', 'F', 'F', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T']];

      let cuadricula = new CuadriculaEsparsa(0, 0, { alto: 100 },
        { grilla: 'invisible.png', cantColumnas: 1 },
        matriz);

      /*Cuatro esquinas*/
      //izquierda arriba
      let casilla = cuadricula.casilla(0, 0);
      assert.ok(!cuadricula.hayArriba(casilla));
      assert.ok(cuadricula.hayAbajo(casilla));
      assert.ok(!cuadricula.hayIzquierda(casilla));
      assert.ok(cuadricula.hayDerecha(casilla));

      //izquierda abajo
      casilla = cuadricula.casilla(4, 0);
      assert.ok(cuadricula.hayArriba(casilla));
      assert.ok(!cuadricula.hayAbajo(casilla));
      assert.ok(!cuadricula.hayIzquierda(casilla));
      assert.ok(cuadricula.hayDerecha(casilla));

      //derecha arriba
      casilla = cuadricula.casilla(0, 5);
      assert.ok(!cuadricula.hayArriba(casilla));
      assert.ok(cuadricula.hayAbajo(casilla));
      assert.ok(cuadricula.hayIzquierda(casilla));
      assert.ok(!cuadricula.hayDerecha(casilla));

      //derecha abajo
      casilla = cuadricula.casilla(4, 5);
      assert.ok(cuadricula.hayArriba(casilla));
      assert.ok(!cuadricula.hayAbajo(casilla));
      assert.ok(cuadricula.hayIzquierda(casilla));
      assert.ok(!cuadricula.hayDerecha(casilla));


      casilla = cuadricula.casilla(1, 0);
      //assert.equal(cuadricula.hayIzquierda(casilla),false);
      assert.ok(cuadricula.hayArriba(casilla));
      assert.ok(cuadricula.hayAbajo(casilla));
      assert.ok(!cuadricula.hayIzquierda(casilla));
      assert.ok(!cuadricula.hayDerecha(casilla));

      casilla = cuadricula.casilla(2, 2);
      //assert.equal(cuadricula.hayIzquierda(casilla),false);
      assert.ok(!cuadricula.hayArriba(casilla));
      assert.ok(!cuadricula.hayAbajo(casilla));
      assert.ok(cuadricula.hayIzquierda(casilla));
      assert.ok(cuadricula.hayDerecha(casilla));

      resolve();
    });
  });

});
