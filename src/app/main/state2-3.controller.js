(function () {
  'use strict';

  angular
    .module('power-plant')
    .controller('State2_3Controller', State2_3Controller);

  /** @ngInject */
  function State2_3Controller($log, $timeout, energyService, c3, $scope, computedService, $http) {
    var vm = this;
    vm._ = _;

    console.log("# Solar. state2-3 Controller.");


    getDemandData();
    function getDemandData(){
      $http({
        method: 'GET',
        url: 'http://api.ourwatt.com/nvpp/noc/solar/vision/5',
        headers: {
          api_key: 'smartgrid'
        }
      }).then(function(resp) {

        //전력 데이터 집합
        vm.solarDemandData = resp.data.list;

        //중앙 원형 그래프 %
        vm.gageCurrentDevelop = vm.solarDemandData.nega_watt_rate;

      }, function errorCallback(response) {
        $log.debug('ERRORS:: ', response);
      });

      $timeout(getDemandData, 900000);
    }

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


    //중앙 상단 라인차트
    drawLineChart();
    function drawLineChart(){
      $http({
        method: 'GET',
        url: 'http://api.ourwatt.com/nvpp/noc/solar/energy/5',
        headers: {
          api_key: 'smartgrid'
        }
      }).then(function(resp) {

        vm.energyResources = resp.data.data;

        var avg = ['avg'];
        var watt = ['발전량'];

        for (var i=0; i<vm.energyResources.length; i++) {
          avg.push(vm.energyResources[i].dem_cbl);
          watt.push(vm.energyResources[i].dem_watt);

          if(vm.energyResources[i].dem_watt != null){
            vm.currentXtime = vm.energyResources[i].dem_date;
          }
        }

        var chart2 = c3.generate({
          bindto: '#resource-graph',
          data: {
            x: vm.timeX[0],
            xFormat:'%H:%M',
            columns: [vm.timeX, avg, watt]
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
            contents: function (d) {
              // $log.debug(d, defaultTitleFormat, defaultValueFormat, color);

              var data = 0;
              for (var i=0; i<d.length; i++) {
                if (d[i].id == "발전량") {
                  data = d[i].value;
                }
              }

              if (data != null) {
                var dataHtml = '<div style="width: 100px;height: 30px;color: #80ffff;background-color: #597c80;' +
                  'border-radius: 10px;font-size: 20px;text-align: center;margin-left: -70px;">' +  data + '</div>'; // formatted html as you want
              } else {
                var dataHtml = '';
              }

              return dataHtml;

            }
          },
          size: {
            width: 1700,
            height: 450
          },
          color: {
            pattern: ['#608080', '#80ffff']
          },
          line: {
            width: 10
          },
          legend: { //밑에 데이터 구분 테이블
            hide: true
          }
        });

        chart2.tooltip.show({x:d3.time.format('%H:%M').parse(vm.currentXtime)});
        $("#resource-graph").mouseleave(function () {
          chart2.tooltip.show({x:d3.time.format('%H:%M').parse(vm.currentXtime)});
        });

      }, function errorCallback(response) {
        $log.debug('ERRORS:: ', response);
      });

      $timeout(drawLineChart, 900000);
    }



    //
    getSolarConsumers();
    function getSolarConsumers() {

      $http({
        method: 'GET',
        url: 'http://api.ourwatt.com/nvpp/noc/solar/resources/5/consumers',
        headers: {
          api_key: 'smartgrid'
        }
      }).then(function(resp) {
        vm.resourcesConsumers = resp.data.list;
        for (var i=0; i<vm.resourcesConsumers.length; i++) {

          var currentConsumer = vm.resourcesConsumers[i];

          // 가동률
          try{
             vm.resourcesConsumers[i].operateRatio = currentConsumer.ac / currentConsumer.goal * 100;
          }catch(e){
             vm.resourcesConsumers[i].operateRatio = 0;
            $log.error('ERRORS:: ', e);
          }

          //최소한계출력 라인
          vm.resourcesConsumers[i].line2 = 442;
        }

      }, function errorCallback(response) {
        $log.debug('ERRORS:: ', response);
      });

      $timeout(getSolarConsumers, 900000);
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
