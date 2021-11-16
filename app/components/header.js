import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'div',
  classNames: [],
  storage: service(),


  didRender() {
    document.documentElement.setAttribute('theme', this.storage.getUseNightTheme() ? 'dark' : 'light');
  },

});
