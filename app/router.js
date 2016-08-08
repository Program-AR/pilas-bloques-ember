import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('acercade');
  this.route('desafio', {path: '/desafio/:desafio_id'});

  /* Rutas para el curso online 2016 (moodle) */
  this.route('desafios', function() {
    this.route('cursoAlumno',  {path: "/cursoAlumno/:hash"});
    this.route('cursoDocente', {path: "/cursoDocente/:hash"});
    this.route('mensajeGuardado');
  });

});

export default Router;
