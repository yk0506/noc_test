(function() {
  'use strict';

  angular
    .module('power-plant')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
