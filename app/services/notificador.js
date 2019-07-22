import Service, { inject as service } from '@ember/service';
import environment from '../config/environment';

export default Service.extend({
  ajax: service(),
  hayActualizacion: false,
  versionActual: null,

  esVersionAnterior(stringV1, stringV2) {

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

    var v1 = parseVersionString(stringV1);
    var v2 = parseVersionString(stringV2);

    return v1.major < v2.major ||
        (v1.major === v2.major && v1.minor < v2.minor) ||
        (v1.major === v2.major && v1.minor === v2.minor && v1.patch < v2.patch);
  },

  /**
   * Consulta contra la API de github si existe una versión nueva de la
   * aplicación para actualizar.
   */
  consultar() {
    let versionActual = environment.APP.version;
    let url = environment['versionURL'];

    return this.ajax.request(url).then((data) => {
      let versionDesdeElServidor = data.tag_name;


      if (this.esVersionAnterior(versionActual, versionDesdeElServidor)) {
        this.set('hayActualizacion', true);
        this.set('versionActual', data.tag_name);
        return {hayActualizacion: true, version: data.tag_name};
      } else {
        return {hayActualizacion: false, version: data.tag_name};
      }

    });
  }
});
