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
    this.store.findAll("libro");
    return this.store.findRecord('desafio', param.desafio_id);
  }

});
