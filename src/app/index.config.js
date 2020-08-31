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
  var getCookie = function(name) {
      var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      return value? value[2] : null;
  };

  if( getCookie("westpoleid") == null ) {
    window.location.href = "http://dev.westpole.biz/login";
  }

})();
