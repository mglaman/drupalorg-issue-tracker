/*global DrupalIssuesApp*/
'use strict';
DrupalIssuesApp.controller('DrupalIssuesController',['$scope', '$http', '$timeout', '$mdSidenav', 'chromeStorage', 'nodeEndpoint', 'nodeService', 'ModalService', function($scope, $http, $timeout, $mdSidenav, chromeStorage, nodeEndpoint, nodeService, ModalService) {
  $scope.issues = {};
  $scope.issueOrderBy = 'nid';
  $scope.ajaxInProcess = false;
  $scope.alerts = [];

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
    $scope.alerts.push({
      type: type,
      msg: message
    });
  };

  /**
   * Removes an alert.
   *
   * @param index
   */
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  chromeStorage.get('issueNodes', function(result) {
    // Check if old local storage has data, merge into sync, purge.
    // @todo: remove at some later date, when most people migrated.
    //chrome.storage.local.get('issueNodes', function (result) {
    //  console.log(result.length > 0);
    //  if (typeof result !== 'undefined' || result.length > 0) {
    //    $scope.$apply(function() {
    //      $scope.loadIssues(result);
    //    });
    //  }
    //  chrome.storage.local.remove('issueNodes');
    //  $scope.saveIssues();
    //});
    //chrome.storage.local.remove('issueNodes');
    if (result.length > 0) {
      $scope.$apply(function() {
        $scope.loadIssues(result);
      });
    }
  });

  $scope.loadIssues = function(value) {
    if (value && value.issueNodes) {
      $scope.issues = value.issueNodes;
    }
  };

  $scope.saveIssues = function() {
    chromeStorage.set({'issueNodes': JSON.stringify($scope.issues)});
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

    nodeService.getUser(uid)
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

    nodeService.getNode(nid)
      .success(function(issueData) {

        nodeService.getNode(issueData.field_project.id)
          .success(function(projectData) {

            $scope.issues[issueData.nid] = {
              'nid': issueData.nid,
              'refreshed': Date.now(),
              'summary': issueData.title,
              'body': issueData.body.value,
              'status': issueData.field_issue_status,
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

  $scope.openSettings = function() {
    ModalService.showModal({
      templateUrl: 'templates/settingsModal.html',
      controller: 'SettingsModalController',
      inputs: {
        issues: $scope.issues,
        // hacky way to allow importing of issues w/o copy+paste of func ;)
        // @todo: Need to move this stuff into a service (1.1.x)
        refreshMethod: $scope.refreshIssue
      }
    }).then(function(modal) {
      modal.element.modal();
    });
  };
}]);
