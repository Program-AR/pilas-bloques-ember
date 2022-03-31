import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

    simpleRead: service(),

    shouldShowSimpleRead() {
        return this.get('simpleRead').shouldShowSimpleRead(this.get('model.modoLecturaSimple'))
    }
    
});
