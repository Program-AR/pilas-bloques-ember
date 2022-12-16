'use strict';
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const mergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

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
      enabled: false,
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

  app.import('vendor/acorn_interpreter.js');
  app.import('vendor/beautify.js');
  app.import('vendor/utilidades_de_depuracion.js');

  const blocklyPackage = new Funnel('node_modules/blockly-package', {
    srcDir: '/',
    include: [
      'blockly_compressed.js',
      'blocks_compressed.js',
      'es.js',
      'javascript_compressed.js'
    ],
    destDir: '/assets/'
  });

  const blocklyMedia = new Funnel('node_modules/blockly-package', {
    srcDir: '/media',
    include: ['**'],
    destDir: '/media/'
  });

  const procedsBlockly = new Funnel('node_modules/proceds-blockly', {
    srcDir: '/',
    include: ['proceds-blockly-original.js', 'proceds-blockly.js'],
    destDir: '/assets/'
  });

  const mulang = new Funnel('node_modules/mulang', {
    srcDir: '/build',
    include: ['mulang.js'],
    destDir: '/assets/'
  });

  const clientJS = new Funnel('node_modules/clientjs', {
    srcDir: '/dist',
    include: ['**'],
    destDir: '/assets/'
  });

  const uuid = new Funnel('node_modules/uuid', {
    srcDir: 'dist/umd',
    include: ['**'],
    destDir: '/assets/'
  });

  const unzipit = new Funnel('node_modules/unzipit', {
    srcDir: '/dist',
    include: ['**'],
    destDir: '/assets/'
  });

  const pilasWeb = new Funnel('node_modules/pilasweb', {
    srcDir: '/dist',
    include: ['**'],
    destDir: '/libs/'
  });

  const pilasBloquesExercises = new Funnel('node_modules/pilas-bloques-exercises', {
    srcDir: '/dist',
    include: ['**'],
    destDir: '/libs/'
  });

  const pilasBloquesCreador = new Funnel('node_modules/creador-de-desafios-pilasbloques', {
    srcDir: '/build',
    include: ['**'],
    exclude: ['/static'],
    destDir: '/libs/creador-de-desafios-pilasbloques'
  });

  const pilasBloquesCreadorStaticAssets = new Funnel('node_modules/creador-de-desafios-pilasbloques', {
    srcDir: '/build/static',
    include: ['**'],
    destDir: '/static/'
  });

  return mergeTrees([
    app.toTree(),
    blocklyPackage,
    blocklyMedia,
    procedsBlockly,
    mulang,
    uuid,
    clientJS,
    pilasWeb,
    unzipit,
    pilasBloquesExercises,
    pilasBloquesCreador,
    pilasBloquesCreadorStaticAssets
  ], {
    overwrite: true
  });

};
