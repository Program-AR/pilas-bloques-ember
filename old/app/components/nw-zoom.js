import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['nw-zoom'],
  zoom: 100,

  canZoomIn: function() {
    return this.get('zoom') < 120;
  }.property('zoom'),

  canZoomOut: function() {
    return this.get('zoom') > 80;
  }.property('zoom'),

  actions: {
    zoomIn: function() {
      this.set('zoom', this.get('zoom') + 10);
    },
    zoomOut: function() {
      this.set('zoom', this.get('zoom') - 10);
    },
    zoomRestore: function() {
      this.set('zoom', 100);
    }
  },
  cambiarZoom: function() {
    var gui = require('nw.gui');
    var win = gui.Window.get();

    win.zoomLevel = (this.get('zoom') - 100) / 10;
  }.observes('zoom')
});
