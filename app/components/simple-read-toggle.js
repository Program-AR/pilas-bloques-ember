import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({

    tagName: 'div',
    classNames: [],
    storage: service(),
    simpleRead: service(),

    shouldShowSimpleRead() {
        return this.simpleRead.shouldShowSimpleRead(this.bookSimpleReadMode())
    },

    bookSimpleReadMode() {
        return this.get('book.modoLecturaSimple')
    },

    actions: {
        toggleSimpleRead() {
            this.storage.toggleSimpleRead();
            window.location.reload()
        }
    }

});
