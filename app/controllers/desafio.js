import Ember from 'ember';

export default Ember.Controller.extend({
  pilas: Ember.inject.service(),
  queryParams: ['codigo', 'debug', 'panelCanvasVisible'],
  codigo: null,
  debug: false,
  panelCanvasVisible: true,
  panelBlocklyVisible: true,
  panelCodigoVisible: false,
  codigoJavascript: '',

  actions: {
    cuandoCargaPilas(/*pilas*/) {
      //this.set('codigo', 'demo');
      //console.log("SE CARGO PILAS !!!");
    }
  }
});
