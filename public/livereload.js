var is_nodewebkit = (typeof process == "object");

if (is_nodewebkit) {
  var fs = require('fs');

  fs.watchFile('index.html', function() {
    setTimeout(function() {
      require('nw.gui').Window.get().reloadIgnoringCache();
    }, 1000);
  });
}
