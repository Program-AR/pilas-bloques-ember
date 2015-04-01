import Ember from 'ember';

var Bootstrap = window.Bootstrap;

export default Ember.Controller.extend({
  url: '',
  queryParams: ['layout'],
  layout: true,

  mostrar_url: function() {
    var controller = this;

    var actualizar = function(){
      controller.set('url', window.location.href);
    };

    setInterval(actualizar, 100);

  }.on('init'),

    myModalButtons: [
        Ember.Object.create({title: 'Cerrar', dismiss: 'modal'})
    ],

    actions: {
      show: function() {
        return Bootstrap.ModalManager.show('myModal');
      },
      mostrar_devtools: function() {
        require('nw.gui').Window.get().showDevTools();
      },
      actualizar: function() {
        location.reload(true);
      },
      redimensionar: function() {
        alert("tengo que redimensionar!");
      }
    }

});
