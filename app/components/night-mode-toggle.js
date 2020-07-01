import Component from '@ember/component';

export default Component.extend({
    tagName: 'div',
    classNames: [],
    isNightTheme: false,

    didRender() {
        this.set('isNightTheme', localStorage.getItem('theme') === 'dark');
    },

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
