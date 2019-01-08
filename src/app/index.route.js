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
      .state('state2-map', {  //korea map
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
        templateUrl: 'app/main/detail-dr.html',
        controller: 'dr_detail_Controller',
        controllerAs: 'state2_1'
      })
      .state('state2-2', { //ESS
        url: '/state2-2',
        templateUrl: 'app/main/detail-ess.html',
        controller: 'ess_detail_Controller',
        controllerAs: 'state2_2'
      })
      .state('state2-3', { //solar
        url: '/state2-3',
        templateUrl: 'app/main/detail-solar.html',
        controller: 'solar_detail_Controller',
        controllerAs: 'state2_3'
      })
      .state('state2-5', { //coldChain
        url: '/state2-5',
        templateUrl: 'app/main/detail-coldChain.html',
        controller: 'coldChain_detail_Controller',
        controllerAs: 'state2_5'
      })
      .state('state3', {  //공장 모니터링
        url: '/state3',
        templateUrl: 'app/main/factory.html',
        controller: 'Factory_Controller',
        controllerAs: 'state3'
      })
      .state('noc-main', {  //NOC 메인 이미지
        url: '/noc-main',
        templateUrl: 'app/main/page-image/main-page.html'
      })
      .state('noc-dr', {  //NOC DR 이미지
        url: '/noc-dr',
        templateUrl: 'app/main/page-image/dr-page.html'
      })
      .state('noc-dhms', {  //NOC 지역난방 이미지
        url: '/noc-dhms',
        templateUrl: 'app/main/page-image/dhms-page.html'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
