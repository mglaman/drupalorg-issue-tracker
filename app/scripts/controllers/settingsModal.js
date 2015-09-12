/*global DrupalIssuesApp*/
'use strict';
DrupalIssuesApp.controller('SettingsModalController', ['$scope', '$timeout', '$mdDialog', 'chromeStorage', 'issues', 'refreshMethod', function($scope, $timeout, $mdDialog, chromeStorage, issues, refreshMethod) {
  $scope.issues = issues;
  $scope.refreshMethod = refreshMethod;
  $scope.export = Object.keys(issues);
  $scope.refreshInterval = null;
  $scope.showExport = false;


  $scope.getRefreshInterval = function() {
    chromeStorage.get('refreshInterval', function(result) {
      $scope.$apply(function() {
        $scope.refreshInterval = result.refreshInterval;
      });
    });
  };
  $scope.getRefreshInterval();

  $scope.setRefreshInterval = function(refreshInterval) {
    chromeStorage.set({'refreshInterval': refreshInterval}, function() {
      $scope.getRefreshInterval();
    });

  };

  $scope.exportIssues = function() {
    $scope.showExport = !$scope.showExport;
  };

  $scope.importIssues = function(jsonArray) {
    jsonArray = JSON.parse(jsonArray);
    var counter = 0;
    var max = jsonArray.length;

    var processIssue = function() {
      if (counter < max) {
        $scope.refreshMethod(jsonArray[counter]);
        counter++;
        $timeout(processIssue, 1000);
      }
      else {
        $scope.close();
      }
    };
    $timeout(processIssue, 1000);
  };

  $scope.close = function() {
    $mdDialog.hide();
  };

}]);
