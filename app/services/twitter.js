import Ember from 'ember';

//const URL = "http://localhost:3000/sendMessage";
const URL = "http://104.131.245.133:9914/sendMessage";

export default Ember.Service.extend({
  compartir(mensaje, imagen) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      $.ajax({
        url: URL,
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify({
          message: mensaje,
          media: imagen
        }),
        success: function (res) {
          resolve(res);
        },
        error: function (xhr, status, errorThrown) {
          console.error(xhr.responseText);
          reject(xhr.responseText);
        }
      });

    });
  }
});
