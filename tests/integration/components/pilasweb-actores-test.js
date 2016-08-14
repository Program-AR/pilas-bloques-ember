import { moduleForComponent, test } from 'ember-qunit';
import createPilasTest from "../../helpers/createPilasTest";

moduleForComponent('pilas-canvas-actores', 'Integration | Component | pilasweb actores', {
  integration: true
});

test('Puede crear un actor y actualizar algunos atributos', function(assert) {

  return createPilasTest(this, 'AlienInicial', (pilas, resolve) => {
    /* CREACION DE ACTORES */
    let actor = new pilas.actores.Mono();

    assert.equal(actor.x, 0, "El actor está en la posición inicial X=0.");
    assert.equal(actor.y, 0, "El actor está en la posición inicial Y=0.");

    /* POSICIONES */
    actor.x = 100;
    assert.equal(actor.x, 100, "El actor puede cambiar de posición.");

    /* ESCALA */
    actor.escala_x = 2;
    actor.escala_y = 3;

    assert.equal(actor.escala_x, 2, "El actor puede cambiar de escala x.");
    assert.equal(actor.escala_y, 3, "El actor puede cambiar de escala y.");

    actor.escala = 1;

    assert.equal(actor.escala, 1, "La escala se guarda correctamente.");
    assert.equal(actor.escala_x, 1, "El atributo escala impacta en la escala_x.");
    assert.equal(actor.escala_y, 1, "El atributo escala impacta en la escala_y.");

    /* ROTACION */
    actor.rotacion = 180;
    assert.equal(actor.rotacion, 180, "El actor puede cambiar de posición.");

    actor.rotacion = 180 + 181; // 361 grados son equivalentes a 1 grado
    assert.equal(actor.rotacion, 1, "Los angulos se simplifican.");

    actor.decir("chau!");

    resolve();

  });

});
