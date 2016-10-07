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


  function utilService($log, $http, $q) {
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
      }

    };
  }



})();
