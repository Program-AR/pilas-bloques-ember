import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({

    tagName: 'div',
    classNames: [],
    storage: service(),
    shouldShowSimpleRead: false,

    didRender() {
        this.set('shouldShowSimpleRead', this.storage.getUseSimpleRead());
    },

    actions: {
        toggleSimpleRead() {
            this.storage.toggleSimpleRead();
        }
    }

});
