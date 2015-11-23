import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'pilas-engine-bloques/tests/helpers/start-app';

module('Acceptance | acercade', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /acercade', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
  });
});
