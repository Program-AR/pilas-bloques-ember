import Ember from 'ember';

export default Ember.Route.extend({
  blockly: Ember.inject.service(),
  blocksGallery: Ember.inject.service(),

  activate() {
    this.get('blocksGallery').start();
  }

});
