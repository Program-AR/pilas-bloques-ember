import Ember from 'ember';
import ENV from "pilas-engine-bloques/config/environment";

export default Ember.Service.extend({

    getVersion() {
        return "0.11.1";
    },

    obtener_version_del_servidor() {
      return new Ember.RSVP.Promise((resolve, reject) => {

        function on_success(response) {
          resolve(response.currentVersion);
        }

        function on_error(error) {
          let url = ENV.versionURL;
          let msg = `imposible la última versión desde: ${url}`;

          console.error(msg, error);
          reject(msg);
        }

        $.getJSON(ENV.versionURL, on_success).fail(on_error);

      });
    },

    obtener_estado_de_version() {

      return new Ember.RSVP.Promise((resolve, reject) => {

        if (window.requireNode === undefined) {
          //console.log("Evitando consultar el número de versión porque no está en nwjs.");
          resolve({comparacion: 0, version_del_servidor: '0.0.0'});
          return;
        }

        this.obtener_version_del_servidor().
          then((version_del_servidor) => {
            var compareVersion = window.requireNode('compare-version');
            var version_local = this.getVersion();
            var comparacion = compareVersion(version_del_servidor, version_local);

            resolve({comparacion: comparacion, version_del_servidor: version_del_servidor});
          }).
          catch((error) => {
            reject(error);
          });
      });
    },


    descargarActualizacion(version) {
      let url = ENV.downloadURL.replace(/VERSION/gi, version);
      var http = window.requireNode('http');

      function download(url) {
        return new Ember.RSVP.Promise((success, reject) => {

          var request = http.get(url, function(response) {
            response.setEncoding('utf-8');

            var len = parseInt(response.headers['content-length'], 10);
            var body = "";
            var cur = 0;
            var total = len / 1048576; //1048576 - bytes in  1Megabyte

            response.on("data", function(chunk) {
              body += chunk;
              cur += chunk.length;
              console.log("Descargando " + (100.0 * cur / len).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb (total size: " + total.toFixed(2) + " mb)");
            });

            response.on("end", function() {
              console.log("Descarga completa");
              success();
            });

            request.on("error", function(e){
              console.error("Error: " + e.message);
              reject(e.message);
            });

          });

        });
      }

      download(url).
        then(() => {
          alert("SUCCESS");
        }).
        catch((error) => {
          console.error(error);
        });
    }
});
