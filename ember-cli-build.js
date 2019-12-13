'use strict';
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    'ember-cli-babel': {
      includePolyfill: true
    },
    'ember-cli-babel-polyfills': {
      evergreenTargets: [
        'last 1 Chrome versions',
        'last 1 Firefox versions',
        'last 1 Safari versions',
      ],
    },
    fingerprint: {
      enabled: true,
    },
    'ember-font-awesome': {
      useScss: true,
      includeFontFiles: true
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('bower_components/proceds-blockly/proceds-blockly-original.js');
  app.import('bower_components/proceds-blockly/proceds-blockly.js');
  app.import('vendor/acorn_interpreter.js');
  app.import('vendor/beautify.js');
  app.import('vendor/utilidades_de_depuracion.js');

  var pilasWeb = new Funnel('node_modules/pilasweb', {
    srcDir: '/dist',
    include: ['**'],
    destDir: '/libs/'
  });

  var pilasBloquesExercises = new Funnel('node_modules/pilas-bloques-exercises', {
    srcDir: '/dist',
    include: ['**'],
    destDir: '/libs/'
  });


  return mergeTrees([app.toTree(), pilasWeb, pilasBloquesExercises], {
    overwrite: true
  });

};
