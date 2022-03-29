import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import { create, visitable, text, collection, attribute } from 'ember-cli-page-object'
import setupMirage from "ember-cli-mirage/test-support/setup-mirage"
import { simpleReadMock } from '../helpers/mocks'

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
  setupMirage(hooks)

  // jshint unused: false
  hooks.beforeEach(function(assert) {
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

  test('when simple read mode is enabled, simple read mode css class should be applied', async function (assert) {
    await page.visit()
    assert.dom('div.simple-read-mode').exists()
  })

  test('when simple read mode is disabled, simple read mode css class should not be applied', async function (assert) {
    this.simpleReadMock = this.owner.lookup('service:simpleRead');
    this.simpleReadMock.shouldShow = false
    await page.visit()
    assert.dom('div.simple-read-mode').doesNotExist()
  })
})
