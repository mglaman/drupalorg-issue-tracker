'use strict';

DrupalIssuesApp.controller('DrupalIssuesController',['$scope', '$http', '$timeout', 'chromeStorage', 'nodeEndpoint', 'nodeService', 'ModalService', function($scope, $http, $timeout, chromeStorage, nodeEndpoint, nodeService, ModalService) {
  $scope.issues = {};
  $scope.issueOrderBy = 'nid';
  $scope.ajaxInProcess = false;
  $scope.alerts = [];

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
    chromeStorage.set({"issueNodes": $scope.issues});
  };

  $scope.addIssue = function(newIssue) {
    $scope.refreshIssue(newIssue.nid);
    newIssue.nid = null;
  };

  $scope.removeIssue = function(nid) {
    delete $scope.issues[nid];
    $scope.addAlert('success', 'Removed #' + nid);
    $scope.saveIssues();
  };

  $scope.refreshIssue = function(nid) {
    $scope.ajaxInProcess = nid;

    nodeService.getNode(nid)
      .success(function(issueData) {
        console.log(issueData);

        nodeService.getNode(issueData.field_project.id)
          .success(function(projectData) {
            console.log(projectData);

            $scope.issues[issueData.nid] = {
              'nid': issueData.nid,
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
        $scope.addAlert('danger', 'Sorry, there was an error processing the node ID');
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

  $scope.openIssue = function(issue) {
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
}]);
