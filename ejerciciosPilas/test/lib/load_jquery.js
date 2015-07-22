(function() {
  var v = '1.8.2';
  var mpjs = window.mochaPhantomJS;
  if (mpjs && mpjs.env.JQUERY_VERSION) {
     v = mpjs.env.JQUERY_VERSION;
  }
  var src = 'http://ajax.googleapis.com/ajax/libs/jquery/' + v + '/jquery.js';

  document.write('<script src="' + src + '"></script>');
  document.write('<script>console.log("Load jQuery: " + $.fn.jquery)</script>');
})();
