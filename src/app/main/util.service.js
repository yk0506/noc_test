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

    var yAxis = ['x',
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

    var yAxis2 = ['x',
      '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
      '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
      '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '24:00'
    ];


    return {

      /*
       * @description : 페이지 이동버튼 on, off 컨트롤
       * @author : Tim
       * @param vm : scope
          - vm에 vm.existPrevPage, vm.existNextPage 존재 해야 함
       */
      buttonCtrl: function (vm) {


        if(vm.error) {
           buttonOnOff("L", false);
           buttonOnOff("R", false);
        } else {
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
        var chart2 = c3.generate({
          bindto: selector,
          data: {
            x: yAxis[0],
            xFormat:'%H:%M',
            columns: [yAxis, cbl, watt]
            ,type: 'spline'  //Line 둥글게
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
          // size: {
          //   width: 1634,
          //   height: 450
          // },
          color: {
            pattern: ['#608080', '#80ffff']
          },
          line: {
            width: 20
          },
          legend: { //밑에 데이터 구분 테이블
            hide: true
          }
        });

        chart2.tooltip.show({x:d3.time.format('%H:%M').parse(vm.currentXtime)});
        $(selector).mouseleave(function () {
          chart2.tooltip.show({x:d3.time.format('%H:%M').parse(vm.currentXtime)});
        });
      },



      /*
       * @description : 화면 상단 그래프 계산식 :     계약용량 + (CBL - 현재전력사용량)
       * @author : Tim
       * @param selector : DOM 선택자
       * @param cbl : cbl Array
       * @param watt : watt Array
       * @param vm : scope
       */
      drawTopLineChartDR : function(selector, calcArray, vm){
        var chart2 = c3.generate({
          bindto: selector,
          data: {
            x: yAxis[0],
            xFormat:'%H:%M',
            columns: [yAxis, calcArray]
            ,type: 'spline'  //Line 둥글게
          },
          grid: { //점선
            x: {
              show: true
            },
            y: {
              lines:[
                {value: vm.cont_watt, text: 'Contract(kW) : ' + vm.cont_watt, position: 'start'}
              ]
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
              , min: 0
            }

          },
          point: {
            show: false
          },
          tooltip: {
            contents: function (d) {
              // $log.debug(d, defaultTitleFormat, defaultValueFormat, color);

              // var data = 0;
              // for (var i=0; i<d.length; i++) {
              //   if (d[i].id == "전력량") {
              //     data = d[i].value;
              //   }
              // }

              if (d[0] && d[0].value) {
                var dataHtml = '<div style="width: 100px;height: 30px;color: #80ffff;background-color: #597c80;' +
                  'border-radius: 10px;font-size: 20px;text-align: center;margin-left: -70px;">' +  d[0].value + '</div>'; // formatted html as you want
              } else {
                var dataHtml = '';
              }

              return dataHtml;

            }
          },
          color: {
            pattern: ['#608080', '#80ffff']
          },
          line: {
            width: 10
          },
          legend: {
            hide: false
          }
        });

        chart2.tooltip.show({x:d3.time.format('%H:%M').parse(vm.currentXtime)});
        $(selector).mouseleave(function () {
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
          if(vm.energyResources[i].dem_watt != null && vm.energyResources[i].dem_watt != 0){
            watt.push(parseInt(vm.energyResources[i].dem_watt));
            vm.currentXtime8Mini.push(vm.energyResources[i].dem_date);
          }
        }
        watt = watt.splice(watt.length-16, 16);
        vm.currentXtime8Mini = vm.currentXtime8Mini.splice(vm.currentXtime8Mini.length-16, 16); //최근 8개 시간만

        var watt8 = ['전력량'];
        watt8 = watt8.concat(watt);
        var currentXtime8 = ['x'];
        currentXtime8 = currentXtime8.concat(vm.currentXtime8Mini);

        $log.info("#### currentXtime8", currentXtime8);
        $log.info("#### watt8", watt8);

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
            width: 592,
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
      },

      /*
       * @description : 오늘 발전 계획 차트 그리기
       * @author : Tim
       * @param selector : DOM 선택자
       */
      drawDevelopPlanChart : function(selector){
        $http({
          method: 'GET',
          url: 'http://api.ourwatt.com/nvpp/devlop/5/plan',
          headers: {
            api_key: 'smartgrid'
          }
        }).then(function (resp) {

          $log.info('### drawDevelopPlanChart ', resp.data);

          var developPlan = resp.data.data[0];

          var chart2Value = ['발전량'];
          for(var i=1; i<10; i++) {
            chart2Value.push(developPlan['0'+i+':00']);
          }
          for(var i=10; i<25; i++) {
            chart2Value.push(developPlan[i+':00']);
          }

          var chartbar2 = c3.generate({
            bindto: selector,
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

        }, function errorCallback(response) {
          $log.debug('ERRORS:: ', response);
        });
      },

      /*
       * @description : 화면 상단 그래프 계산식 :     물동량 시간대별 콜드지수
       * @author : HS
       * @param selector : DOM 선택자
       * @param cbl : cbl Array
       * @param watt : watt Array
       * @param vm : scope
       */
      drawTopLineChartColdIdex : function(selector, todayColdArray, lastColdArray, vm){
        var chart2 = c3.generate({
          bindto: selector,
          data: {
            x: yAxis2[0],
            xFormat:'%H:%M',
            columns: [yAxis2, todayColdArray, lastColdArray]
          },
          grid: { //점선
            x: {
              lines: [
                {value: '00:00'}, {value: '01:00'}, {value: '02:00'}, {value: '03:00'}, {value: '04:00'}, {value: '05:00'}, {value: '06:00'}, {value: '07:00'}, {value: '08:00'}, {value: '09:00'}, {value: '10:00'}, {value: '11:00'}, {value: '12:00'},
                {value: '13:00'}, {value: '14:00'}, {value: '15:00'}, {value: '16:00'}, {value: '17:00'}, {value: '18:00'}, {value: '19:00'}, {value: '20:00'}, {value: '21:00'}, {value: '22:00'}, {value: '23:00'}, {value: '24:00'}
              ]
            }
          },
          axis: { //가로 세로줄
            x: {
              show: true,
              type: 'timeseries',
              tick: {
                format: '%H',
                values: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
              }
            },
            y: {
              show: true
              , min: 0
              , max: 1
              ,tick: {
                values: [0, 0.5, 1],
                format: d3.format(",%")
              }
            }

          },
          point: {
            show: false
          },
          tooltip: {
            contents: function (d) {
              // $log.debug(d, defaultTitleFormat, defaultValueFormat, color);

              // var data = 0;
              // for (var i=0; i<d.length; i++) {
              //   if (d[i].id == "전력량") {
              //     data = d[i].value;
              //   }
              // }

              if (d[0] && d[0].value) {
                var dataHtml = '<div style="width: 100px;height: 30px;color: #80ffff;background-color: #597c80;' +
                  'border-radius: 10px;font-size: 20px;text-align: center;margin-left: -70px;">' +  d[0].value + '</div>'; // formatted html as you want
              } else {
                var dataHtml = '';
              }

              return dataHtml;

            }
          },
          color: {
            pattern: ['#608080', '#80ffff']
          },
          line: {
            width: 10
          },
          legend: {
            hide: false,
            padding: 10,
            item: {
              tile: {
                width: 15,
                height: 14
              }
            }
          }
        });

      },


      /*
       * @description : 카테고리별 콜드지수 그래프 그리기
       * @author : HS
       * @param selector : DOM 선택자
       * @param cbl : cbl Array
       * @param watt : watt Array
       * @param vm : scope
       */
      drawMiniCatColdIndex : function(selector, vm){
        var coldIndex = ['콜드지수', 78, 35, 84, 54, 42, 61, 80];

        var chartbar1 = c3.generate({
          bindto: selector,
          data: {
            x: 'x',
            columns: [
              ['x', '1', '2', '3', '4', '5', '6', '7'], coldIndex
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
      },

      getRandomIntInclusive:  function (min, max) {
        return (Math.floor(Math.random() * (max - min + 1)) + min) / 100;
      },


      SHA256: function (s){

        var chrsz   = 8;
        var hexcase = 0;

        function safe_add (x, y) {
          var lsw = (x & 0xFFFF) + (y & 0xFFFF);
          var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
          return (msw << 16) | (lsw & 0xFFFF);
        }

        function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
        function R (X, n) { return ( X >>> n ); }
        function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
        function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
        function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
        function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
        function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
        function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

        function core_sha256 (m, l) {

          var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
            0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
            0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
            0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
            0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147,
            0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
            0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B,
            0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
            0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
            0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
            0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);

          var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);

          var W = new Array(64);
          var a, b, c, d, e, f, g, h, i, j;
          var T1, T2;

          m[l >> 5] |= 0x80 << (24 - l % 32);
          m[((l + 64 >> 9) << 4) + 15] = l;

          for ( var i = 0; i<m.length; i+=16 ) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];

            for ( var j = 0; j<64; j++) {
              if (j < 16) W[j] = m[j + i];
              else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

              T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
              T2 = safe_add(Sigma0256(a), Maj(a, b, c));

              h = g;
              g = f;
              f = e;
              e = safe_add(d, T1);
              d = c;
              c = b;
              b = a;
              a = safe_add(T1, T2);
            }

            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
          }
          return HASH;
        }

        function str2binb (str) {
          var bin = Array();
          var mask = (1 << chrsz) - 1;
          for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
          }
          return bin;
        }

        function Utf8Encode(string) {
          string = string.replace(/\r\n/g,"\n");
          var utftext = "";

          for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
              utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
            }

          }

          return utftext;
        }

        function binb2hex (binarray) {
          var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
          var str = "";
          for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
              hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
          }
          return str;
        }

        s = Utf8Encode(s);

        var result = binb2hex(core_sha256(str2binb(s), s.length * chrsz));
        if(result && result.length > 5){
          result = result.toUpperCase();
          result = result.substring(0, 5);
        }

        return result;

      }



    };
  }









})();
