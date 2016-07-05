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
    function state2NavController(moment, $interval, $state) {
      var vm = this;
      vm.currentState = $state.current.name;

      $interval(function () {
        vm.currentTime = moment().format('h:mm:ss');
      }, 1000);
      vm.currentDay = moment().format('YYYY.MM.DD');

      vm.afterTime = moment().format('h:mm');
      vm.beforeTime = moment().subtract(1, 'hours').format('h:mm');

      var chartbar1 = c3.generate({
        bindto: '#chartbar1',
        data: {
          x: 'x',
          columns: [
            ['x', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00'],
            ['data1', 2, 2, 30, 30, 34, 45, 80, 80]
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

      var chartbar1 = c3.generate({
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
