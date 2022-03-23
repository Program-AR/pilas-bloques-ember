import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({

    storage: service(),

    shouldShowSimpleRead(defaultValue) {
        return defaultValue || this.storage.getUseSimpleRead()
    }
});
