/*global DrupalIssuesApp*/
'use strict';
DrupalIssuesApp.controller('IssueDialogController', ['$scope', '$sce', '$mdDialog', 'issue', function($scope, $sce, $mdDialog, issue) {
  $scope.issue = issue;
  $scope.summary = issue.summary;
  $scope.body = $sce.trustAsHtml(issue.body) || '';
  $scope.refreshed = issue.refreshed;

  $scope.close = function() {
    $mdDialog.hide();
  };

}]);
