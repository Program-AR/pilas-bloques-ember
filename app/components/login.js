import Component from '@ember/component'

export default Component.extend({
  credentials: {},

  actions: {
    doLogin() {
      console.log(this.credentials)
    }
  }
});
