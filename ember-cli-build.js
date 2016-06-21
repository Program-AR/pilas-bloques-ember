var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
    var app = new EmberApp(defaults, {
      'ember-font-awesome': {
        useScss: true,
        includeFontFiles: true
      }
    });

app.import('bower_components/bootstrap/dist/css/bootstrap.css');

app.import('vendor/prism/prism.css');
app.import('vendor/prism/prism.js');

//app.import('vendor/pilasweb.js');


//app.import('bower_components/bootstrap/dist/js/bootstrap.js');

/*
app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot', {
    destDir: 'fonts'
});
app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf', {
    destDir: 'fonts'
});
app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg', {
    destDir: 'fonts'
});
app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', {
    destDir: 'fonts'
});
app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2', {
    destDir: 'fonts'
});
app.import('bower_components/bootstrap/dist/css/bootstrap.css.map', {
    destDir: 'assets'
});
*/

    app.import("vendor/libs/blockly/blockly_compressed.js");
    app.import("vendor/libs/blockly/blocks_compressed.js");
    app.import("vendor/libs/blockly/javascript_compressed.js");
    app.import("vendor/libs/blockly/msg/js/es.js");

    return app.toTree();
};
