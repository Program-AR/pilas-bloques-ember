import Ember from 'ember';
import config from "../config/environment";
import OAuth from 'npm:oauth-1.0a';
import crypto from 'npm:crypto';

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
  },

  calificar(nota) {

    new Ember.RSVP.Promise((success, reject) => {

      Ember.$.ajaxSetup({ // Sin esto no se envían las cookies al server. Me falta saber un lugar mejor para ponerlo.
        xhrFields: {
          withCredentials: true,
        },
      });

      // Esto seguramente deba ir en otro lado...
      var oauth = OAuth({
          consumer: {
              key: 'otrakey',
              secret: 'estesecret'
          },
          signature_method: 'HMAC-SHA1',
          hash_function: function(base_string, key) {
              return crypto.createHmac('sha1', key).update(base_string).digest('base64');
          }
      });

      let dataCalificacion = { //TODO: Gise, esto decidilo vos.
        nota: nota,
        desafio: '',
        usuario: '',
        xml: '',
      };

      var request_data = {
          url: `${config.ltiBackendURL}/grade/`,
          method: 'POST',
          data: dataCalificacion
      };

      $.ajax({
        url: request_data.url,
        contentType: 'application/json',
        type: request_data.method,
        data: oauth.authorize(request_data)
      }).done(success).fail(reject);
    }).catch((reason) => {
          console.error(reason);
          alert("Se ha producido un error al enviar la calificación, por favor volvé a intentar.");
    });

  }
});
