import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    codigo: {
      replace: true
    }
  },
  pilas: service()
});
