import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',
  href: null,
  platform: service(),

  actions: {
    abrirDesdeElectron(url) {
      if (this.openOnNewTab) {
        open(url) //TODO: Abrir en navegador externo, actualmenente se abre otra ventana de electron. (Cuando funcione el require('electron'))
      }
      else {
        location.href = url
      }
    }
  }
});
