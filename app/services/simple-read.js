import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({

    storage: service(),

    shouldShowSimpleRead() {
        return this.simpleReadMode() || this.storage.getUseSimpleRead()
    },

    simpleReadMode() {
        return this.get('model.grupo.capitulo.libro.modoLecturaSimple')
    }
});
