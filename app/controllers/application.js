import Ember from 'ember';

var Bootstrap = window.Bootstrap;

export default Ember.Controller.extend({

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
      }
    }

});
