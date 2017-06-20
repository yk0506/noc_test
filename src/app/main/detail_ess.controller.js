(function () {
  'use strict';

  angular
    .module('power-plant')
    .controller('ess_detail_Controller', ess_detail_Controller);

  /** @ngInject */
  function ess_detail_Controller($log, $timeout, energyService, c3, $scope, $http, utilService, $rootScope) {
    var vm = this;
    vm._ = _;

    console.log("# ESS. ess_detail_Controller");

    var getDemandDataTimeout;
    var drawLineChartTimeout;
    var getEssConsumersTimeout;

    //화면을 떠날 때 interval clear
    $scope.$on('$destroy', function (event) {
      if (getDemandDataTimeout) $timeout.cancel(getDemandDataTimeout);
      if (drawLineChartTimeout) $timeout.cancel(drawLineChartTimeout);
      if (getEssConsumersTimeout) $timeout.cancel(getEssConsumersTimeout);
    });

    var settings = {
      root: $(".zoomViewport"),
      // show debug points in element corners. helps
      // at debugging when zoomooz positioning fails
      debug: false,
      // this specifies, that clicking an element that is zoomed to zooms
      // back out
      closeclick: true
    };

    $(document).ready(function () {
      $(".zoomTargeting").zoomTarget(settings);
    });

    vm.consumerBeginNumber = 0;

    getDemandData();
    function getDemandData() {
      $http({
        method: 'GET',
        url: 'http://api.ourwatt.com/nvpp/noc/ess/vision/5',
        headers: {
          api_key: 'smartgrid'
        }
      }).then(function (resp) {

        // 데이터 집합
        vm.essDemandData = resp.data.list;

        //vm.max_limit = vm.essDemandData.max_limit;
        vm.generator = vm.essDemandData.generator;

        vm.gageCurrentDevelop = vm.essDemandData.generator_rate;

      }, function errorCallback(response) {
        $log.debug('ERRORS:: ', response);
      });

      getDemandDataTimeout = $timeout(getDemandData, 900000);
    }


    vm.currentTime = moment().format('YYYY-MM-DD hh:mm:ss');

    // vm.timeX = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'];

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
      '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45'
    ];


    //중앙 상단 라인차트
    drawLineChart();
    function drawLineChart() {
      $http({
        method: 'GET',
        // url: 'http://api.ourwatt.com/nvpp/noc/ess/energy/5',
        url: 'http://api.ourwatt.com/nvpp/noc/2017/ess/resource/12/graph',
        // url: 'http://localhost:8090/ROOT/nvpp/noc/2017/ess/resource/5/graph',
        headers: {
          api_key: 'smartgrid'
        }
      }).then(function (resp) {

        //상단 라인차트
        vm.energyResources = resp.data.data;

        var dr = ['DR'];
        var fr = ['FR'];

        for (var i = 0; i < vm.energyResources.length; i++) {
          if (vm.energyResources[i].battery_charge != null) {

            var socDR = (vm.energyResources[i].battery_charge / 180).toFixed(2);  //SOC
            var drVal = 0;
            drVal = 120 * socDR;
            dr.push(drVal * 0.5);  //DR은 2시간 기준


            var frVal = 0;
            if(vm.energyResources[i].battery_charge > 120){
              frVal = 120;
            }else{
              var soc = (vm.energyResources[i].battery_charge / 180).toFixed(2);  //SOC
              frVal = 120 * soc;
            }

            fr.push(frVal);                //FR은 15분 기준
            vm.currentXtime = vm.energyResources[i].dem_date;
          }else{
            dr.push(null);
            fr.push(null);
          }
        }

        var chart2 = c3.generate({
          bindto: '#resource-graph',
          data: {
            x: vm.timeX[0],
            xFormat: '%H:%M',
            columns: [vm.timeX, dr, fr],
            // axes: {
            //   // dr: 'y',
            //   fr: 'y2'
            // },
            type: 'spline'  //Line 둥글게
          },
          grid: { //점선
            x: {
              show: true
            },
            y: {
              show: false
            }
          },
          axis: { //가로 세로줄
            x: {
              show: true,
              type: 'timeseries',
              tick: {
                format: '%H:%M',
                values: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
              }
            },
            y: {
              show: true
            }
            // ,y2: {
            //   show: true
            // }
          },
          point: {
            show: false
          },
          // tooltip: {
          //   contents: function (d) {
          //     // $log.debug(d, defaultTitleFormat, defaultValueFormat, color);
          //
          //     var data = 0;
          //     for (var i = 0; i < d.length; i++) {
          //       if (d[i].id == "방전량") {
          //         data = d[i].value;
          //       }
          //     }
          //
          //     if (data != null) {
          //       var dataHtml = '<div style="width: 100px;height: 30px;color: #80ffff;background-color: #597c80;' +
          //         'border-radius: 10px;font-size: 20px;text-align: center;margin-left: -70px;">' + data + '</div>'; // formatted html as you want
          //     } else {
          //       var dataHtml = '';
          //     }
          //
          //     return dataHtml;
          //
          //   }
          // },
          // size: {
          //   width: 1634,
          //   height: 450
          // },
          color: {
            pattern: ['#ff7e47', '#80ffff']
          },
          line: {
            width: 10
          },
          legend: { //밑에 데이터 구분 테이블
            hide: false
          }
        });

        chart2.tooltip.show({x: d3.time.format('%H:%M').parse(vm.currentXtime)});
        $("#resource-graph").mouseleave(function () {
          chart2.tooltip.show({x: d3.time.format('%H:%M').parse(vm.currentXtime)});
        });

        getEssConsumers(resp.data.consArray);

      }, function errorCallback(response) {
        $log.debug('ERRORS:: ', response);
      });

      drawLineChartTimeout = $timeout(drawLineChart, 900000);
    }


    //중앙 하단 막대그래프, 수용가 건물 리스트
    //getEssConsumers();
    function getEssConsumers(consList) {

      vm.consumerBeginNumber = 0;
      // $http({
      //   method: 'GET',
      //   url: 'http://api.ourwatt.com/nvpp/noc/ess/resources/5/consumers',
      //   headers: {
      //     api_key: 'smartgrid'
      //   }
      // }).then(function (resp) {
        //vm.resourcesConsumers = consList;

        vm.max_limit = 0;
        vm.resourcesConsumers = [];

        //수용가 리스트를 돌면서
        for (var i = 0; i < consList.length; i++) {
          consList[i].line2 = 442;

          var totalBatteryVolume = 0;
          var totalBatteryCharge = 0;
          var bmsFeedCount = 0;
          var socTotalValue = 0;
          var pcsTotalValue = 0;

          var curr_date_time = "";

          //수용가내의 BMS Feed를 돌면서
          for(var j=0 ; j < consList[i].consBmsFeedJsonList.length ; j++){
            var nowBmsFeed = consList[i].consBmsFeedJsonList[j];

            curr_date_time = nowBmsFeed.curr_date_time;

            bmsFeedCount++;
            socTotalValue += nowBmsFeed.soc;
            pcsTotalValue += nowBmsFeed.pcs_kw;

            totalBatteryVolume += nowBmsFeed.btr_volume_kwh;
            totalBatteryCharge += nowBmsFeed.feedBattertyCharge;

            vm.max_limit += nowBmsFeed.pcs_kw * nowBmsFeed.soc / 100;
          }

          /*
           * 화면단에 맵핑할 데이터 셋팅
           */
          vm.resourcesConsumers.push({
            sgname: consList[i].sgname
            ,socAvg: socTotalValue / bmsFeedCount
            , pcs: pcsTotalValue / bmsFeedCount
            , totalBatteryVolume: totalBatteryVolume
            , totalBatteryCharge: totalBatteryVolume * socTotalValue / bmsFeedCount / 100
            , dr: (pcsTotalValue / bmsFeedCount) * (socTotalValue / bmsFeedCount / 100)
            //, fr: 100
            , curr_date_time: curr_date_time
          });
        }

        //페이징
        vm.currentPage = 1;
        if (vm.resourcesConsumers.length % 6 != 0) vm.consumerPageNum = parseInt(vm.resourcesConsumers.length / 6 + 1);
        else vm.consumerPageNum = parseInt(vm.resourcesConsumers.length / 6);

        // Tim 수정. 이전페이지 다음페이지가 있을 경우에만 클릭동작, 버튼 on 작업
        vm.existPrevPage = false;
        vm.existNextPage = false;

        if (vm.resourcesConsumers.length > 6) vm.existNextPage = true;

        utilService.buttonCtrl(vm);

      // }, function errorCallback(response) {
      //   $log.debug('ERRORS:: ', response);
      //   vm.error = response;
      //   utilService.buttonCtrl(vm);
      // });

      getEssConsumersTimeout = $timeout(getEssConsumers, 900000);
    }


    vm.clickedR = function () {
      if (vm.currentPage < vm.consumerPageNum) {  //다음 페이지가 있음
        vm.consumerBeginNumber = vm.consumerBeginNumber + 6;
        vm.currentPage = vm.currentPage + 1;
        $rootScope.$broadcast('consumerBeginNumber-changedR', {
          consumerBeginNumber: vm.consumerBeginNumber
        });

        if (vm.currentPage < vm.consumerPageNum) {  //또 다음 페이지가 있음
          vm.existPrevPage = true;
          vm.existNextPage = true;
        } else {
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
        vm.consumerBeginNumber = vm.consumerBeginNumber - 6;
        vm.currentPage = vm.currentPage - 1;
        $rootScope.$broadcast('consumerBeginNumber-changedL', {
          consumerBeginNumber: vm.consumerBeginNumber
        });

        if (vm.currentPage > 1) {  //또 이전 페이지가 있음
          vm.existPrevPage = true;
          vm.existNextPage = true;
        } else {
          vm.existPrevPage = false;
          vm.existNextPage = true;
        }

      } else if (vm.currentPage == 1) { //없음
        //alert
        alert('first page!!');
      }

      utilService.buttonCtrl(vm);
    };


    $scope.$on('consumerBeginNumber-changedR', function (event, args) {
      vm.consumerBeginNumber = args.consumerBeginNumber;
      $log.debug('vm.consumerBeginNumber:', vm.consumerBeginNumber);
    });

    $scope.$on('consumerBeginNumber-changedL', function (event, args) {
      vm.consumerBeginNumber = args.consumerBeginNumber;
      $log.debug('vm.consumerBeginNumber:', vm.consumerBeginNumber);
    });


  }
})();
