import Ember from 'ember';

export default Ember.Controller.extend({
  version: Ember.inject.service(),

  currentVersion: Ember.computed('version', function() {
    return this.get('version').getVersion();
  }),

  actions: {
    visitWebsite() {
      var url = "http://bloques.pilas-engine.com.ar";

      if (window['requireNode'] === undefined) {
        window.open(url);
      } else {
        var gui = window.requireNode('nw.gui');
        gui.Shell.openExternal(url);
      }
    },
  }
});
