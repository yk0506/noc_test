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
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('state2', {
        url: '/state2',
        templateUrl: 'app/main/main5.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('state2-1', {
        url: '/state2-1',
        templateUrl: 'app/main/main6.html',
        controller: 'MainController',
        controllerAs: 'main'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
