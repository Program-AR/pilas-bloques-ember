import { moduleFor, test } from 'ember-qunit';

moduleFor('service:notificador', 'Unit | Service | notificador', {
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();

  assert.ok(service);

  assert.equal(service.comparar("1.0.0", "1.1.1"), 1, "La versión 1.1.1 es superior a la 1.0.0.");
  assert.equal(service.comparar("1.0.0", "2.0.0"), 1, "La versión 2.0.0 es superior a la 1.0.0.");
  assert.equal(service.comparar("1.0.0", "2"), 1, "La versión 2 es superior a la 1.0.0.");

  assert.equal(service.comparar("1.0.0", "1"), 0, "Es la misma versión, no hay que actualizar.");
  assert.equal(service.comparar("1.2.0", "1.0.0"), 0, "Hay una versión más nueva en ejecución, no hay que actualizar.");

  assert.equal(service.comparar("1.0.1", "1.0.1+c6e44"), 0, "Asume que son la misma versión, porque es una versión  en desarrollo.");
  assert.equal(service.comparar("1.0.1+a33ce", "1.0.1+c6e44"), 0, "Asume que son la misma versión, porque es una versión  en desarrollo.");
});
