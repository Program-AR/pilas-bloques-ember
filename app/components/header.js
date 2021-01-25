import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNames: [],

  didRender() {
    document.documentElement.setAttribute('theme', localStorage.getItem('theme') || 'light');
  },

});
