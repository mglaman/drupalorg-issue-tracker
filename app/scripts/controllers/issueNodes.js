'use strict';

DrupalIssuesApp.controller('DrupalIssuesController',['$scope', '$http', 'chromeStorage', 'nodeEndpoint', 'nodeService', function($scope, $http, chromeStorage, nodeEndpoint, nodeService) {
  $scope.issues = {};
  $scope.issueOrderBy = 'nid';
  $scope.ajaxInProcess = false;

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
    $scope.saveIssues();
  };

  $scope.refreshIssue = function(nid) {
    $scope.ajaxInProcess = true;

    nodeService.getNode(nid)
      .success(function(issueData) {
        console.log(issueData);

        nodeService.getNode(issueData.field_project.id)
          .success(function(projectData) {
            console.log(projectData);

            $scope.issues[issueData.nid] = {
              'nid': issueData.nid,
              'summary': issueData.title,
              'status': issueData.field_issue_status,
              'project': projectData.title
            };
            $scope.saveIssues();

            $scope.ajaxInProcess = false;
          });
      })
      .error(function(data) {
        // Ensure ajaxInProcess is false.
        $scope.ajaxInProcess = false;
      });
  }
}]);