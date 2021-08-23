import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import { create, visitable, text, collection, attribute } from 'ember-cli-page-object'
import setupMirage from "ember-cli-mirage/test-support/setup-mirage"

/*
 * Tests that book page shows internationalized chapters and titles.
 */
module('Acceptance | book view test', function (hooks) {
  setupApplicationTest(hooks)
  setupMirage(hooks)

  function testBookView(libroId) {
    test(`Internationalization of book ${libroId} page`, async function (assert) {
      const page = create({
        scope: '.contenido-principal',
        visit: visitable(`/libros/${libroId}`),
        chapters: collection('[data-test-book-view-chapter]',
          {
            id: attribute('data-test-book-view-chapter-id', '[data-test-book-view-chapter-id]'),
            title: text('[data-test-book-view-chapter-title]'),
            groups: collection('[data-test-book-view-group]',
              {
                id: attribute('data-test-book-view-group-id', '[data-test-book-view-group-id]'),
                title: text('[data-test-book-view-group-title]'),
              }
            )
          }
        )
      })

      await page.visit()

      var intl = this.owner.lookup('service:intl')

      page.chapters.forEach( chapter => {
        assert.equal(chapter.title, intl.t(`model.chapters.${chapter.id}.title`).string)

        chapter.groups.forEach( group => {
          assert.equal(group.title, intl.t(`model.groups.${group.id}.title`).string)
        })
      })

    })
  }

  testBookView(1)
  testBookView(2)
})
