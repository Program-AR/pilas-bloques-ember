import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { create, visitable, text, collection, attribute } from 'ember-cli-page-object';
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

const page = create({
  scope: '.contenido-principal',
  visit: visitable('/libros'),
  books: collection('[data-test-book]',
    {
      id: attribute('data-test-book-id', '[data-test-book-id]'),
      title: text('[data-test-book-title]'),
      description: text('[data-test-book-description]')
    }
  )
});

/*
 * Prueba que en la lista de libros se ven los títulos y descripciones internacionalizadas.
 */
module('Acceptance | lista de libros test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /libros', async function (assert) {
    await page.visit();

    var intl = this.owner.lookup('service:intl');

    for (var i = 0; i < page.books.length; i++) {
      var book = page.books[i];

      assert.equal(book.title, intl.t(`model.books.${book.id}.title`).string, `Se muestra la internacionalizacion del titulo del libro '${book.id}'`);
      assert.equal(book.description, intl.t(`model.books.${book.id}.description`).string, `Se muestra la internacionalizacion de la descripcion del libro '${book.id}'`);
    }
  });
});
