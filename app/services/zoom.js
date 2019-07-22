import Service from '@ember/service';

export default Service.extend({
  zoom: 100,

  getValue() {
    return this.zoom;
  },

  setValue(zoomValue) {
    this.set('zoom', zoomValue);
  }
});
