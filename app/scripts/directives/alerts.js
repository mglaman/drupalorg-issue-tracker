'use strict';

DrupalIssuesApp
  .controller('AlertController', ['$scope', '$attrs', function($scope, $attrs) {
    $scope.closeable = 'close' in $attrs;
    this.close = $scope.close;
  }])
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
  });
