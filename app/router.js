import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('about');
  this.route('version');
  this.route('preferencias');
  this.route('editor');
});

export default Router;
