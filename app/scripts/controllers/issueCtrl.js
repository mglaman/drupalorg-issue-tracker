'use strict';

DrupalIssuesApp.controller('issueCtrl', ['$scope', '$interval', 'ModalService', function($scope, $interval, ModalService) {
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
      templateUrl: "templates/modal.html",
      controller: "ModalController",
      inputs: {
        issue: issue
      }
    }).then(function(modal) {
      modal.element.modal();
    });
  };

  var refreshTime = 1800000 + (8000 * (Math.random()*20));
  $scope.automaticRefresh = function() {
    var currentTime = Date.now();
    if ((currentTime - $scope.issue.refreshed) > refreshTime) {
      $scope.refreshIssue($scope.issue.nid)
    }
  };
  var refreshInterval = $interval($scope.automaticRefresh, refreshTime);
}]);
