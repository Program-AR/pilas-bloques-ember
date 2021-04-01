import Component from '@ember/component';

export default Component.extend({
  isExpanded: false,

  actions: {
    toggle: function() {
      this.set('isExpanded', !this.get('isExpanded'));
    }
  }
});
