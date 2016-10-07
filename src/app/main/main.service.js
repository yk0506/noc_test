/**
 * Created by rachel.yang on 2016. 7. 6..
 */

(function () {
  'use strict';

  angular
    .module('power-plant')
    .service('consumerService', consumerService)
    .service('energyService', energyService)
    .service('computedService', computedService);

  function consumerService() {
    this.consumerBeginNumber = 0;
  }


  function energyService($log, $http, $q) {
    $log.info("START energyService!!");
    return {

      /*getConsumerBeginNumber: function() {
       return consumerBeginNumber;
       },
       setConsumerBeginNumber: function(data) {
       consumerBeginNumber = data;
       $log.debug('consumerBeginNumber:: ', consumerBeginNumber);
       return consumerBeginNumber;
       },*/


      energyResources: function () {
        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: 'http://api.ourwatt.com/nvpp/energy/resources/5',
          headers: {
            api_key: 'smartgrid'
          }
        }).then(function (resp) {

          $log.info('energyResources:: ', resp.data);
          var energyResources = resp.data.data;
          deferred.resolve({energyResources: energyResources});
        }, function errorCallback(response) {
          $log.debug('ERRORS:: ', response);
        });
        return deferred.promise;
      },

      companiesResources: function () {
        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: 'http://api.ourwatt.com/nvpp/companies/1/resources',
          headers: {
            api_key: 'smartgrid'
          }
        }).then(function (resp) {

          $log.info('companiesResources:: ', resp.data);
          var companiesResources = resp.data.data;
          deferred.resolve({companiesResources: companiesResources});
        }, function errorCallback(response) {
          $log.debug('ERRORS:: ', response);
        });
        return deferred.promise;
      },

      resourcesConsumers: function () {
        var deferred = $q.defer();

        $http({
          method: 'GET',
          //url: 'http://api.ourwatt.com/nvpp/resources/5/consumers',
          url: 'http://api.ourwatt.com/nvpp/noc/dr/resources/5/consumers',  //Tim 수정 DR 수용가들만 나오도록 API 변경
          headers: {
            api_key: 'smartgrid'
          }
        }).then(function (resp) {

          $log.info('resourcesConsumers:: ', resp.data);
          var resourcesConsumers = resp.data.data;
          deferred.resolve({resourcesConsumers: resourcesConsumers});
        }, function errorCallback(response) {
          $log.debug('ERRORS:: ', response);
        });
        return deferred.promise;
      },

      consumersStatus: function () {
        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: 'http://api.ourwatt.com/nvpp/resources/5/consumers/status',
          headers: {
            api_key: 'smartgrid'
          }
        }).then(function (resp) {

          $log.info('consumersStatus:: ', resp.data);
          var consumersStatus = resp.data.data;
          deferred.resolve({consumersStatus: consumersStatus});
        }, function errorCallback(response) {
          $log.debug('ERRORS:: ', response);
        });
        return deferred.promise;
      },

      developPlan: function () {
        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: 'http://api.ourwatt.com/nvpp/devlop/5/plan',
          headers: {
            api_key: 'smartgrid'
          }
        }).then(function (resp) {

          $log.info('developPlan:: ', resp.data);
          var developPlan = resp.data.data;
          deferred.resolve({developPlan: developPlan});
        }, function errorCallback(response) {
          $log.debug('ERRORS:: ', response);
        });
        return deferred.promise;
      }


    };
  }

  function computedService($log, $http, $q) {
    $log.info("START computedService!!");

    var deferred = $q.defer();

    var resources = $http({
      method: 'GET',
      url: 'http://api.ourwatt.com/nvpp/companies/1/resources',
      headers: {
        api_key: 'smartgrid'
      }
    });

    var consumers = $http({
      method: 'GET',
      //url: 'http://api.ourwatt.com/nvpp/resources/5/consumers',
      url: 'http://api.ourwatt.com/nvpp/noc/dr/resources/5/consumers',  //Tim 수정 DR 수용가들만 나오도록 API 변경
      headers: {
        api_key: 'smartgrid'
      }
    });

    $q.all([resources, consumers])
      .then(function (data) {
        var resources = data[0].data.data[0];
        // var consumers = data[1].data.data;

        var dem_watt = parseFloat(resources.dem_watt),
          dem_cbl = parseFloat(resources.dem_cbl),
          cont_watt = parseFloat(resources.cont_watt),
          // add_cont_watt = parseFloat(resources.add_cont_watt),
          // dem_negawatt = parseFloat(resources.dem_negawatt),
          target = dem_cbl - cont_watt, status = false, code;

        if (resources.social_status) status = true; // status check

        if (dem_watt == 0) deferred.resolve({code: "MAX", status: status}); // dem_watt check

        if (dem_watt > dem_cbl) {
          (dem_watt > target) ? code = "FAIL" : code = "CRITICAL";
        } else if (dem_watt == dem_cbl) {
          code = "ZERO balance";
        } else {
          (dem_watt < target) ? code = "MIN" : ((dem_watt == target) ? code = "TARGET NORMAL" : code = "TARGET HIGH");
        }

        deferred.resolve({code: code, status: status});

      }, function (err) {
        deferred.reject(err);
      });

    return deferred.promise;
  }

})();
