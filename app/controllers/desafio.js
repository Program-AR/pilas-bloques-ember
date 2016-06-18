import Ember from 'ember';

export default Ember.Controller.extend({
  pilas: Ember.inject.service(),

  actions: {
    cuandoCargaPilas(/*pilas*/) {
      //console.log("SE CARGO PILAS !!!");
    }
  }
});
