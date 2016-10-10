(function () {
  'use strict';

  angular
    .module('power-plant')
    .controller('State2_1Controller', State2_1Controller);

  /** @ngInject */
  function State2_1Controller($log, $timeout, energyService, c3, $scope, computedService, $http, utilService, $rootScope, $interval) {
    var vm = this;
    vm._ = _;

    $log.info("# State2_1Controller.");

    $interval(function () {
      vm.nowDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    }, 1000);
    vm.currentDay = moment().format('YYYY.MM.DD');

    vm.afterTime = moment().format('h:mm');
    vm.beforeTime = moment().subtract(1, 'hours').format('h:mm');


    /*
     * @description : 우측 상단 DR Type 선택했을 때 수용가 리스트 호출
     * @author : Tim
     * @param drType
     *  - 0 : 전체
     *  - 1 : DR1
     *  - 2 : DR2
     *  - 3 : DR3
     *  - 4 : DR4
     *  - 5 : 기타자원
     */
    function getConsumerList(drType){

      $log.info("#getConsumerList start. drType : " + drType);

      vm.drType = drType;

      //로딩중 이미지 보이기
      vm.resourcesConsumers = [];
      vm.consumersBuildings = [];

      vm.consumerBeginNumber = 0;

      var url;
      if(0 == drType) url = 'http://api.ourwatt.com/nvpp/noc/dr/resources/5/consumers';
      else url = 'http://api.ourwatt.com/nvpp/noc/5/drtype/'+ drType +'/consumers';

      $http({
        method: 'GET',
        url: url,
        headers: {
          api_key: 'smartgrid'
        }
      }).then(function (resp) {

        vm.resourcesConsumers = resp.data.data;

        $log.info("#getConsumerList end.");

        if(0 == drType){
          vm.consumersBuildings = resp.data.data;   //전체이면 수용가리스트 뿌리기

          vm.maxAvailNegaWatt = 0;

          for(var i=0 ; i < resp.data.data.length ; i++){
            if(resp.data.data[i].dem_cbl) vm.maxAvailNegaWatt += parseInt(resp.data.data[i].dem_cbl);
          }

          $log.debug("vm.maxAvailNegaWatt : " + vm.maxAvailNegaWatt);
        }
        else getConsDetailList(vm.resourcesConsumers[0].cons_idx);    //수용가 동 리스트 호출

        //페이징
        vm.currentPage = 1;
        if (vm.resourcesConsumers.length%6 != 0) vm.consumerPageNum = parseInt(vm.resourcesConsumers.length/6 +1);
        else vm.consumerPageNum = parseInt(vm.resourcesConsumers.length/6);

        // Tim 수정. 이전페이지 다음페이지가 있을 경우에만 클릭동작, 버튼 on 작업
        vm.existPrevPage = false;
        vm.existNextPage = false;

        if(vm.resourcesConsumers.length > 6)vm.existNextPage = true;

        utilService.buttonCtrl(vm);

      }, function errorCallback(response) {
        $log.error('ERRORS:: ', response);
      });
    }

    vm.drType = 0;                //초기화면은 전체
    getConsumerList(vm.drType);   //초기화면 수용가 리스트
    drawLineChart(vm.drType);     //초기화면 상단 라인차트
    getLeftData(vm.drType);       //초기화면 화면 왼쪽 데이터

    vm.consumerBeginNumber = 0;

    //화면 이동 R 처리
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

      //페이지 이동시 이동된 페이지의 첫번째 수용가 상세정보(동 정보) 호출
      if(vm.drType != 0) getConsDetailList(vm.resourcesConsumers[vm.consumerBeginNumber].cons_idx);
    };

    //화면 이동 L 처리
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

      //페이지 이동시 이동된 페이지의 첫번째 수용가 상세정보(동 정보) 호출
      if(vm.drType != 0) getConsDetailList(vm.resourcesConsumers[vm.consumerBeginNumber].cons_idx);
    };


    /*
     * @description : 수용가 동 리스트 호출
     * @author : Tim
     * @param consumer Idx
     */
    function getConsDetailList(consIdx){
      vm.consIdx = consIdx;

      //로딩중 이미지 보이기
      vm.consumersBuildings = [];

      $log.info("#getConsDetailList start. consIdx : " + consIdx);

      $http({
        method: 'GET',
        url: 'http://api.ourwatt.com/nvpp/noc/'+ consIdx +'/buildinglist',
        headers: {
          api_key: 'smartgrid'
        }
      }).then(function (resp) {

        vm.consumersBuildings = resp.data.data;

        //수용가에 동 정보가 없을 경우 수용가 정보 자체를 동 정보로 사용
        if(vm.consumersBuildings.length == 0){
          for(var i=0 ; i < vm.resourcesConsumers.length ; i++){
            if(consIdx == vm.resourcesConsumers[i].cons_idx) vm.consumersBuildings = [vm.resourcesConsumers[i]];
          }
        }

        //빌딩 페이징 위해..
        vm.buildingsBeginNumber = 0;

        $log.info("#getConsDetailList end.");

        $(".cons-btn").each(function(){
          if(consIdx == $(this).attr("value")) changeConsBtnClass(this, true);
          else changeConsBtnClass(this, false);
        });

      }, function errorCallback(response) {
        $log.error('ERRORS:: ', response);
      });
    }


    //상단 DR1,2,3,4,etc 클릭 이벤트 처리
    vm.clickDR = function(drType){
      $(".drType-btn").each(function(){
        if(drType == $(this).attr("value")) changeBtnClass(this, true);
        else changeBtnClass(this, false);
      });

      function changeBtnClass(obj, onOff){
        if(onOff){
          $(obj).addClass("state2-btn-dr-on");
          $(obj).removeClass("state2-btn-dr");
        }else{
          $(obj).addClass("state2-btn-dr");
          $(obj).removeClass("state2-btn-dr-on");
        }
      }

      //수용가 리스트 호출
      getConsumerList(drType);

      //상단 라인차트 그리기
      drawLineChart(drType);

      //화면 좌측 데이터, 원그래프 정보 호출
      getLeftData(drType);
    }


    //수용가 리스트 클릭 처리
    vm.clickConsumer = function(consIdx){
      $(".cons-btn").each(function(){
        if(consIdx == $(this).attr("value")) changeConsBtnClass(this, true);
        else changeConsBtnClass(this, false);
      });

      //수용가 상세정보(동정보) 호출
      getConsDetailList(consIdx);
    }


     /*
     * @description : 우측 상단 DR Type 선택했을 때 왼쪽 화면정보 호출
     * @author : Tim
     * @param drType
     */
    function getLeftData(drType){
      $http({
        method: 'GET',
        url: 'http://api.ourwatt.com/nvpp/noc/dr/left/5',
        headers: {
          api_key: 'smartgrid'
        }
      }).then(function (resp) {

        vm.leftData = resp.data.data;



      }, function errorCallback(response) {
        $log.error('ERRORS:: ', response);
      });
    }

    //수용가 리스트 on, off
    function changeConsBtnClass(obj, onOff){
      if(onOff){
        $(obj).addClass("consumer-on");
        $(obj).removeClass("consumer-off");
      }else{
        $(obj).addClass("consumer-off");
        $(obj).removeClass("consumer-on");
      }
    }


    vm.currentTime = moment().format('YYYY-MM-DD hh:mm:ss');

    /*
     * @description : drType별 상단 라인차트 그리기
     * @author : Tim
     * @param drType
     */
    function drawLineChart(drType){

      var url = 'http://api.ourwatt.com/nvpp/noc/5/energy/' + drType;

      $http({
        method: 'GET',
        url: url,
        headers: {
          api_key: 'smartgrid'
        }
      }).then(function (resp) {

        vm.energyResources = resp.data.data;

        var cbl = ['cbl'];
        var watt = ['전력량'];

        for (var i=0; i<vm.energyResources.length; i++) {
          cbl.push(vm.energyResources[i].dem_cbl);
          watt.push(vm.energyResources[i].dem_watt);

          if(vm.energyResources[i].dem_watt != null && vm.energyResources[i].dem_watt != 0){
            vm.currentXtime = vm.energyResources[i].dem_date;
            vm.currentXtime8 = vm.energyResources[i].dem_date;
          }
        }

        //중앙상단 라인차트
        utilService.drawTopLineChart('#resource-graph', cbl, watt, vm);

        //죄측상단 미니막대그래프 8개
        utilService.drawMiniEightChart('#chartbar1', vm);

      }, function errorCallback(response) {
        $log.error('ERRORS:: ', response);
      });
    }


    computedService.then(function(result) {
      $log.info('computedResult:: ', result);

      if(result.status == false) {
        switch(result.code) {
          case 'FAIL':
            vm.gageCurrentDevelop = 0;
            break;
          case 'CRITICAL':
            vm.gageCurrentDevelop = 45;
            break;
          case 'CRITICALZEROBALANCE':
            vm.gageCurrentDevelop = 67.5;
            break;
          case 'ZERO balance':
            vm.gageCurrentDevelop = 90;
            break;
          case 'MIN':
            vm.gageCurrentDevelop = 45;
            break;
          case 'TARGET NORMAL':
            vm.gageCurrentDevelop = 45;
            break;
          case 'TARGET HIGH':
            vm.gageCurrentDevelop = 45;
            break;
          case 'MAX':
            vm.gageCurrentDevelop = 45;
            break;
          default:
            vm.gageCurrentDevelop = 0;
        }
      } else {
        vm.gageCurrentDevelop = 270;
      }

    });



    //getCompaniesResources();
    function getCompaniesResources() {
      energyService.companiesResources().then(
        function (resp) {
          vm.companiesResources = resp.companiesResources;
          vm.currentCompanyResources = vm.companiesResources[0]; //처음엔 0번째 자원
          vm.currentCompanyMax = parseFloat(vm.companiesResources[0].dem_cbl) - (parseFloat(vm.companiesResources[0].cont_watt) + parseFloat(vm.companiesResources[0].add_cont_watt));
          // $log.debug('currentCompanyMax:',vm.currentCompanyMax, 'dem_negawatt:',vm.currentCompanyResources.dem_negawatt);

          // vm.gageCurrentDevelop = parseFloat(vm.currentCompanyResources.dem_negawatt) / vm.currentCompanyMax *100;

          $timeout(getCompaniesResources, 900000);

        }
      )
    }

    //getResourcesConsumers();
    function getResourcesConsumers() {
      energyService.resourcesConsumers().then(
        function (resp) {
          vm.resourcesConsumers = resp.resourcesConsumers;
          for (var i=0; i<vm.resourcesConsumers.length; i++) {
            // CBL - (계약용량+추가용량)
            vm.resourcesConsumers[i].maxTarget =
              parseFloat(vm.resourcesConsumers[i].dem_cbl) - (parseFloat(vm.resourcesConsumers[i].cont_watt) + parseFloat(vm.resourcesConsumers[i].add_cont_watt));

            // 가동률
            vm.resourcesConsumers[i].operateRatio =
              ((parseFloat(vm.resourcesConsumers[i].dem_cbl) - parseFloat(vm.resourcesConsumers[i].dem_watt))
              / vm.resourcesConsumers[i].maxTarget)*100;

            // resourcesConsumers
            vm.resourcesConsumers[i].building = (parseFloat(vm.resourcesConsumers[i].dem_watt)/parseFloat(vm.resourcesConsumers[i].dem_cbl))*100;


            vm.resourcesConsumers[i].target = vm.resourcesConsumers[i].dem_cbl - vm.resourcesConsumers[i].cont_watt;

            if (vm.resourcesConsumers[i].target == 0) {
              vm.resourcesConsumers[i].line2 = 493; //target 0%
            } else if (vm.resourcesConsumers[i].target > 0) {
              if (vm.resourcesConsumers[i].target == vm.resourcesConsumers[i].dem_cbl) { // target 100%
                vm.resourcesConsumers[i].line2 = 285;
              } else if (vm.resourcesConsumers[i].target < vm.resourcesConsumers[i].dem_cbl) { // target 1 ~ 99%
                vm.resourcesConsumers[i].line2 = 493 - (((vm.resourcesConsumers[i].target/vm.resourcesConsumers[i].dem_cbl) * 100) * 2.08);
              }
            } else {
              vm.resourcesConsumers[i].line2 = 493;
            }

          }

          $timeout(getResourcesConsumers, 900000);

        }
      )
    }



    $log.log('State2_1Controller!');

    $scope.$on('consumerBeginNumber-changedR', function(event, args) {
      vm.consumerBeginNumber = args.consumerBeginNumber;
      if(vm.drType == 0) vm.buildingsBeginNumber = vm.consumerBeginNumber;
      $log.debug('vm.consumerBeginNumber:', vm.consumerBeginNumber);
    });

    $scope.$on('consumerBeginNumber-changedL', function(event, args) {
      vm.consumerBeginNumber = args.consumerBeginNumber;
      if(vm.drType == 0) vm.buildingsBeginNumber = vm.consumerBeginNumber;
      $log.debug('vm.consumerBeginNumber:', vm.consumerBeginNumber);
    });


  }
})();
