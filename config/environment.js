/* jshint node: true */

var experimentGroup = process.env.EXPERIMENT_GROUP
if (!experimentGroup) {
  experimentGroup = 'notAffected'
  console.log(`\nInfo: EXPERIMENT_GROUP variable not set. Building Pilas Bloques in default mode: ${experimentGroup}. See README.md for valid EXPERIMENT_GROUP values`)
}

module.exports = function (environment) {
  var ENV = {
    modulePrefix: 'pilasbloques',
    environment: environment,
    baseURL: '/',
    locationType: 'hash',
    versionURL: 'https://api.github.com/repos/Program-AR/pilas-bloques/releases/latest',
    googleAnalyticsEnabled: false,
    linkDeDescarga: 'http://pilasbloques.program.ar/',
    contentSecurityPolicy: { 'style-src': "'self' 'unsafe-inline'" },
    enableChallengeCreator: false,
    testTranslations: false,
    experimentGroup,
    decompositionTreatmentLength: 6,

    showdown: {
      simpleLineBreaks: true,
      emoji: true
    },

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
    ENV.testTranslations = false
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/'
    ENV.locationType = 'none'
    ENV.APP.autoboot = false // ember-qunit needs it to be false.

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false
    ENV.APP.LOG_VIEW_LOOKUPS = false

    ENV.APP.rootElement = '#ember-testing'
    ENV.pbApi.baseURL = 'http://testing-api'
  }

  // We use this for staging as well
  if (environment === 'production') {
    ENV.enableChallengeCreator = false
    ENV.googleAnalyticsEnabled = true
    // The baseURL is replaced in production and staging during deploy
    // However, we need this here because it is used when packaging the app.
    ENV.pbApi.baseURL = 'https://pilasbloques.program.ar/api'
    ENV.testTranslations = false
  }

  return ENV
}
