var is_nodewebkit = (typeof process == "object");

if (is_nodewebkit) {
  var gui = require('nw.gui');
  win = gui.Window.get();

  var nativeMenuBar = new gui.Menu({type: "menubar"});

  try {
    nativeMenuBar.createMacBuiltin("My App");
    win.menu = nativeMenuBar;
  } catch (ex) {
    console.log(ex.message);
  }
}
