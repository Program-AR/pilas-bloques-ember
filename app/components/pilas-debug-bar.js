import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'pilas-debug-bar',
  panelCanvasVisible: true,

  layout: Ember.computed('panelCanvasVisible', 'panelBlocklyVisible', 'panelCodigoVisible', function() {
    this.actualizar_layout();
    return false;
  }),

  actualizar_layout() {
    Ember.run.schedule("afterRender", this, () => {
      var evt = window.document.createEvent('UIEvents');
      evt.initUIEvent('resize', true, false, window, 0);

      window.dispatchEvent(evt);
      window.dispatchEvent(evt);
    });
  }
});
