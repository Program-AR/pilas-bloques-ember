import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

import { create, visitable, count } from 'ember-cli-page-object';

const page = create({
  cantidadDeDesafiosDisponibles: count('.ember-view .desafio .desafio-img')
});

const page1 = create({
  visit: visitable('/libros/1')
});

const page2 = create({
  visit: visitable('/libros/2')
});

module('Acceptance | desafios', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('La cantidad de desafíos que se muestra en la pagina 1 es correcta', async function (assert) {
    let cantidadDesafiosEsperada = 55;
    await page1.visit();
    assert.equal(page.cantidadDeDesafiosDisponibles, cantidadDesafiosEsperada, `Hay exactamente ${cantidadDesafiosEsperada} desafios habilitados para utilizar.`);
  });

  test('La cantidad de desafíos que se muestra en la pagina 2 es correcta', async function (assert) {
    let cantidadDesafiosEsperada = 48;
    await page2.visit();
    assert.equal(page.cantidadDeDesafiosDisponibles, cantidadDesafiosEsperada, `Hay exactamente ${cantidadDesafiosEsperada} desafios habilitados para utilizar.`);
  });


});