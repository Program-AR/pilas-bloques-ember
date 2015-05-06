export function initialize(container, application) {
  application.inject('route', 'actividadesService', 'service:actividades');
}

export default {
  name: 'actividades-service',
  initialize: initialize
};
