import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  notificador: service(),
  hayActualizacion: alias('notificador.hayActualizacion'),
  versionMasReciente: alias('notificador.versionActual'),
});
