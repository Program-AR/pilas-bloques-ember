import { test } from 'qunit';
import moduleForAcceptance from 'pilas-engine-bloques/tests/helpers/module-for-acceptance';
import acercaDe from '../pages/acerca-de';

moduleForAcceptance('Acceptance | acercade');

test('visiting /acercade', function(assert) {

  acercaDe.
    visit();

  andThen(function() {
    assert.ok(acercaDe.titulo(), "Tiene título");
    assert.equal(acercaDe.titulo(), "Acerca de Pilas Bloques", "Aparece el título de la aplicación.");
    assert.equal(acercaDe.cantidadDeBotones(), 1, "Existe un solo botón");
  });

});
