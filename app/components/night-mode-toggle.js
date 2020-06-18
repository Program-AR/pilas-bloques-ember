import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
    tagName: 'div',
    classNames: [],

    // didRender() {
    //     if (this.isNightTheme) {
    //         document.documentElement.setAttribute('theme', 'dark');
    //     }
    //     else {
    //         document.documentElement.setAttribute('theme', 'light');
    //     }
    // },

    isNightTheme: computed('nightTheme', function () {
        return localStorage.getItem('theme') === 'dark';
    }),

    setLightTheme() {
        localStorage.setItem('theme', 'light');
    },

    setDarkTheme() {
        localStorage.setItem('theme', 'dark');
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
