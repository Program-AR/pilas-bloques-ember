import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { create, visitable, text, count } from 'ember-cli-page-object';
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

const page = create({
  scope: '.contenido-principal',
  visit: visitable('/'),
  tituloModal: text('h4', { scope: '.ember-modal-dialog', resetScope: true }),
  cantidadDeImagenes: count('img'),
  cantidadDeLinks: count('a'),
});

module('Acceptance | principal', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /', async function (assert) {
    await page.visit();
    assert.equal(page.cantidadDeLinks, 3, "Hay tres links en pantalla.");
  });
});