import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('acercade');
  this.route('desafios');
  this.route('desafio', {path: '/desafio/:desafio_id'});
});

export default Router;
