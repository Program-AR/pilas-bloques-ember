import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['nw-zoom'],
  zoomValue: 100,
  zoom: Ember.inject.service(),

  canZoomIn: function() {
    return this.get('zoomValue') < 120;
  }.property('zoomValue'),

  canZoomOut: function() {
    return this.get('zoomValue') > 80;
  }.property('zoomValue'),

  cambiarZoom: function() {
    var gui = window.requireNode('nw.gui');
    var win = gui.Window.get();
    this.get('zoom').setValue(this.get('zoomValue'));

    win.zoomLevel = (this.get('zoomValue') - 100) / 10;
  }.observes('zoomValue'),

  onStart: function() {
    this.set('zoomValue', this.get('zoom').getValue());
    this.cambiarZoom();
  }.on('init'),

  actions: {
    zoomIn() {
      this.set('zoomValue', this.get('zoomValue') + 10);
    },
    zoomOut() {
      this.set('zoomValue', this.get('zoomValue') - 10);
    },
    zoomRestore() {
      this.set('zoomValue', 100);
    }
  },

});
