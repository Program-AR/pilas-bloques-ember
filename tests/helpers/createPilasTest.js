import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

export default function createPilasTest(context, escena, callback) {
  // context en este caso es el test en si mismo (this).

  return new Ember.RSVP.Promise((resolve) => {

    context.on('onReady', function(pilas) {
      callback(pilas, resolve);
    });

    context.set("escena", escena);
    
    context.render(hbs`{{pilas-canvas onReady='onReady' escena=escena}}`);
  });
}
