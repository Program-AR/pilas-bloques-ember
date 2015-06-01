import Ember from 'ember';

export default Ember.Service.extend({
  env: null,
  showLayout: null,

  loadProperties: function() {
    this.set('env', this.container.lookupFactory('config:environment'));
    this.set('showLayout', this.get('env').showLayout);
  }.on('init'),

  getENV: function() {
    return this.get('env');
  }
});
