import { test } from 'qunit';
import { moduloEjerciciosPilas } from '../../helpers/ejerciciosPilasTest';
import createPilasTest from '../../helpers/createPilasTest';

const nombre = 'Casilla';

moduloEjerciciosPilas(nombre, () => {

  test('propiedades', function (assert) {

    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {

      let Cuadricula = pilasService.evaluar("Cuadricula");
      let cuadricula = new Cuadricula(0, 0, 3, 5,
        { alto: 300, ancho: 200 },
        { grilla: 'invisible.png', cantColumnas: 1 }
      );

      let casilla = cuadricula.casilla(1, 2);
      let casilla2 = cuadricula.casilla(0, 0);
      cuadricula.setAlto(150);
      cuadricula.setAncho(100);

      assert.equal(casilla.alto, 50, 'resizea alto bien');
      assert.equal(casilla.ancho, 20, 'resizea ancho bien');
      assert.equal(casilla.x, 0, 'reposiciona x bien cuando es 0');
      assert.equal(casilla.y, 0, 'reposiciona y bien cuando es 0');
      assert.equal(casilla2.x, -40, 'reposiciona x bien');
      assert.equal(casilla2.y, 50, 'reposiciona y bien');
      resolve();

    });

  });

});