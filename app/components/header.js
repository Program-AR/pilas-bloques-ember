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

});
