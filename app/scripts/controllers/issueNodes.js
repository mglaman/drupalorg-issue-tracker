'use strict';

DrupalIssuesApp.controller('DrupalIssuesController',['$scope', '$http', 'chromeStorage', function($scope, $http, chromeStorage) {
  $scope.issues = {};
  $scope.issueOrderBy = 'nid';

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
    var request = $http({
      method: 'get',
      url: 'https://www.drupal.org/api-d7/node/' + nid
    });
    request.then(
      // Success
      function(response) {
        var data = response.data;
        console.log(data);
        $scope.issues[data.nid] = {
          'nid': data.nid,
          'summary': data.title,
          'status': data.field_issue_status,
          'project': data.field_project.id
        };
        $scope.saveIssues();
      }
    );
  }
}]);