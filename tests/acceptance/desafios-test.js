import { module, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import desafios from '../pages/desafios';

module('Acceptance | desafios', function(hooks) {
  setupApplicationTest(hooks);

  skip('visiting /desafios', function(assert) {
    let cantidadDesafiosEsperada = 50;

    desafios.
      visit();

    andThen(function() {
      assert.equal(desafios.cantidadDeDesafiosDisponibles(), cantidadDesafiosEsperada, `Hay exactamente ${cantidadDesafiosEsperada} desafios habilitados para utilizar.`);
    });


  });
});
