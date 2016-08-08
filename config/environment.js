/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'pilas-engine-bloques',
    environment: environment,
    baseURL: '/',
    versionURL: 'http://pilasbloques.programar.gob.ar/version.json',
    downloadURL: 'http://hugoruscitti.github.io/pilas-engine-bloques/descargas/pilas-engine-bloques-VERSION.zip',
    locationType: 'hash',
    cursoBackendURL: 'http://api.pilasbloques.program.ar',
    EmberENV: {
      EXTEND_PROTOTYPES: {
        Date: false,
        Array: true,
      },
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV['ember-cli-mirage'] = {
      enabled: true
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV['ember-cli-mirage'] = {
      enabled: true
    };

  }

  if (environment === 'production') {

    ENV['ember-cli-mirage'] = {
      enabled: true
    };

  }

  ENV.contentSecurityPolicy = {
    'style-src': "'self' 'unsafe-inline'",
  };

  return ENV;
};
