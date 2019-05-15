var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
    var app = new EmberApp(defaults, {
      fingerprint: {
        enabled: false,
	    },
      'ember-font-awesome': {
        useScss: true,
        includeFontFiles: true
      }
    });

    app.import('bower_components/bootstrap/dist/css/bootstrap.css');
    app.import('bower_components/bluebird/js/browser/bluebird.min.js');
    app.import('bower_components/proceds-blockly/proceds-blockly-original.js');
    app.import('bower_components/proceds-blockly/proceds-blockly.js');
    app.import('vendor/acorn_interpreter.js');
    app.import('vendor/beautify.js');
    app.import('vendor/utilidades_de_depuracion.js');

    process.setMaxListeners(1000);


    var extraAssets = new Funnel('bower_components/pilasweb', {
       srcDir: '/dist',
       include: ['**'],
       destDir: '/libs/'
    });

    return app.toTree(extraAssets);
};
