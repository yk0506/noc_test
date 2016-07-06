(function () {
  'use strict';

  angular
    .module('power-plant')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, energyService) {
    var vm = this;

    getEnergyResources();
    function getEnergyResources() {
      energyService.energyResources().then(
        function (resp) {
          vm.test = resp;

          $timeout(getEnergyResources, 3600000);

        }
      )
    }

  }
})();
