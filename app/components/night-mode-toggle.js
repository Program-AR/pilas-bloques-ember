import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({

    tagName: 'div',
    classNames: [],
    storage: service(),
    isNightTheme: false,

    didRender() {
        this.set('isNightTheme', this.storage.getUseNightTheme());
    },

    actions: {
        toggleTheme() {
            this.storage.toggleNightTheme();
        }
    }

});
