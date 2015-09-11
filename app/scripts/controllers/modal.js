/*global DrupalIssuesApp*/
'use strict';
DrupalIssuesApp.controller('ModalController', ['$scope', '$sce', 'issue', 'close', function($scope, $sce, issue, close) {
  $scope.issue = issue;
  $scope.summary = issue.summary;
  $scope.body = $sce.trustAsHtml(issue.body) || '';
  $scope.refreshed = issue.refreshed;
  console.log($scope.refreshed);

  $scope.close = function() {
    close({}, 500); // close, but give 500ms for bootstrap to animate
  };

}]);
