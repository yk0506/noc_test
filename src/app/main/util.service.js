/**
 * @description : 공통 유틸리티 서비스
 * @author : Tim
 * @date : 2016. 10. 07.
 * @param urlList
 * @return
 */

(function () {
  'use strict';

  angular
    .module('power-plant')
    .service('utilService', utilService);


  function utilService($log, $http, $q, c3) {
    return {

      /*
       * @description : 페이지 이동버튼 on, off 컨트롤
       * @author : Tim
       * @param vm : scope
          - vm에 vm.existPrevPage, vm.existNextPage 존재 해야 함
       */
      buttonCtrl: function (vm) {
        if(vm.existPrevPage){
          buttonOnOff("L", true);
        }else{
          buttonOnOff("L", false);
        }

        if(vm.existNextPage){
          buttonOnOff("R", true);
        }else{
          buttonOnOff("R", false);
        }

        /*
         * @description : 페이지 이동버튼 켜고 끄기
         * @author : Tim
         * @param direction : 'L', 'R'
         * @param onOff : true(on), false(off)
         */
        function buttonOnOff(direction, onOff){
          $(".sector2-button" + direction).css("background-image", 'url("/../assets/images/sector2_image/'+ direction +'_'+ (onOff ? 'on' : 'off') +'.png")');
        }
      },


      /*
       * @description : 발전 상세화면 상단 라인차트 그리기
       * @author : Tim
       * @param selector : DOM 선택자
       * @param cbl : cbl Array
       * @param watt : watt Array
       * @param vm : scope
       */
      drawTopLineChart : function(selector, cbl, watt, vm){
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

        var chart2 = c3.generate({
          bindto: selector,
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
            contents: function (d) {
              // $log.debug(d, defaultTitleFormat, defaultValueFormat, color);

              var data = 0;
              for (var i=0; i<d.length; i++) {
                if (d[i].id == "전력량") {
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
      },


      /*
       * @description : DR 발전상세 화면에서 좌측상단 미니 막대그래프 8개 그리기
       * @author : Tim
       * @param selector : DOM 선택자
       * @param cbl : cbl Array
       * @param watt : watt Array
       * @param vm : scope
       */
      drawMiniEightChart : function(selector, vm){

        var watt = [];
        //vm.currentXtime = [];
        vm.currentXtime8Mini = [];

        for (var i=0; i<vm.energyResources.length; i++) {
          if(vm.energyResources[i].dem_watt != null){
            watt.push(parseInt(vm.energyResources[i].dem_watt));
            vm.currentXtime8Mini.push(vm.energyResources[i].dem_date);
          }
        }
        watt = watt.splice(watt.length-8, 8);
        vm.currentXtime8Mini = vm.currentXtime8Mini.splice(vm.currentXtime8Mini.length-8, 8); //최근 8개 시간만

        var watt8 = ['전력량'];
        watt8 = watt8.concat(watt);
        var currentXtime8 = ['x'];
        currentXtime8 = currentXtime8.concat(vm.currentXtime8Mini);

        var chartbar1 = c3.generate({
          bindto: selector,
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
      }

    };
  }



})();
