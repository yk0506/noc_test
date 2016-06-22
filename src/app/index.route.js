(function() {
  'use strict';

  angular
    .module('power-plant')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('main2', {
        url: '/main2',
        templateUrl: 'app/main/main2.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('main3', {
        url: '/main3',
        templateUrl: 'app/main/main3.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('main4', {
        url: '/main4',
        templateUrl: 'app/main/main4.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('main5', {
        url: '/main5',
        templateUrl: 'app/main/main5.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('main6', {
        url: '/main6',
        templateUrl: 'app/main/main6.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('main7', {
        url: '/main7',
        templateUrl: 'app/main/main7.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('main8', {
        url: '/main8',
        templateUrl: 'app/main/main8.html',
        controller: 'MainController',
        controllerAs: 'main'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
