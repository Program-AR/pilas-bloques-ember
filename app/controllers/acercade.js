import Ember from 'ember';

export default Ember.Controller.extend({
  version: Ember.inject.service(),

  currentVersion: Ember.computed('version', function() {
    return this.get('version').getVersion();
  }),

  actions: {
    visitWebsite() {
      var gui = window.requireNode('nw.gui');
      gui.Shell.openExternal("http://bloques.pilas-engine.com.ar");
    },
  }
});
