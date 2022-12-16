import Route from '@ember/routing/route';

export default Route.extend({

  model(params) {
    const challenges = this.store.peekAll("desafio")
    let challenge = challenges.find( c => c.nombre === params.nombreDelDesafio)

    if (!challenge) {
      throw new Error(`No existe una actividad con el nombre ${params.nombreDelDesafio}`);
    }

    return this.transitionTo("desafio", challenge);

  }

});
