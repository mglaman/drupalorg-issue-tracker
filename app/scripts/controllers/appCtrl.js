/*global DrupalIssuesApp, angular*/
'use strict';
DrupalIssuesApp.controller('DrupalIssuesController',['$scope', '$http', '$timeout', '$mdSidenav', '$mdToast', '$mdDialog', 'chromeStorage', 'apiService', function($scope, $http, $timeout, $mdSidenav, $mdToast, $mdDialog, chromeStorage, apiService) {
  $scope.issues = {};
  $scope.issueOrderBy = 'nid';
  $scope.ajaxInProcess = false;

  $scope.toggleSidenav = function () {
    $mdSidenav('left').toggle();
  };

  /**
   * Adds an alert to be displayed.
   *
   * @param type
   * @param message
   */
  $scope.addAlert = function(type, message) {
    $mdToast.show(
      $mdToast.simple()
        .content(message)
        .position('bottom right')
        .hideDelay(2000)
    );
  };

  chromeStorage.get('issueNodes', function(result) {
    $scope.$apply(function() {
      $scope.loadIssues(result);
    });
  });

  $scope.loadIssues = function(value) {
    if (value && value.issueNodes) {
      $scope.issues = value.issueNodes;
    }
  };

  $scope.saveIssues = function() {
    chromeStorage.set({'issueNodes': $scope.issues});
  };

  $scope.addIssue = function(newIssue) {
    if (typeof newIssue.user !== 'undefined') {
      console.info('adding user');
      $scope.addUser(newIssue.user);
      newIssue.user = null;
    }
    if (typeof newIssue.nid !== 'undefined') {
      console.info('adding issue');
      $scope.refreshIssue(newIssue.nid);
      newIssue.nid = null;
    }
  };

  $scope.addUser = function(uid) {
    $scope.ajaxInProcess = uid;

    apiService.getUser(uid)
      .success(function(userData) {
        var $xml = $($.parseXML(userData));
        $xml.find('item').each(function() {
          var linkArray = $(this).find('guid').text().split('/');
          var nid = linkArray[linkArray.length-1];
          $scope.refreshIssue(nid);
        });
      })
      .error(function(data, status, headers, config) {
        // Ensure ajaxInProcess is false.
        $scope.addAlert('danger', 'Sorry, there was an error processing the user ID');
        $scope.ajaxInProcess = false;
      });
  };

  $scope.refreshIssue = function(nid) {
    $scope.ajaxInProcess = nid;

    apiService.getNode(nid)
      .success(function(issueData) {

        apiService.getNode(issueData.field_project.id)
          .success(function(projectData) {

            $scope.issues[issueData.nid] = {
              'nid': issueData.nid,
              'refreshed': Date.now(),
              'summary': issueData.title,
              'body': issueData.body.value,
              'status': issueData.field_issue_status,
              'category': issueData.field_issue_category,
              'project': projectData.title
            };
            $scope.saveIssues();
            $scope.addAlert('success','Retrieved data for #' + issueData.nid);

            $scope.ajaxInProcess = false;
          });
      })
      .error(function(data, status, headers, config) {
        // Ensure ajaxInProcess is false.
        $scope.addAlert('danger', 'Sorry, there was an error processing the node ID ' + nid);
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
        $scope.refreshIssue(keys[counter]);
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
      controller: 'GenericDialogController',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    });
  };
}]);
