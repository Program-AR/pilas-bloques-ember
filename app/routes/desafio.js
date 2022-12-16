import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    codigo: {
      replace: true
    }
  },
  pilas: service(),

  model(param) {
    return this.store.peekRecord('desafio', param.desafio_id);
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
