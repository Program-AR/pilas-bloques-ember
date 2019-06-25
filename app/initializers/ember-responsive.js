import { initialize } from 'ember-responsive/initializers/responsive';

/**
 * Ember responsive initializer
 *
 * Supports auto injecting media service app-wide.
 *
 * Generated by the ember-responsive addon. Customize initialize to change
 * injection.
 */
export default {
  name: 'responsive',
  initialize(application) {
    application.inject('controller', 'media', 'service:media');
    application.inject('component', 'media', 'service:media');
  }
};