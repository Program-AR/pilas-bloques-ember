import Component from '@ember/component';

export default Component.extend({
    tagName: 'div',
    classNames: [],

    actions: {
        // The reason for using this action is this currently open bug: https://github.com/miguelcobain/ember-paper/issues/1151.
        requestFocus(id) {
            document.getElementById(id).focus();
        }

    }

});