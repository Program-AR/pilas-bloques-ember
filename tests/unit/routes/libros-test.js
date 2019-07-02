import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module('Unit | Route | libros', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:libros');
    assert.ok(route);
  });
});
