import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { create, visitable, text } from 'ember-cli-page-object';

const page = create({
  visit: visitable('/acercade'),
  scope: '.contenido-principal',
  titulo: text("h1"),
});

module('Acceptance | acercade', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /acercade', async function (assert) {
    await page.visit();
    assert.ok(page.titulo, "Tiene título");
    assert.equal(page.titulo, "Acerca de Pilas Bloques", "Aparece el título de la aplicación.");
  });
});
