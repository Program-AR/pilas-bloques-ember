var fs = require('fs');

fs.watchFile('index.html', function() {
  require('nw.gui').Window.get().reloadIgnoringCache();
});
