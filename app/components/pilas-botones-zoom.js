import { on } from '@ember/object/evented';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNames: ['nw-zoom'],
  zoomValue: 100,
  zoom: service(),

  canZoomIn: computed('zoomValue', function() {
    return this.zoomValue < 120;
  }),

  canZoomOut: computed('zoomValue', function() {
    return this.zoomValue > 80;
  }),

  cambiarZoom: observer('zoomValue', function() {
    this.zoom.setValue(this.zoomValue);

    this.aplicarZoom((this.zoomValue - 100) / 10);
  }),


  aplicarZoom(zoomLevel) {
    document.body.style.zoom = (100 + zoomLevel * 10) + "%";
  },

  onStart: on('init', function() {
    this.set('zoomValue', this.zoom.getValue());
    this.cambiarZoom();
  }),

  actions: {
    zoomIn() {
      this.set('zoomValue', this.zoomValue + 10);
    },
    zoomOut() {
      this.set('zoomValue', this.zoomValue - 10);
    },
    zoomRestore() {
      this.set('zoomValue', 100);
    }
  },

});
