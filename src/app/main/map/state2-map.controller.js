/**
 * Created by rachel.yang on 2016. 10. 8..
 */
(function () {
  'use strict';

  angular
    .module('power-plant')
    .controller('State2MapController', State2MapController);

  /** @ngInject */
  function State2MapController($log, $state, $stateParams) {
    var vm = this;
    vm._ = _;

    $log.info("# State2MapController.");


    if ($stateParams.param1) {
      vm.sitename = $stateParams.param1;
    } else {
      vm.sitename = 'seoul';
    }

    if (vm.sitename) {
      vm.site = '/assets/images/map/map-' + vm.sitename + '.png';
    } else {
      vm.site = '/assets/images/map/map-seoul.png';
    }


    vm.zoomoutMap = function () {
      $state.go('state2');
    }

  }
})();
