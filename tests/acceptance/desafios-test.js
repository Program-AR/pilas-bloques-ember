import { module, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { create, visitable, count } from 'ember-cli-page-object';

const page = create({
  visit: visitable('/desafios'),
  cantidadDeDesafiosDisponibles: count('.desafio a')
});

module('Acceptance | desafios', function (hooks) {
  setupApplicationTest(hooks);

  skip('visiting /acercade', async function (assert) {
    let cantidadDesafiosEsperada = 50;
    await page.visit();
    andThen(function () {
      assert.equal(page.cantidadDeDesafiosDisponibles, cantidadDesafiosEsperada, `Hay exactamente ${cantidadDesafiosEsperada} desafios habilitados para utilizar.`);
    });
  });

});