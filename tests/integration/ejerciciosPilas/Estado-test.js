import { test } from 'qunit';
import { moduloEjerciciosPilas } from '../../helpers/ejerciciosPilasTest';
import createPilasTest from '../../helpers/createPilasTest';

const nombre = 'Estado';

moduloEjerciciosPilas(nombre, () => {

  test('Agregar Transicion', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let Estado = pilasService.evaluar("Estado");
      let EstadoConTransicion = pilasService.evaluar("EstadoConTransicion");
      let e2 = new Estado('id2');
      let e = new EstadoConTransicion(pilas.escena_actual(), 'id');
      e.agregarTransicion(e2, 'transi');
      assert.equal(e.transiciones['transi']['estadoEntrada'], e2, "Por la etiqueta llego a destino");
      resolve();
    });
  });

  test('Constructor', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let EstadoConTransicion = pilasService.evaluar("EstadoConTransicion");
      let e = new EstadoConTransicion(pilas.escena_actual(), 'id');

      assert.equal(Object.keys(e.transiciones).length, 0);
      assert.equal(e.identifier, 'id');
      resolve();
    });
  });

});
