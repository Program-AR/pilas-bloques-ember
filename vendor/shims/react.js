(function() {
  function vendorModule() {
    'use strict';
    return {
      'default': self['React'],
      __esModule: true,
    };
  }

  define('react', [], vendorModule);
})();