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
    function state2NavController(moment, $interval, $state, energyService, $timeout, $log) {
      var vm = this;
      vm.currentState = $state.current.name;

      $interval(function () {
        vm.nowDateTime = moment().format('YYYY-MM-DD h:mm:ss');
        // vm.currentTime = moment().format('h:mm:ss');
      }, 1000);
      vm.currentDay = moment().format('YYYY.MM.DD');

      vm.afterTime = moment().format('h:mm');
      vm.beforeTime = moment().subtract(1, 'hours').format('h:mm');


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
                  /*['x', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00'],
                  ['data1', 2, 2, 30, 30, 34, 45, 80, 80]*/
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
            vm.currentCompanyNegawattSum = parseFloat(vm.companiesResources[0].cont_watt) + parseFloat(vm.companiesResources[0].add_cont_watt);
            // $log.debug("vm.currentCompanyNegawattSum: ", vm.currentCompanyNegawattSum);


            for (var i=0; i<vm.currentCompanyResources.events.length; i++) {
              if (vm.currentCompanyResources.events[i].event_status == 'B') {
                vm.emergencyStartime = moment(vm.currentCompanyResources.event_start).format('hh:mm');
                vm.emargencyEndtime = moment(vm.currentCompanyResources.event_start).add(vm.currentCompanyResources.events[i].event_duration, 'h').format('hh:mm');
              }
            }

            // vm.emergencyStartime = moment(vm.currentCompanyResources.cont_start_date).format('hh:mm');
            // vm.emargencyEndtime = moment(vm.currentCompanyResources.cont_start_date).add(vm.currentCompanyResources.cont_duration, 'h').format('hh:mm');

            vm.typeA = [];
            vm.typeB = [];
            vm.typeC = [];

            for (var i=0; i<vm.currentCompanyResources.events.length; i++) {
              if (vm.currentCompanyResources.events[i].event_type == 'A') {
                vm.typeA.push(vm.currentCompanyResources.events[i]);
              } else if (vm.currentCompanyResources.events[i].event_type == 'B') {
                vm.typeB.push(vm.currentCompanyResources.events[i]);
              } else {
                vm.typeC.push(vm.currentCompanyResources.events[i]);
              }
            }
            // $log.info('typeA:',vm.typeA,' typeB:',vm.typeB,' typeC:',vm.typeC);

            $timeout(getCompaniesResources, 900000);

          }
        )
      }


      var chartbar2 = c3.generate({
        bindto: '#chartbar2',
        data: {
          x: 'x',
          columns: [
            ['x', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',' 11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
            ['data1', 2, 2, 30, 30, 34, 45, 50, 50, 2, 2, 30, 30, 34, 45, 50, 50, 2, 2, 30, 30, 34, 45, 50, 50]
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
    function state2Nav2Controller($state) {
      var vm = this;

      vm.currentState = $state.current.name;

    }
  }

})();
