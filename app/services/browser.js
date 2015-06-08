import Ember from 'ember';

var isNode = (typeof process !== "undefined" && typeof require !== "undefined");
var isNodeWebkit = false;

//Is this Node.js?
if(isNode) {
  //If so, test for Node-Webkit
  try {
    isNodeWebkit = (typeof require('nw.gui') !== "undefined");
  } catch(e) {
    isNodeWebkit = false;
  }
}

export default Ember.Service.extend({
  openLink: function(url) {
    if (isNodeWebkit) {
      var gui = require('nw.gui');
      gui.Shell.openExternal(url);
    } else {
      window.open(url);
    }
  }
});
