/**
 * Created by rachel.yang on 2016. 6. 30..
 */

(function() {
  'use strict';

  angular
    .module('power-plant')
    .directive('state2NavEss', state2NavEss)
    .directive('state2Nav2Ess', state2Nav2Ess);

  /** @ngInject */
  function state2NavEss() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/state2-nav/state2-nav-ess.html',
      scope: {
        creationDate: '='
      },
      controller: state2NavESSController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;




    function state2NavESSController(moment, $interval, $state, energyService, $timeout, $log, $http) {
      var vm = this;
      vm.currentState = $state.current.name;

      $interval(function () {
        vm.nowDateTime = moment().format('YYYY-MM-DD h:mm:ss');
        // vm.currentTime = moment().format('h:mm:ss');
      }, 1000);
      vm.currentDay = moment().format('YYYY.MM.DD');

      vm.afterTime = moment().format('h:mm');
      vm.beforeTime = moment().subtract(1, 'hours').format('h:mm');



      // 좌측 상단 막대 8개
      // meter_watt
       miniBarChart();
           function miniBarChart(){
             $http({
               method: 'GET',
               url: 'http://api.ourwatt.com/nvpp/noc/ess/energy/5',
               headers: {
                 api_key: 'smartgrid'
               }
             }).then(function(resp) {
               vm.energyResources = resp.data.data;

               var watt = [];
               vm.currentXtime = [];



               for (var i=0; i<vm.energyResources.length; i++) {
                 if(vm.energyResources[i].generator_watt != null && vm.energyResources[i].generator_watt != 0){
                   watt.push(parseInt(vm.energyResources[i].generator_watt));
                   vm.currentXtime.push(vm.energyResources[i].dem_date);
                 }
               }
               watt = watt.splice(watt.length-8, 8);
               vm.currentXtime = vm.currentXtime.splice(vm.currentXtime.length-8, 8); //최근 8개 시간만

               var watt8 = ['방전량'];
               watt8 = watt8.concat(watt);
               var currentXtime8 = ['x'];
               currentXtime8 = currentXtime8.concat(vm.currentXtime);

               var chartbar1 = c3.generate({
                 bindto: '#chartbar1',
                 data: {
                   x: 'x',
                   columns: [
                     currentXtime8, watt8
                   ],
                   type: 'bar'
                 },
                 bar: {
                   width: 10 // this makes bar width 100px
                 },
                 size: {
                   width: 300,
                   height: 120
                 },
                 color: {
                   pattern: ['#bfffff']
                 },
                 legend: {
                   show: false
                 },
                 axis: {
                   x: {
                     type: 'categories',
                     tick: {
                       rotate: 90
                     },
                     show: false
                   },
                   y: {
                     show: false
                   }
                 }
               });
             }, function errorCallback(response) {
               $log.debug('ERRORS:: ', response);
             });

              $timeout(miniBarChart, 900000);
           }


      getConsumersStatus();
      function getConsumersStatus() {
        energyService.consumersStatus().then(
          function (resp) {
            vm.consumersStatus = resp.consumersStatus[0];
            $timeout(getConsumersStatus, 900000);
          }
        )
      }


      getCompaniesResources();
        function getCompaniesResources() {
          $http({
            method: 'GET',
            url: 'http://api.ourwatt.com/nvpp/noc/ess/vision/5',
            headers: {
              api_key: 'smartgrid'
            }
          }).then(function(resp) {

            vm.solarDemandData = resp.data.list;
            vm.currentGenerator = vm.solarDemandData.generator;
            vm.generator =  vm.solarDemandData.generator * 100 / vm.solarDemandData.max_limit;

            vm.holding_acc_mw = vm.solarDemandData.holding_acc_mw;
            vm.m_ing_cnt = vm.solarDemandData.m_ing_cnt;
            vm.g_ing_cnt = vm.solarDemandData.g_ing_cnt;
            vm.mtnc = vm.solarDemandData.mtnc;
            vm.meter_acc_mw = vm.solarDemandData.meter_acc_mw;
            vm.rest_meter_acc_mw = vm.solarDemandData.rest_meter_acc_mw;

            if (vm.solarDemandData.event.event_status == 'A') {
              vm.emergencyStartDate = moment(vm.solarDemandData.event.event_start).format('YYYY.MM.DD');
              vm.emergencyStartime = moment(vm.solarDemandData.event.event_start).format('hh:mm');
              vm.emargencyEndtime = moment(vm.solarDemandData.event.event_start).add(vm.solarDemandData.event.event_duration, 'h').format('hh:mm');
            }


          }, function errorCallback(response) {
            $log.debug('ERRORS:: ', response);
          });

          /*
           * 급전지시, RESOURCE POOL, COMMUNICATION ZONE
           */
//          energyService.companiesResources().then(
//            function (resp) {
//              vm.companiesResources = resp.companiesResources;
//              vm.currentCompanyResources = vm.companiesResources[0];
//
//              for (var i=0; i<vm.currentCompanyResources.events.length; i++) {
//                if (vm.currentCompanyResources.events[i].event_status == 'A') {
//                  vm.emergencyStartDate = moment(vm.currentCompanyResources.event_start).format('YYYY.MM.DD');
//                  vm.emergencyStartime = moment(vm.currentCompanyResources.event_start).format('hh:mm');
//                  vm.emargencyEndtime = moment(vm.currentCompanyResources.event_start).add(vm.currentCompanyResources.events[i].event_duration, 'h').format('hh:mm');
//                }
//              }
//            }
//          );

          $timeout(getCompaniesResources, 900000);
        }


      getDevelopPlan();
      function getDevelopPlan() {
        energyService.developPlan().then(
          function (resp) {
            vm.developPlan = resp.developPlan[0];

            var chart2Value = ['발전량'];
            for(var i=1; i<10; i++) {
              chart2Value.push(vm.developPlan['0'+i+':00']);
            }
            for(var i=10; i<25; i++) {
              chart2Value.push(vm.developPlan[i+':00']);
            }

            var chartbar2 = c3.generate({
              bindto: '#chartbar2',
              data: {
                x: 'x',
                columns: [
                  ['x', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00',' 11:00', '12:00',
                    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
                  chart2Value
                ],
                type: 'bar'
              },
              bar: {
                width: 3 // this makes bar width 100px
              },
              size: {
                width: 280,
                height: 70
              },
              color: {
                pattern: ['#bfffff']
              },
              legend: {
                show: false
              },
              axis: {
                x: {
                  type: 'categories',
                  show: false
                },
                y: {
                  show: false
                }
              }
            });
            //END chart2
          }
        )
      }



    }
  }

   /*
     * 화면 우측 전체
     */
    function state2Nav2Ess(utilService) {
      var directive = {
        restrict: 'E',
        templateUrl: 'app/components/state2-nav/state2-nav2.html',
        scope: {
          creationDate: '='
        },
        controller: state2Nav2Controller,
        controllerAs: 'vm',
        bindToController: true
      };

      return directive;

      /** @ngInject */
      function state2Nav2Controller($state, energyService, $timeout, $log, $rootScope, $http) {
        var vm = this;

        vm.currentState = $state.current.name;


        getResourcesConsumers();
        function getResourcesConsumers() {

          $http({
            method: 'GET',
            url: 'http://api.ourwatt.com/nvpp/noc/ess/resources/5/consumers',
            headers: {
              api_key: 'smartgrid'
            }
          }).then(function(resp) {
            vm.resourcesConsumers = resp.data.list;

            vm.currentPage = 1;
            if (vm.resourcesConsumers.length%6 != 0) {
              vm.consumerPageNum = parseInt(vm.resourcesConsumers.length/6 +1);
            } else if(vm.resourcesConsumers.length%6 == 0) {
              vm.consumerPageNum = parseInt(vm.resourcesConsumers.length/6);
            }

            vm.existPrevPage = false;
            vm.existNextPage = false;

            if(vm.resourcesConsumers.length > 6)vm.existNextPage = true;

            utilService.buttonCtrl(vm);

          }, function errorCallback(response) {
            $log.debug('ERRORS:: ', response);
          });

          $timeout(getResourcesConsumers, 900000);
        }

        vm.consumerBeginNumber = 0;

        vm.clickedR = function () {
          if (vm.currentPage < vm.consumerPageNum) {  //다음 페이지가 있음
            vm.consumerBeginNumber = vm.consumerBeginNumber+6;
            vm.currentPage = vm.currentPage+1;
            $rootScope.$broadcast('consumerBeginNumber-changedR', {
              consumerBeginNumber: vm.consumerBeginNumber
            });

            if(vm.currentPage < vm.consumerPageNum){  //또 다음 페이지가 있음
              vm.existPrevPage = true;
              vm.existNextPage = true;
            }else{
              vm.existPrevPage = true;
              vm.existNextPage = false;
            }

          } else if (vm.currentPage == vm.consumerPageNum) { //없음
            //alert
            alert('last page!!');
          }

          utilService.buttonCtrl(vm);

        };

        vm.clickedL = function () {
          if (vm.currentPage > 1) { //이전 페이지가 있음
            vm.consumerBeginNumber = vm.consumerBeginNumber-6;
            vm.currentPage = vm.currentPage-1;
            $rootScope.$broadcast('consumerBeginNumber-changedL', {
              consumerBeginNumber: vm.consumerBeginNumber
            });

            if(vm.currentPage > 1){  //또 이전 페이지가 있음
              vm.existPrevPage = true;
              vm.existNextPage = true;
            }else{
              vm.existPrevPage = false;
              vm.existNextPage = true;
            }

          } else if (vm.currentPage == 1) { //없음
            //alert
            alert('first page!!');
          }

          utilService.buttonCtrl(vm);
        };

      }
    }

})();
