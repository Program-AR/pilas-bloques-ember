import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('about');
  this.route('preferencia');
  this.route('editor', {
    path: '/editor/:galeria_id',
    resetNamespace: true
  });
  this.route('galeria');
  this.route('iframe');
  this.route('test');
  this.route('desafios', {
    resetNamespace: true
  }, function() {
    this.route('nombre', {path: ':nombre'});
  });
  this.route('acercade');
});

export default Router;
