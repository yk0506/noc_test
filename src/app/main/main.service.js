/**
 * Created by rachel.yang on 2016. 7. 6..
 */

(function () {
  'use strict';

  angular
    .module('power-plant')
    .service('energyService', energyService);


  function energyService($log, $http, $q) {
    $log.info("START energyService!!");

    return {

      energyResources: function () {
        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/app/main/test.json'
          /*
           url: 'http://api.ourwatt.com/nvpp/energy/resources/5',
           headers: {
           api_key: 'smartgrid',
           // Accept: 'application/json',
           'Content-Type': 'application/json; charset=utf-8',
           'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Methods': 'GET',
           'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type'
           }*/
        }).then(function (resp) {

          $log.info('energyResources:: ', resp.data);
          var energyResources = resp.data.data;
          deferred.resolve({energyResources: energyResources});
        }, function errorCallback(response) {
          $log.debug('ERRORS:: ', response);
        });
        return deferred.promise;
      }


    };
  }


})();
