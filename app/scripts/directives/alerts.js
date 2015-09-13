/*global DrupalIssuesApp*/
'use strict';

DrupalIssuesApp
  .controller('AlertController', ['$scope', '$attrs', function($scope, $attrs) {
    $scope.closeable = 'close' in $attrs;
    this.close = $scope.close;
  }])
  .controller('ToastCtrl', function($scope, $mdToast) {
    $scope.closeToast = function() {
      $mdToast.hide();
    };
  })
  .directive('alert', function() {
    return {
      restrict: 'EA',
      controller: 'AlertController',
      templateUrl: 'templates/alert.html',
      transclude: true,
      replace: true,
      scope: {
        type: '@',
        close: '&'
      }
    };
  })
  .directive('toast', function() {
    return {
      restrict: 'EA',
      controller: 'ToastCtrl',
      templateUrl: 'templates/toast.html',
      transclude: true,
      replace: true,
      scope: {
        type: '@',
        close: '&'
      }
    };
  })
  .directive('dismissOnTimeout', ['$timeout', function($timeout) {
    return {
      require: 'alert',
      link: function(scope, element, attrs, alertCtrl) {
        $timeout(function(){
          alertCtrl.close();
        }, parseInt(attrs.dismissOnTimeout, 10));
      }
    };
  }]);
