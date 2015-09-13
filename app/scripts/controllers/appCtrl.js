/*global DrupalIssuesApp, angular*/
'use strict';
DrupalIssuesApp.controller('DrupalIssuesController',['$scope', '$http', '$timeout', '$mdSidenav', 'toastService', '$mdDialog', 'chromeStorage', 'apiService', 'issuesService', function($scope, $http, $timeout, $mdSidenav, toastService, $mdDialog, chromeStorage, apiService, issuesService) {
  $scope.issues = {};
  $scope.issueOrderBy = 'nid';
  $scope.ajaxInProcess = false;

  $scope.toggleSidenav = function () {
    $mdSidenav('left').toggle();
  };

  issuesService.getIssues().then(function (results) {
    $scope.issues = results;
  });

  /**
   * Adds an alert to be displayed.
   *
   * @param type
   * @param message
   */
  $scope.addAlert = function(type, message) {
    toastService.add(type, message);
  };

  $scope.refresh = function(nid) {
    $scope.ajaxInProcess = nid;
    issuesService.refreshIssue(nid).then(function (bool) {
      console.log('refresh resolved.');
      $scope.ajaxInProcess = false;
    });
  };

  $scope.refreshIssues = function() {
    $mdSidenav('left').close();
    $scope.ajaxInProcess = true;

    var keys = Object.keys($scope.issues);
    var counter = 0;
    var max = keys.length;

    var processIssue = function() {
      if (counter < max) {
        issuesService.refreshIssue(keys[counter]);
        counter++;
        $timeout(processIssue, 1000);
      }
    };
    $timeout(processIssue, 1000);

    $scope.ajaxInProcess = false;
  };

  $scope.openSettings = function(ev) {
    $mdSidenav('left').close();
    $mdDialog.show({
      templateUrl: 'templates/dialogs/settings.html',
      controller: 'SettingsModalController',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      issues: $scope.issues,
      refreshMethod: $scope.refreshIssue
    });
  };

  $scope.openNewIssueDialog = function (ev) {
    $mdDialog.show({
      templateUrl: 'templates/dialogs/add-node.html',
      controller: function ($scope, $mdDialog, issuesService) {
        $scope.close = function() {
          $mdDialog.hide();
        };
        $scope.add = function(newIssue) {
          issuesService.refreshIssue(newIssue.nid);
        };
      },
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    });
  };
  $scope.openNewFromUserDialog = function (ev) {
    $mdDialog.show({
      templateUrl: 'templates/dialogs/add-user.html',
      controller: function ($scope, $mdDialog, issuesService) {
        $scope.close = function() {
          $mdDialog.hide();
        };
        $scope.add = function(newIssue) {
          issuesService.addFromUser(newIssue.uid);
        };
      },
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    });
  };
}]);
