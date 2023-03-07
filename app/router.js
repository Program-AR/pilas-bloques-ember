import { on } from '@ember/object/evented';
import EmberRouter from '@ember/routing/router';
import config from 'pilasbloques/config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('acercade');
  this.route('challengue-creator');
  this.route('desafio', { path: `${config.rootURL}'desafio/:desafio_id` });

  /* Estas rutas están en los primeros cuadernillos impresos, deben seguir existiendo. */
  this.route('desafios', function () {
    this.route('desafioPorNombre', { path: `${config.rootURL}'/:nombreDelDesafio` });
  });

  this.route('libros', function () {
    this.route('verLibro', { path: ":libro_id" });
  });
  this.route('galeria');
  this.route('register');
  this.route('password-recovery');
  this.route('clear');
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
