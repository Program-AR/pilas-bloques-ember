import Ember from 'ember';
import ENV from "pilas-engine-bloques/config/environment";

export default Ember.Service.extend({
    getVersion() {
        return "0.7.0";
    },
    obtener_version_del_servidor() {
      return new Ember.RSVP.Promise((resolve, reject) => {

        function on_success(response) {
          resolve(response.currentVersion);
        }

        function on_error(error) {
          let url = ENV.versionURL;
          let msg = `imposible la última versión desde: ${url}`;

          console.error(msg);
          reject(msg);
        }

        $.getJSON(ENV.versionURL, on_success).fail(on_error);

      });
    }
});
