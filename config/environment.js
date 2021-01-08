/* jshint node: true */

module.exports = function (environment) {
  var ENV = {
    modulePrefix: 'pilasbloques',
    environment: environment,
    baseURL: '/',
    locationType: 'hash',
    versionURL: 'https://api.github.com/repos/Program-AR/pilas-bloques/releases/latest',
    googleAnalyticsEnabled: false,
    linkDeDescarga: 'http://pilasbloques.program.ar/',
    'ember-cli-mirage': { enabled: true },
    contentSecurityPolicy: { 'style-src': "'self' 'unsafe-inline'" },
    enableChallengeCreator: false,

    pbAnalytics: {
      sessionExpire: 30
    },

    pbApi: {
      baseURL: null
    },

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
  }


  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true
    // ENV.APP.LOG_ACTIVE_GENERATION = true
    // ENV.APP.LOG_TRANSITIONS = true
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true
    // ENV.APP.LOG_VIEW_LOOKUPS = true
    ENV.enableChallengeCreator = true
    ENV.pbApi.baseURL = 'http://localhost:3006'
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/'
    ENV.locationType = 'none'
    ENV.APP.autoboot = false // <------ false here

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false
    ENV.APP.LOG_VIEW_LOOKUPS = false

    ENV.APP.rootElement = '#ember-testing'
  }

  if (environment === 'production') {
    ENV.enableChallengeCreator = false
    ENV.pbApi.baseURL = 'http://api.pilasbloques'
    ENV.googleAnalyticsEnabled = true
  }

  return ENV
}
