import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({

    tagName: 'div',
    classNames: [],
    storage: service(),
    simpleRead: service(),

    shouldShowSimpleRead() {
        return this.simpleRead.shouldShowSimpleRead()
    },

    actions: {
        toggleSimpleRead() {
            this.storage.toggleSimpleRead();
        }
    }

});
