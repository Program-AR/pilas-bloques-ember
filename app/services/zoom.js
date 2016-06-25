import Ember from 'ember';

export default Ember.Service.extend({
  zoom: 100,

  getValue() {
    return this.get('zoom');
  },

  setValue(zoomValue) {
    this.set('zoom', zoomValue);
  }
});
