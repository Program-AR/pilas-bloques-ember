import { test } from 'qunit';
import moduleForAcceptance from 'pilasbloques/tests/helpers/module-for-acceptance';
import principal from '../pages/principal';

moduleForAcceptance('Acceptance | principal');

test('visiting /', function(assert) {
  principal.
    visit();

  andThen(() => {
    assert.equal(principal.cantidadDeLinks(), 3, "Hay tres links en pantalla.");
  });

  principal.abrirAyuda();

  andThen(() => {
    assert.equal(principal.tituloModal(), "Ayuda", "El modal de ayuda está visible.");
  });

  principal.
    cerrarDialogo();

});
