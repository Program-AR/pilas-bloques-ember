import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit'

module('Unit | Route | libros', function (hooks) {
  setupTest(hooks)

  test('books should be sorted', async function (assert) {
    const route = this.owner.lookup('route:libros.index');
    const books = await route.model()
    const bookIds = books.map(book => parseInt(book.get('id')))
    assert.deepEqual(bookIds, bookIds.sort())
  });
});
