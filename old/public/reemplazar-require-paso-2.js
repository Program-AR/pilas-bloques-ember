var is_nodewebkit = (typeof process == "object");

if (is_nodewebkit) {
  window.ember_require = window.require;

  window.require = function(module) {
    try {
      return window.ember_require(module);
    } catch (e) {
      return window.node_require(module);
    }
  }
}
