import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({

    tagName: 'div',
    classNames: [],
    storage: service(),
    isNightTheme: false,

    didRender() {
        this.set('isNightTheme', this.storage.getCurrentTheme() === 'dark');
    },

    setLightTheme() {
        this.storage.saveCurrentTheme('light');
    },

    setDarkTheme() {
        this.storage.saveCurrentTheme('dark');
    },

    actions: {
        toggleTheme() {
            if (this.isNightTheme) {
                this.setLightTheme();
            }
            else {
                this.setDarkTheme();
            }
        }
    }

});
