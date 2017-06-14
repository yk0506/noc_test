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
        templateUrl: 'app/main/main.html',
        controller: 'Main_Controller',
        controllerAs: 'state1'
      })
      .state('state2', {  //Map
        url: '/state2',
        templateUrl: 'app/main/state2-map.html',
        controller: 'State2Controller',
        controllerAs: 'state2'
      })
      .state('state2-map', {  //zoom map
        url: '/state2-map',
        params: {
          param1: null
        },
        templateUrl: 'app/main/map/zoom-map.html',
        controller: 'State2MapController',
        controllerAs: 'map'
      })
      .state('state2-1', { //DR
        url: '/state2-1',
        templateUrl: 'app/main/state2-dr.html',
        controller: 'dr_detail_Controller',
        controllerAs: 'state2_1'
      })
      .state('state2-2', { //ESS
        url: '/state2-2',
        templateUrl: 'app/main/state2-ess.html',
        controller: 'ess_detail_Controller',
        controllerAs: 'state2_2'
      })
      .state('state2-3', { //solar
        url: '/state2-3',
        templateUrl: 'app/main/state2-solar.html',
        controller: 'solar_detail_Controller',
        controllerAs: 'state2_3'
      })
      .state('state3', {  //공장 모니터링
        url: '/state3',
        templateUrl: 'app/main/factory.html',
        controller: 'Factory_Controller',
        controllerAs: 'state3'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
