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

      energyResources: function () {
        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: 'http://api.ourwatt.com/nvpp/noc/5/energy/0',
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


    var data = $http({
        method: 'GET',
        url: 'http://api.ourwatt.com/nvpp/noc/dr/left/5/2',
        headers: {
          api_key: 'smartgrid'
        }
    });


    $q.all([data])
      .then(function (data) {

        var data = data[0].data.data;

        var dem_watt = parseFloat(data.watt),
          dem_cbl = parseFloat(data.cbl),
          cont_watt = parseFloat(data.cont_watt),
          add_cont_watt = parseFloat(data.add_cont_watt),
          // dem_negawatt = parseFloat(resources.dem_negawatt),
          target = dem_cbl - cont_watt, status = false, code;


//        if (resources.social_status) status = true; // status check

        if (dem_watt == 0) deferred.resolve({code: "MAX", status: status}); // dem_watt check

        if (dem_watt > dem_cbl) {
          if(dem_watt > target)
            code = "FAIL";
          else if(dem_cbl - dem_watt + add_cont_watt < 0 )
            code = "CRITICAL";
          else if(dem_cbl - dem_watt + add_cont_watt > 0 )
            code = "CRITICALZEROBALANCE";
        } else if (dem_watt == dem_cbl) {
          code = "ZERO balance";
        } else {
          if(target < dem_watt && dem_watt < dem_cbl)
            code = "MIN";
          else if(target == dem_watt)
            code = "TARGET NORMAL";
          else if(dem_cbl - (cont_watt + add_cont_watt) >= dem_watt)
            code = "TARGET HIGH";
        }

        deferred.resolve({code: code, status: status});

      }, function (err) {
        deferred.reject(err);
      });

/*    var resources = $http({
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
        var consumers = data[1].data.data;

        var dem_watt = parseFloat(resources.dem_watt),
          dem_cbl = parseFloat(resources.dem_cbl),
          cont_watt = parseFloat(resources.cont_watt),
          add_cont_watt = parseFloat(resources.add_cont_watt),
          // dem_negawatt = parseFloat(resources.dem_negawatt),
          target = dem_cbl - cont_watt, status = false, code;


        if (resources.social_status) status = true; // status check

        if (dem_watt == 0) deferred.resolve({code: "MAX", status: status}); // dem_watt check

        if (dem_watt > dem_cbl) {
          if(dem_watt > target)
            code = "FAIL";
          else if(dem_cbl - dem_watt + add_cont_watt < 0 )
            code = "CRITICAL";
          else if(dem_cbl - dem_watt + add_cont_watt > 0 )
            code = "CRITICALZEROBALANCE";
        } else if (dem_watt == dem_cbl) {
          code = "ZERO balance";
        } else {
          if(target < dem_watt && dem_watt < dem_cbl)
            code = "MIN";
          else if(target == dem_watt)
            code = "TARGET NORMAL";
          else if(dem_cbl - (cont_watt + add_cont_watt) >= dem_watt)
            code = "TARGET HIGH";
        }

        deferred.resolve({code: code, status: status});

      }, function (err) {
        deferred.reject(err);
      });*/

      return deferred.promise;
  }

})();
