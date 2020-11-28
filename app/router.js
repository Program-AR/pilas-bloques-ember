import { on } from '@ember/object/evented';
import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType
});

Router.map(function () {
  this.route('acercade');
  this.route('creator-de-desafios');
  this.route('desafio', { path: '/desafio/:desafio_id' });

  /* Rutas para el curso online 2016 (moodle) */
  this.route('desafios', function () {
    this.route('cursoAlumno', { path: "/cursoAlumno/:hash" });
    this.route('cursoDocente', { path: "/cursoDocente/:hash" });
    this.route('desafioPorNombre', { path: '/:nombreDelDesafio' });
  });

  this.route('libros', function () {
    this.route('verLibro', { path: ":libro_id" });
  });
  this.route('galeria');
  this.route('register');
});

Router.reopen({
  notifyGoogleAnalytics: on("didTransition", function () {
    if (ga && config.googleAnalyticsEnabled) {
      let url = this.url;
      ga('send', 'pageview', { page: url, title: url });
    }
  })
});

export default Router;
