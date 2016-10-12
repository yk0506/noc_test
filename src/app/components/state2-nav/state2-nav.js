/**
 * Created by rachel.yang on 2016. 6. 30..
 */

(function() {
  'use strict';

  angular
    .module('power-plant')
    .directive('state2Nav', state2Nav)
    .directive('state2Nav2', state2Nav2);

  /** @ngInject */
  function state2Nav() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/state2-nav/state2-nav.html',
      scope: {
        creationDate: '='
      },
      controller: state2NavController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function state2NavController(moment, $interval, $state, energyService, $timeout, $log, utilService, $http) {
      var vm = this;
      vm.currentState = $state.current.name;


      vm.currentDay = moment().format('YYYY.MM.DD');

      vm.afterTime = moment().format('h:mm');
      vm.beforeTime = moment().subtract(1, 'hours').format('h:mm');


      drawLineChart();
      function drawLineChart() {

        var url = 'http://api.ourwatt.com/nvpp/noc/5/energy/0';

        $http({
          method: 'GET',
          url: url,
          headers: {
            api_key: 'smartgrid'
          }
        }).then(function (resp) {

          vm.energyResources = resp.data.data;

          //죄측상단 미니막대그래프 8개
          utilService.drawMiniEightChart('#chartbar1', vm);

        }, function errorCallback(response) {
          $log.error('ERRORS:: ', response);
        });
      }

      getLeftData();
      function getLeftData() {
        $http({
          method: 'GET',
          url: 'http://api.ourwatt.com/nvpp/noc/dr/left/5/0',
          headers: {
            api_key: 'smartgrid'
          }
        }).then(function (resp) {

          vm.leftData = resp.data.data;

          //급전지시 시간
          if(vm.leftData.event){
            vm.emergencyStartDate = moment(vm.leftData.event.event_start).format('YYYY.MM.DD');
            vm.emergencyStartime = moment(vm.leftData.event.event_start).format('HH:mm');
            vm.emargencyEndtime = moment(vm.leftData.event.event_start).add(vm.leftData.event.event_duration, 'h').format('HH:mm');
          }


        }, function errorCallback(response) {
          $log.error('ERRORS:: ', response);
        });
      }


      drawDevelopPlanChart();
      function drawDevelopPlanChart(){
          utilService.drawDevelopPlanChart("#chartbar2");
      }


/*
      getEnergyResources();
      function getEnergyResources() {
        energyService.energyResources().then(
          function (resp) {
            vm.energyResources = resp.energyResources;

            // var cbl = ['cbl'];
            var watt = [];
            vm.currentXtime = [];

            for (var i=0; i<vm.energyResources.length; i++) {
              if(vm.energyResources[i].dem_watt != null){
                watt.push(parseInt(vm.energyResources[i].dem_watt));
                vm.currentXtime.push(vm.energyResources[i].dem_date);
              }
            }
            watt = watt.splice(watt.length-8, 8);
            vm.currentXtime = vm.currentXtime.splice(vm.currentXtime.length-8, 8); //최근 8개 시간만

            var watt8 = ['전력량'];
            watt8 = watt8.concat(watt);
            var currentXtime8 = ['x'];
            currentXtime8 = currentXtime8.concat(vm.currentXtime);

            var chartbar1 = c3.generate({
              bindto: '#chartbar1',
              data: {
                x: 'x',
                columns: [
                  currentXtime8, watt8
                  */
/*['x', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00'],
                  ['data1', 2, 2, 30, 30, 34, 45, 80, 80]*//*

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

            $timeout(getEnergyResources, 900000);

          }
        )
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
        energyService.companiesResources().then(
          function (resp) {
            vm.companiesResources = resp.companiesResources;
            vm.currentCompanyResources = vm.companiesResources[0];

            vm.currentWatt = ((parseFloat(vm.currentCompanyResources.dem_cbl) - parseFloat(vm.currentCompanyResources.dem_watt)) / parseFloat(vm.currentCompanyResources.dem_cbl)) * 100;
            $log.debug('currentWatt:',vm.currentWatt);

            vm.maxAvailable = ((parseFloat(vm.currentCompanyResources.cont_watt) + parseFloat(vm.currentCompanyResources.add_cont_watt))
              / parseFloat(vm.currentCompanyResources.dem_cbl))*100;
            $log.debug('maxA:',vm.maxAvailable);

            vm.currentCompanyNegawattSum = parseFloat(vm.companiesResources[0].cont_watt) + parseFloat(vm.companiesResources[0].add_cont_watt);
            // $log.debug("vm.currentCompanyNegawattSum: ", vm.currentCompanyNegawattSum);

            for (var i=0; i<vm.currentCompanyResources.events.length; i++) {
              if (vm.currentCompanyResources.events[i].event_status == 'A') {
                vm.emergencyStartDate = moment(vm.currentCompanyResources.event_start).format('YYYY.MM.DD');
                vm.emergencyStartime = moment(vm.currentCompanyResources.event_start).format('hh:mm');
                vm.emargencyEndtime = moment(vm.currentCompanyResources.event_start).add(vm.currentCompanyResources.events[i].event_duration, 'h').format('hh:mm');
              }
            }

            // vm.emergencyStartime = moment(vm.currentCompanyResources.cont_start_date).format('hh:mm');
            // vm.emargencyEndtime = moment(vm.currentCompanyResources.cont_start_date).add(vm.currentCompanyResources.cont_duration, 'h').format('hh:mm');

            $timeout(getCompaniesResources, 900000);

          }
        )
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
*/



    }
  }

  function state2Nav2() {
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
    function state2Nav2Controller($state, energyService, $timeout, $log, $rootScope, utilService) {
      var vm = this;
      $log.log('state2Nav2Controller!');

      vm.currentState = $state.current.name;


      //getResourcesConsumers();
      function getResourcesConsumers() {
        energyService.resourcesConsumers().then(
          function (resp) {
            vm.resourcesConsumers = resp.resourcesConsumers;

            vm.currentPage = 1;
            if (vm.resourcesConsumers.length%6 != 0) {
              vm.consumerPageNum = parseInt(vm.resourcesConsumers.length/6 +1);
            } else if(vm.resourcesConsumers.length%6 == 0) {
              vm.consumerPageNum = parseInt(vm.resourcesConsumers.length/6);
            }

            // Tim 수정. 이전페이지 다음페이지가 있을 경우에만 클릭동작, 버튼 on 작업
            vm.existPrevPage = false;
            vm.existNextPage = false;

            if(vm.resourcesConsumers.length > 6)vm.existNextPage = true;

            utilService.buttonCtrl(vm);
            //Tim

            $timeout(getResourcesConsumers, 900000);

          }
        )
      }

      vm.consumerBeginNumber = 0;

      vm.clickedR = function () {
        if (vm.currentPage < vm.consumerPageNum) { //다음 페이지가 있음
          vm.consumerBeginNumber = vm.consumerBeginNumber+6;
          vm.currentPage = vm.currentPage+1;
          $rootScope.$broadcast('consumerBeginNumber-changedR', {
            consumerBeginNumber: vm.consumerBeginNumber
          });

          // Tim 수정. 이전페이지 다음페이지가 있을 경우에만 클릭동작, 버튼 on 작업
          if(vm.currentPage < vm.consumerPageNum){  //또 다음 페이지가 있음
            vm.existPrevPage = true;
            vm.existNextPage = true;
          }else{
            vm.existPrevPage = true;
            vm.existNextPage = false;
          }
          //Tim

        } else if (vm.currentPage == vm.consumerPageNum) { //없음
          //alert
          alert('last page!!');
        }

        // Tim 수정. 이전페이지 다음페이지가 있을 경우에만 클릭동작, 버튼 on 작업
        utilService.buttonCtrl(vm);
      };

      vm.clickedL = function () {
        if (vm.currentPage > 1) { //이전 페이지가 있음
          vm.consumerBeginNumber = vm.consumerBeginNumber-6;
          vm.currentPage = vm.currentPage-1;
          $rootScope.$broadcast('consumerBeginNumber-changedL', {
            consumerBeginNumber: vm.consumerBeginNumber
          });

          // Tim 수정. 이전페이지 다음페이지가 있을 경우에만 클릭동작, 버튼 on 작업
          if(vm.currentPage > 1){  //또 이전 페이지가 있음
            vm.existPrevPage = true;
            vm.existNextPage = true;
          }else{
            vm.existPrevPage = false;
            vm.existNextPage = true;
          }
          //Tim

        } else if (vm.currentPage == 1) { //없음
          //alert
          alert('first page!!');
        }

        // Tim 수정. 이전페이지 다음페이지가 있을 경우에만 클릭동작, 버튼 on 작업
        utilService.buttonCtrl(vm);
      };

    }
  }

})();
