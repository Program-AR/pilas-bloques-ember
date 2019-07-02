import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

import { create, visitable, count } from 'ember-cli-page-object';

const page = create({
  visit: visitable('/libros/1'),
  cantidadDeDesafiosDisponibles: count('.desafio a')
});

module('Acceptance | desafios', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('La cantidad de desafíos que se muestra es correcta', async function (assert) {
    let cantidadDesafiosEsperada = 75;
    await page.visit();
    assert.equal(page.cantidadDeDesafiosDisponibles, cantidadDesafiosEsperada, `Hay exactamente ${cantidadDesafiosEsperada} desafios habilitados para utilizar.`);
  });

});