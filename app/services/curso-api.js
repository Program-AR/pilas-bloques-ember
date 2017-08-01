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
  },

  calificar(nota) {

    new Ember.RSVP.Promise((success, reject) => {
      var a = document.cookie;
      console.log(a);
      let dataCalificacion = { //TODO: Gise, esto decidilo vos.
        nota: nota,
        desafio: '',
        usuario: '',
        xml: '',
      };

      $.ajax({
        url: `${config.ltiBackendURL}/grade/`,
        contentType: 'application/json',
        type: "post",
        data: JSON.stringify(dataCalificacion),
        // xhrFields: {
        //   withCredentials = true
        // },
        beforeSend: function(xhr){
           xhr.withCredentials = true;
        },
        crossDomain: true
      }).done(success).fail(reject);
    }).catch((reason) => {
          console.error(reason);
          alert("Se ha producido un error al enviar la calificación, por favor volvé a intentar.");
    });

  }
});
