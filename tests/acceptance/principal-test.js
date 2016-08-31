import { test } from 'qunit';
import moduleForAcceptance from 'pilas-engine-bloques/tests/helpers/module-for-acceptance';
import principal from '../pages/principal';

moduleForAcceptance('Acceptance | principal');

test('visiting /', function(assert) {
  principal.
    visit();

  andThen(() => {
    assert.equal(principal.cantidadDeImagenes(), 1, "Tiene solo una imagen, la del logotipo.");
    assert.equal(principal.cantidadDeLinks(), 2, "Hay dos links en pantalla.");
  });

  principal.abrirAyuda();

  andThen(() => {
    assert.equal(principal.tituloModal(), "Ayuda", "El modal de ayuda está visible.");
  });

  principal.
    cerrarDialogo().
    abrirOpciones();

  andThen(() => {
    assert.equal(principal.tituloModal(), "Opciones", "El modal de opciones está visible");
  });

});
