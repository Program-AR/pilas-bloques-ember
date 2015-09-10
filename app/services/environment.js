import Ember from 'ember';

export default Ember.Service.extend({
  env: null,
  showLayout: null,
  debeMostrarBotonCodigoXML: false,

  loadProperties: Ember.on('init', function() {
    this.set('env', this.container.lookupFactory('config:environment'));
    this.set('showLayout', this.get('env').showLayout);
  }),

  getENV() {
    return this.get('env');
  }
});
