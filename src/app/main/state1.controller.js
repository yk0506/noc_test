(function () {
  'use strict';

  angular
    .module('power-plant')
    .controller('State1Controller', State1Controller);

  /** @ngInject */
  function State1Controller($log, $timeout, energyService, c3, $scope, computedService, $http) {
    var vm = this;
    vm._ = _;

    console.log("# State1 Controller.");


    //전체데이터 가져오기
    getAllData();
    function getAllData(){
      $http({
        method: 'GET',
        url: 'http://api.ourwatt.com/nvpp/noc/total',
        headers: {
          api_key: 'smartgrid'
        }
      }).then(function(resp) {

        vm.apiData = resp.data;

        $log.info("Api data load complete.");

      }, function errorCallback(response) {
        $log.debug('ERRORS:: ', response);
      });

      $timeout(getAllData, 900000);
    }


    $scope.essSmallRotate = calcSmallRotate(180);
    $scope.essLargeRotate = calcLargeRotate(1);

//    $scope.solarSmallRotate = calcSmallRotate(150);
//    $scope.solarLargeRotate = calcSmallRotate(2);
//
//    $scope.drSmallRotate = calcSmallRotate(270);
//    $scope.drLargeRotate = calcSmallRotate(3);

    // 가용량
    // 0 이면 12 부터 시작, +30 -> 한 칸 증가
    function calcSmallRotate(degree) {

      var result;

      if(degree < 180 || degree == 360) {
        result = { 'position' : 'absolute' , '-webkit-transform' : 'rotate('+degree+'deg)' ,'left' : '44px' , 'top': '128px'};
      } else if (degree >= 180) {
        result = { 'position' : 'absolute' , '-webkit-transform' : 'rotate('+degree+'deg)' ,'left' : '48px' , 'top': '130px'};
      }

      return result;
    }

    // 현재 출력
    function calcLargeRotate(flag) {

      var result;

      if(flag == 0) {
        result = { 'position' : 'absolute' , '-webkit-transform' : 'rotate(180deg)' ,'left' : '696px' , 'top': '129px'};
      } else if (flag == 1) {
        result = { 'position' : 'absolute' , '-webkit-transform' : 'rotate(253deg)' ,'left' : '693px' , 'top': '131px'};
      } else if (flag == 2) {
        result = { 'position' : 'absolute' , '-webkit-transform' : 'rotate(318deg)' ,'left' : '693px' , 'top': '129px'};
      } else if (flag == 3) {
        result = { 'position' : 'absolute' , '-webkit-transform' : 'rotate(42deg)' ,'left' : '693px' , 'top': '127px'};
      } else if (flag == 4) {
        result = { 'position' : 'absolute' , '-webkit-transform' : 'rotate(108deg)' ,'left' : '696px' , 'top': '127px'};
      }

      return result;
    }




  }
})();
