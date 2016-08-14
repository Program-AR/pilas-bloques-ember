import Ember from 'ember';
import config from "../config/environment";

export default Ember.Service.extend({
  guardar(parametros) {

    return new Ember.RSVP.Promise((success, reject) => {

      let data = {
        hash: parametros.hash,
        desafio: parametros.actividad,
        usuario: parametros.idAlumno,
        xml: parametros.codigo_xml,
      };

      $.ajax({
        url: `${config.cursoBackendURL}/soluciones/`,
        contentType: 'application/json',
        type: "post",
        data: JSON.stringify(data)
      }).
      done(success).
      fail(reject);
    });

  },

  obtener_solucion_xml_desde_hash(hash) {

    return new Ember.RSVP.Promise((success, reject) => {
      $.ajax({
        url: `${config.cursoBackendURL}/soluciones/${hash}`,
        contentType: 'application/json',
        type: "get",
      }).
      done((result) => {
        success(result.data[0].xml);
      }).
      fail(reject);
    });
  }
});
