import { Promise } from 'rsvp';
import hbs from 'htmlbars-inline-precompile';

export default function createPilasTest(context, escena, callback) {
  // context en este caso es el test en si mismo (this).

  return new Promise((resolve) => {

    context.inject.service('pilas');
    context.set("escena", escena);

    context.on('onReady', function(pilas) {
      callback(pilas, resolve, context.get('pilas'));
    });

    context.render(hbs`{{pilas-canvas pilas=pilas onReady='onReady' escena=escena}}`);
  });
}
