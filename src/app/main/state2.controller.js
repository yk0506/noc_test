(function () {
  'use strict';

  angular
    .module('power-plant')
    .controller('State2Controller', State2Controller);

  /** @ngInject */
  function State2Controller($log, $timeout, energyService, c3, $scope, $state) {
    var vm = this;
    vm._ = _;

    $log.info("# State2Controller.");

     var settings = {
      root: $(".zoomViewport"),
      // show debug points in element corners. helps
      // at debugging when zoomooz positioning fails
      debug: false,
      // this specifies, that clicking an element that is zoomed to zooms
      // back out
      closeclick: true
    };

    $(document).ready(function() {
      $(".zoomTargeting").zoomTarget(settings);
    });


    vm.zoomMap = function (site) {
      $state.go('state2-map', {param1: site});
    };


    vm.currentTime = moment().format('YYYY-MM-DD hh:mm:ss');

    vm.timeX = ['x',
      '00:00', '00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45',
      '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45',
      '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45',
      '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45',
      '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45',
      '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45',
      '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45',
      '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45',
      '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45',
      '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45',
      '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45',
      '23:00', '23:15', '23:30', '23:45', '24:00', '24:15', '24:30', '24:45'
    ];


    //맵 하단 라인차트
    getEnergyResources();
    function getEnergyResources() {
      energyService.energyResources().then(
        function (resp) {
          vm.energyResources = resp.energyResources;

          var cbl = ['cbl'];
          var watt = ['전력량'];

          for (var i=0; i<vm.energyResources.length; i++) {
            cbl.push(vm.energyResources[i].dem_cbl);
            watt.push(vm.energyResources[i].dem_watt);

            if(vm.energyResources[i].dem_watt != null){
              vm.currentXtime = vm.energyResources[i].dem_date;
            }
          }

          var chart1 = c3.generate({
            bindto: '#resource-map',
            data: {
              x: vm.timeX[0],
              xFormat:'%H:%M',
              columns: [vm.timeX, cbl, watt]
            },
            grid: { //점선
              x: {
                show: false
              },
              y: {
                show: false
              }
            },
            axis: { //가로 세로줄
              x: {
                show: false,
                type: 'timeseries',
                tick: {
                  format: '%H:%M',
                  values: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
                }
              },
              y: {
                show: false
              }

            },
            point: {
              show: false
            },
            tooltip: {
              show: false
            },
            size: {
              width: 2530,
              height: 300
            },
            color: {
              pattern: ['#608080', '#c5bc6d']
            },
            line: {
              width: 10
            },
            legend: { //밑에 데이터 구분 테이블
              hide: true
            }
          });

          $timeout(getEnergyResources, 900000);

        }
      )
    }


    vm.consumerBeginNumber = 0;

    $scope.$on('consumerBeginNumber-changedR', function(event, args) {
      vm.consumerBeginNumber = args.consumerBeginNumber;
      $log.debug('vm.consumerBeginNumber:', vm.consumerBeginNumber);
    });

    $scope.$on('consumerBeginNumber-changedL', function(event, args) {
      vm.consumerBeginNumber = args.consumerBeginNumber;
      $log.debug('vm.consumerBeginNumber:', vm.consumerBeginNumber);
    });


  }
})();
