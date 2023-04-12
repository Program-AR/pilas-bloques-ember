import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    codigo: {
      replace: true
    }
  },
  pilas: service(),
  storage: service(),

  reactImportedChallenge(){
    const challengeJson = this.storage.getImportedChallenge()
    const id = "react-challenge"
    challengeJson.id = id
    this.store.createRecord("desafio", challengeJson);
    return this.store.peekRecord('desafio', id);
  },

  model(param) {
    if (param.desafio_id === "react-imported-challenge"){
      return this.reactImportedChallenge()
    }
    else{
      return this.store.peekRecord('desafio', param.desafio_id);
    }
  },

  actions: {
    willTransition(transition) {
      const challengeKey = 'desafio_id'
      const challengeIdFrom = transition.from.params[challengeKey]
      const challengeIdTo = transition.to.params[challengeKey]
      if(challengeIdFrom !== challengeIdTo) window.location.reload()
    }
  }

});
