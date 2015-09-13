/*global DrupalIssuesApp, angular*/
'use strict';
DrupalIssuesApp.controller('issueCtrl', ['$scope', '$interval', '$mdDialog', 'ModalService', 'chromeStorage', 'issuesService', function($scope, $interval, $mdDialog, ModalService, chromeStorage, issuesService) {
  $scope.remove = function(nid) {
    issuesService.removeIssue(nid);
    $interval.cancel(refreshInterval);
    refreshInterval = undefined;
  };

  $scope.openIssue = function(issue) {

    // We're removing images for now.
    // @see https://developer.chrome.com/apps/app_external#external
    issue.body = issue.body.replace(/<img.*?\/>/ig, '');


    $mdDialog.show({
      templateUrl: '../../templates/dialogs/issue-dialog.html',
      controller: 'IssueDialogController',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      issue: issue
    });
  };

  $scope.refreshInterval = null;
  $scope.refreshTime = null;
  var refreshInterval = null;

  chromeStorage.get('refreshInterval', function(result) {
    $scope.$apply(function() {
      $scope.refreshInterval = result.refreshInterval;
      $scope.refreshTime = ($scope.refreshInterval * 60000) + (8000 * (Math.random()*20));
      refreshInterval = $interval($scope.automaticRefresh, $scope.refreshTime);
    });
  });

  //var refreshTime =
  $scope.automaticRefresh = function() {
    var currentTime = Date.now();
    if ((currentTime - $scope.issue.refreshed) > $scope.refreshTime) {
      issuesService.refreshIssue($scope.issue.nid);
    }
  };

}]);
