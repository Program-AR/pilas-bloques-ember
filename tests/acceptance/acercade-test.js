import { test } from 'qunit';
import moduleForAcceptance from 'pilas-engine-bloques/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | acercade');

test('visiting /acercade', function(assert) {
  visit('/acercade');

  andThen(function() {
    assert.equal(currentURL(), '/acercade');
  });
});
