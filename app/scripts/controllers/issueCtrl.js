/*global DrupalIssuesApp*/
'use strict';
DrupalIssuesApp.controller('issueCtrl', ['$scope', '$interval', 'ModalService', 'chromeStorage', function($scope, $interval, ModalService, chromeStorage) {
  $scope.removeIssue = function(nid) {
    delete $scope.issues[nid];
    $interval.cancel(refreshInterval);
    refreshInterval = undefined;
    $scope.addAlert('success', 'Removed #' + nid);
    $scope.saveIssues();
  };

  $scope.openIssue = function(issue) {

    // We're removing images for now.
    // @see https://developer.chrome.com/apps/app_external#external
    issue.body = issue.body.replace(/<img.*?\/>/ig, '');

    ModalService.showModal({
      templateUrl: 'templates/modal.html',
      controller: 'ModalController',
      inputs: {
        issue: issue
      }
    }).then(function(modal) {
      modal.element.modal();
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
      $scope.refreshIssue($scope.issue.nid);
    }
  };

}]);
