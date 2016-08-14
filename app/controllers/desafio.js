import Ember from 'ember';

export default Ember.Controller.extend({
  pilas: Ember.inject.service(),
  queryParams: ['codigo', 'debug', 'panelCanvasVisible', 'panelBlocklyVisible', 'panelCodigoVisible'],
  codigo: null,
  debug: false,
  panelCanvasVisible: true,
  panelBlocklyVisible: true,
  panelCodigoVisible: false,
  codigoJavascript: '',

  actions: {
    cuandoCargaPilas(/*pilas*/) {
    }
  }
});
