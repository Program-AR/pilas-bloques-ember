import Component from '@ember/component';

export default Component.extend({
    tagName: 'div',
    classNames: [],

    didRender() {
        if (localStorage.getItem('theme') === 'dark') {
            this.set('nightTheme', true)
            document.documentElement.setAttribute('theme', 'dark');
        }
        else {
            this.set('nightTheme', false)
            document.documentElement.setAttribute('theme', 'light');
        }
    },

    setLightTheme() {
        localStorage.setItem('theme', 'light');
    },

    setDarkTheme() {
        localStorage.setItem('theme', 'dark');
    },

    actions: {
        toggleTheme() {
            if (localStorage.getItem('theme') === 'dark') {
                this.setLightTheme();
            }
            else {
                this.setDarkTheme();
            }
        }
    }

});
