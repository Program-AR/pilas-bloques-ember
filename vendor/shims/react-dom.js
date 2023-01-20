(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['ReactDOM'],
      __esModule: true,
    };
  }

  define('react-dom', [], vendorModule);
})();