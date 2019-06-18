import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import principal from '../pages/principal';

module('Acceptance | principal', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', function(assert) {
    principal.
      visit();

    assert.equal(principal.cantidadDeLinks(), 3, "Hay tres links en pantalla.");

    principal.abrirAyuda();

    assert.equal(principal.tituloModal(), "Ayuda", "El modal de ayuda está visible.");

    principal.
      cerrarDialogo();

  });
});
