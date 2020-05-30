import Component from '@ember/component';

export default Component.extend({
    tagName: 'div',
    classNames: [],
    darkTheme: false,

    didInsertElement() {
        this.set('darkTheme', false)
        document.documentElement.setAttribute('dark-theme', false);
    },

    actions: {
        toggleTheme() {
            document.documentElement.setAttribute('dark-theme', !this.get('darkTheme'));
        }
    }
});
