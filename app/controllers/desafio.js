import Ember from 'ember';

export default Ember.Controller.extend({
  pilas: Ember.inject.service(),
  queryParams: ['codigo'],
  codigo: '',

  actions: {
    cuandoCargaPilas(/*pilas*/) {
      this.set('codigo', 'demo');
      //console.log("SE CARGO PILAS !!!");
    }
  }
});
