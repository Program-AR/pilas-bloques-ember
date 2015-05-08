import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('about');
  this.route('version');
  this.route('preferencia');
  this.resource('editor', {path: '/editor/:galeria_id'});
  this.route('galeria');
  this.route('iframe');
  this.route('test');
  this.resource('desafios', function() {
    this.route('nombre', {path: ':nombre'});
  });
});

export default Router;
