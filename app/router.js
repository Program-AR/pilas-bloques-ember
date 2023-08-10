import EmberRouter from '@ember/routing/router';
import config from 'pilasbloques/config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('acercade');
  this.route('challengue-creator');
  this.route('desafio', { path: '/desafio/:desafio_id' });

  /* Estas rutas están en los primeros cuadernillos impresos, deben seguir existiendo. */
  this.route('desafios', function () {
    this.route('desafioPorNombre', { path: '/:nombreDelDesafio' });
  });

  this.route('libros', function () {
    this.route('verLibro', { path: ":libro_id" });
  });
  this.route('galeria');
  this.route('register');
  this.route('password-recovery');
  this.route('clear');
});

export default Router;
