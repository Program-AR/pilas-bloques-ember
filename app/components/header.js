import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNames: [],

  didRender() {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('theme', 'dark');
    }
    else {
      document.documentElement.setAttribute('theme', 'light');
    }
  },

  actions: {

    // The reason for using this action is this currently open bug: https://github.com/miguelcobain/ember-paper/issues/1151.
    requestMenuFocus(id) {
      document.getElementById(id).focus();
    }

  }

});
