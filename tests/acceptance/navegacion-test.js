import Ember from 'ember';
import {
  module,
  test
} from 'qunit';

import startApp from 'pilas-engine-bloques/tests/helpers/start-app';

var application;

module('Acceptance: Navegacion', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
    click('a:contains("Galería")');
  });

  andThen(() => {
    assert.equal(currentURL(), '/galeria');
    click('a:contains("Desafios")');
  });

  andThen(() => {
    assert.equal(currentURL(), '/desafios');
    return pauseTest()
  });


});
