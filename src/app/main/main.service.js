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
          url: 'http://api.ourwatt.com/nvpp/energy/resources/5',
          headers: {
            api_key: 'smartgrid'
          }
        }).then(function (resp) {

            $log.info('energyResources:: ', resp.data.data);
            // var lastEnergyProd = resp.data.data.prod;
            // var lastEnergyLoad = resp.data.data.load;
            // deferred.resolve({lastEnergyProd: lastEnergyProd, lastEnergyLoad: lastEnergyLoad});
          }, function errorCallback(response) {
            $log.debug('ERRORS:: ', response);
        });
        return deferred.promise;
      }


    };
  }


})();
