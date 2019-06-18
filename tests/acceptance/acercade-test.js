import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import acercaDe from '../pages/acerca-de';

module('Acceptance | acercade', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /acercade', function(assert) {
    acercaDe.
      visit();

    assert.ok(acercaDe.titulo(), "Tiene título");
    assert.equal(acercaDe.titulo(), "Acerca de Pilas Bloques", "Aparece el título de la aplicación.");
    assert.equal(acercaDe.cantidadDeBotones(), 1, "Existe un solo botón");
  });
});
