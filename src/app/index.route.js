(function() {
  'use strict';

  angular
    .module('power-plant')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('state1', {  //ESS, Solar, DR 모니터링
        url: '/',
        templateUrl: 'app/main/state1.html',
        controller: 'State1Controller',
        controllerAs: 'state1'
      })
      .state('state2', {  //Map
        url: '/state2',
        templateUrl: 'app/main/state2-map.html',
        controller: 'State2Controller',
        controllerAs: 'state2'
      })
      .state('state2-1', { //DR
        url: '/state2-1',
        templateUrl: 'app/main/state2-dr.html',
        controller: 'State2_1Controller',
        controllerAs: 'state2_1'
      })
      .state('state2-2', { //ESS
        url: '/state2-2',
        templateUrl: 'app/main/state2-ess.html',
        controller: 'State2_2Controller',
        controllerAs: 'state2_2'
      })
      .state('state2-3', { //solar
        url: '/state2-3',
        templateUrl: 'app/main/state2-solar.html',
        controller: 'State2_3Controller',
        controllerAs: 'state2_3'
      })
      .state('state3', {
        url: '/state3',
        templateUrl: 'app/main/state3.html',
        controller: 'State3Controller',
        controllerAs: 'state3'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
