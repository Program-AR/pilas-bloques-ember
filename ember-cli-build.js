var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
    var app = new EmberApp(defaults, {
      fingerprint: {
		      exclude: ['favicon']
	    },
      'ember-font-awesome': {
        useScss: true,
        includeFontFiles: true
      }
    });

app.import('bower_components/bootstrap/dist/css/bootstrap.css');

app.import('vendor/prism/prism.css');
app.import('vendor/prism/prism.js');

    process.setMaxListeners(1000);


    var extraAssets = new Funnel('bower_components/pilasweb', {
       srcDir: '/dist',
       include: ['**'],
       destDir: '/libs/'
    });

    return app.toTree(extraAssets);
};
