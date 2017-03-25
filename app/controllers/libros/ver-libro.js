import Ember from 'ember';
import ENV from 'pilas-engine-bloques/config/environment';

export default Ember.Controller.extend({
  debeOcultarLibros: ENV.ocultar_seccion_libros
});
