import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | notificador', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:notificador');

    assert.ok(service);

    assert.ok(service.esVersionAnterior("1.0.0", "1.1.1"), "La versión 1.1.1 es superior a la 1.0.0.");
    assert.ok(service.esVersionAnterior("1.0.0", "2.0.0"), "La versión 2.0.0 es superior a la 1.0.0.");
    assert.ok(service.esVersionAnterior("1.0.0", "2"), "La versión 2 es superior a la 1.0.0.");

    assert.notOk(service.esVersionAnterior("1.0.0", "1"), "Es la misma versión, no hay que actualizar.");
    assert.notOk(service.esVersionAnterior("1.2.0", "1.0.0"), "Hay una versión más nueva en ejecución, no hay que actualizar.");

    assert.notOk(service.esVersionAnterior("1.0.1", "1.0.1+c6e44"), "Asume que son la misma versión, porque es una versión  en desarrollo.");
    assert.notOk(service.esVersionAnterior("1.0.1+a33ce", "1.0.1+c6e44"), "Asume que son la misma versión, porque es una versión  en desarrollo.");
    assert.notOk(service.esVersionAnterior("1.1.0+b398e2bc", "1.0.8"), "Mismo major, minor mayor, patch menor debe dar false");
  });
});
