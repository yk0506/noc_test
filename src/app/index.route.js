(function() {
  'use strict';

  angular
    .module('power-plant')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('state1', {
        url: '/',
        templateUrl: 'app/main/state1.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('state2', {
        url: '/state2',
        templateUrl: 'app/main/state2-map.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('state2-1', {
        url: '/state2-1',
        templateUrl: 'app/main/state2-graph.html',
        controller: 'MainController',
        controllerAs: 'main'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
