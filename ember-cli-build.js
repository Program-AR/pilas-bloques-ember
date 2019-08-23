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
      enabled: false,
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

  app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  app.import('bower_components/bluebird/js/browser/bluebird.min.js');
  app.import('bower_components/proceds-blockly/proceds-blockly-original.js');
  app.import('bower_components/proceds-blockly/proceds-blockly.js');
  app.import('node_modules/mulang/build/mulang.js');
  app.import('vendor/acorn_interpreter.js');
  app.import('vendor/beautify.js');
  app.import('vendor/utilidades_de_depuracion.js');
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/css/source-sans-pro.css");
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/EOT/SourceSansPro-Black.eot", { destDir: "fonts/EOT" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/EOT/SourceSansPro-BlackIt.eot", { destDir: "fonts/EOT" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/EOT/SourceSansPro-Bold.eot", { destDir: "fonts/EOT" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/EOT/SourceSansPro-BoldIt.eot", { destDir: "fonts/EOT" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/EOT/SourceSansPro-ExtraLight.eot", { destDir: "fonts/EOT" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/EOT/SourceSansPro-ExtraLightIt.eot", { destDir: "fonts/EOT" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/EOT/SourceSansPro-It.eot", { destDir: "fonts/EOT" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/EOT/SourceSansPro-Light.eot", { destDir: "fonts/EOT" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/EOT/SourceSansPro-LightIt.eot", { destDir: "fonts/EOT" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/EOT/SourceSansPro-Regular.eot", { destDir: "fonts/EOT" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/EOT/SourceSansPro-Semibold.eot", { destDir: "fonts/EOT" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/EOT/SourceSansPro-SemiboldIt.eot", { destDir: "fonts/EOT" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/OTF/SourceSansPro-Black.otf", { destDir: "fonts/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/OTF/SourceSansPro-BlackIt.otf", { destDir: "fonts/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/OTF/SourceSansPro-Bold.otf", { destDir: "fonts/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/OTF/SourceSansPro-BoldIt.otf", { destDir: "fonts/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/OTF/SourceSansPro-ExtraLight.otf", { destDir: "fonts/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/OTF/SourceSansPro-ExtraLightIt.otf", { destDir: "fonts/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/OTF/SourceSansPro-It.otf", { destDir: "fonts/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/OTF/SourceSansPro-Light.otf", { destDir: "fonts/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/OTF/SourceSansPro-LightIt.otf", { destDir: "fonts/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/OTF/SourceSansPro-Regular.otf", { destDir: "fonts/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/OTF/SourceSansPro-Semibold.otf", { destDir: "fonts/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/OTF/SourceSansPro-SemiboldIt.otf", { destDir: "fonts/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/TTF/SourceSansPro-Black.ttf", { destDir: "fonts/TTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/TTF/SourceSansPro-BlackIt.ttf", { destDir: "fonts/TTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/TTF/SourceSansPro-Bold.ttf", { destDir: "fonts/TTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/TTF/SourceSansPro-BoldIt.ttf", { destDir: "fonts/TTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/TTF/SourceSansPro-ExtraLight.ttf", { destDir: "fonts/TTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/TTF/SourceSansPro-ExtraLightIt.ttf", { destDir: "fonts/TTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/TTF/SourceSansPro-It.ttf", { destDir: "fonts/TTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/TTF/SourceSansPro-Light.ttf", { destDir: "fonts/TTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/TTF/SourceSansPro-LightIt.ttf", { destDir: "fonts/TTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/TTF/SourceSansPro-Regular.ttf", { destDir: "fonts/TTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/TTF/SourceSansPro-Semibold.ttf", { destDir: "fonts/TTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/TTF/SourceSansPro-SemiboldIt.ttf", { destDir: "fonts/TTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/OTF/SourceSansPro-Black.otf.woff", { destDir: "fonts/WOFF/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/OTF/SourceSansPro-BlackIt.otf.woff", { destDir: "fonts/WOFF/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/OTF/SourceSansPro-Bold.otf.woff", { destDir: "fonts/WOFF/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/OTF/SourceSansPro-BoldIt.otf.woff", { destDir: "fonts/WOFF/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/OTF/SourceSansPro-ExtraLight.otf.woff", { destDir: "fonts/WOFF/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/OTF/SourceSansPro-ExtraLightIt.otf.woff", { destDir: "fonts/WOFF/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/OTF/SourceSansPro-It.otf.woff", { destDir: "fonts/WOFF/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/OTF/SourceSansPro-Light.otf.woff", { destDir: "fonts/WOFF/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/OTF/SourceSansPro-LightIt.otf.woff", { destDir: "fonts/WOFF/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/OTF/SourceSansPro-Regular.otf.woff", { destDir: "fonts/WOFF/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/OTF/SourceSansPro-Semibold.otf.woff", { destDir: "fonts/WOFF/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/OTF/SourceSansPro-SemiboldIt.otf.woff", { destDir: "fonts/WOFF/OTF" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/TTF/SourceSansPro-Black.ttf.woff", { destDir: "fonts/" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/TTF/SourceSansPro-BlackIt.ttf.woff", { destDir: "fonts/" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/TTF/SourceSansPro-Bold.ttf.woff", { destDir: "fonts/" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/TTF/SourceSansPro-BoldIt.ttf.woff", { destDir: "fonts/" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/TTF/SourceSansPro-ExtraLight.ttf.woff", { destDir: "fonts/" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/TTF/SourceSansPro-ExtraLightIt.ttf.woff", { destDir: "fonts/" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/TTF/SourceSansPro-It.ttf.woff", { destDir: "fonts/" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/TTF/SourceSansPro-Light.ttf.woff", { destDir: "fonts/" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/TTF/SourceSansPro-LightIt.ttf.woff", { destDir: "fonts/" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/TTF/SourceSansPro-Regular.ttf.woff", { destDir: "fonts/" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/TTF/SourceSansPro-Semibold.ttf.woff", { destDir: "fonts/" });
  app.import(app.bowerDirectory + "/fontface-source-sans-pro/fonts/WOFF/TTF/SourceSansPro-SemiboldIt.ttf.woff", { destDir: "fonts/" });

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
