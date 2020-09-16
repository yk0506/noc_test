(function() {
  'use strict';

  angular
    .module('power-plant')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }


  /* 로그인 후 접속할 수 있도록 쿠키 체크 로직 추가 */
  /* 특정 도메인 경로를 포함할 때만 동작하도록 함 */

  var curr_loc = window.location.href;
  var getCookie = function(name) {
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value? value[2] : null;
    };

  if(curr_loc.indexOf("westpole") !== -1
      && getCookie("westpoleid") == null ) {
        window.location.href = "http://westpole.biz/login";
  }
})();
