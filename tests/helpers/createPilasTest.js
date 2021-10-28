import hbs from 'htmlbars-inline-precompile';

export default function createPilasTest(context, sceneConstructor, callback) {
  // context en este caso es el test en si mismo (this).

  return new Promise((resolve) => {

    let pilasService = context.owner.lookup('service:pilas');
    context.set('pilas', pilasService);
    context.set('challenge', { escena: sceneConstructor });
    context.set('onReady', function (pilas) {
      callback(pilas, resolve, pilasService);
    });

    context.render(hbs`{{pilas-canvas pilas=pilas onReady=onReady challenge=challenge}}`);

  });
}
