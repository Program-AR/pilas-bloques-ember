import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import { create, visitable, text, collection, attribute } from 'ember-cli-page-object'
import { simpleReadMock } from '../helpers/mocks'
import { testSimpleReadModeDisabled, testSimpleReadModeEnabled } from '../helpers/utils'

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
})

/*
 * Tests that in the book list page the book descriptions are internationalized.
 */
module('Acceptance | book list test', function (hooks) {
  setupApplicationTest(hooks)

  hooks.beforeEach(function() {
    this.owner.register('service:simpleRead', simpleReadMock);
  });

  test('Books titles and descriptions are internationalized', async function (assert) {
    await page.visit()

    var intl = this.owner.lookup('service:intl')

    page.books.forEach( book => {
      assert.equal(book.title, intl.t(`model.books.${book.id}.title`).string)
      assert.equal(book.description, intl.t(`model.books.${book.id}.description`).string)
    })
  })

  testSimpleReadModeEnabled(() => page.visit())
  testSimpleReadModeDisabled(() => page.visit())
})
