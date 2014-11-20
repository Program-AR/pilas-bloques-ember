import Ember from 'ember';

var Bootstrap = window.Bootstrap;

export default Ember.Controller.extend({

  myModalButtons: [
      Ember.Object.create({title: 'Submit', clicked:"submit"}),
      Ember.Object.create({title: 'Cancel', clicked:"cancel", dismiss: 'modal'})
  ],

  actions: {
    //Submit the modal
    submit: function() {
      Bootstrap.NM.push('Successfully submitted modal', 'success');
      return Bootstrap.ModalManager.hide('myModal');
    },

    //Cancel the modal, we don't need to hide the model manually because we set {..., dismiss: 'modal'} on the button meta data
    cancel: function() {
      return Bootstrap.NM.push('Modal was cancelled', 'info');
    },

    //Show the modal
    show: function() {
      return Bootstrap.ModalManager.show('myModal');
    }
  }

});
