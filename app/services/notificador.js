import Ember from 'ember';
import environment from '../config/environment';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  hayActualizacion: false,
  versionActual: null,

  /**
   * Compara dos versiones y retorna 1 si v2 es mas reciente que v1, en
   * cualquier otro caso va a retornar 0.
   */
  comparar(v1, v2) {

    function parseVersionString (str) {
      if (typeof(str) !== 'string') {
        return false;
      }

      var x = str.split('+')[0].split('.');
      // parse from string or default to 0 if can't parse
      var maj = parseInt(x[0]) || 0;
      var min = parseInt(x[1]) || 0;
      var pat = parseInt(x[2]) || 0;

      return {major: maj, minor: min, patch: pat};
    }

    var running_version = parseVersionString(v1);
    var latest_version = parseVersionString(v2);

    if (running_version.major < latest_version.major) {
      return 1;
    } else if (running_version.minor < latest_version.minor || running_version.patch < latest_version.patch) {
      return 1;
    } else {
      return 0;
    }

    return false;
  },

  /**
   * Consulta contra la API de github si existe una versión nueva de la
   * aplicación para actualizar.
   */
  consultar() {
    let versionActual = environment.APP.version;
    let url = environment['versionURL'];

    return this.get('ajax').request(url).then((data) => {
      let versionDesdeElServidor = data.tag_name;


      if (this.comparar(versionActual, versionDesdeElServidor) === 1) {
        this.set('hayActualizacion', true);
        this.set('versionActual', data.tag_name);
        return {hayActualizacion: true, version: data.tag_name};
      } else {
        return {hayActualizacion: false, version: data.tag_name};
      }

    });
  }
});
