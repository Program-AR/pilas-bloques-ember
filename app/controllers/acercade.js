import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    visitarWeb() {
      var url = "http://bloques.pilas-engine.com.ar";
      window.open(url);
    },
  }
});
