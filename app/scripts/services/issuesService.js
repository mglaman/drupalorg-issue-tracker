/*global DrupalIssuesApp*/
'use strict';
DrupalIssuesApp.factory('issuesService', ['$q', 'apiService', 'chromeStorage', 'toastService', function ($q, apiService, chromeStorage, toastService) {
  var issues = {};

  function setIssues(data) {
    issues = data;
  }

  return {
    /**
     *
     * @returns {IPromise<T>}
     */
    getIssues: function () {
      var deferred = $q.defer();

      chromeStorage.get('issueNodes', function(result) {
        if (result && result.issueNodes) {
          setIssues(result.issueNodes);
          deferred.resolve(issues);
        }
      });

      return deferred.promise;
    },
    /**
     *
     */
    saveIssues: function () {
      chromeStorage.set({'issueNodes': issues});
    },
    /**
     *
     * @param nid
     */
    removeIssue: function (nid) {
      delete issues[nid];
      this.saveIssues();
      toastService.add('success', 'Removed #' + nid);
    },

    /**
     *
     * @param nid
     * @returns {IPromise<T>}
     */
    refreshIssue: function (nid) {
      var deferred = $q.defer();
      toastService.add('success','Retrieving data for #' + nid);
      var self = this;

      apiService.getNode(nid).success(function(issueData) {
          apiService.getNode(issueData.field_project.id).success(function(projectData) {
            issues[issueData.nid] = {
              'nid': issueData.nid,
              'refreshed': Date.now(),
              'summary': issueData.title,
              'body': issueData.body.value,
              'status': issueData.field_issue_status,
              'category': issueData.field_issue_category,
              'project': projectData.title
            };
            self.saveIssues();
            toastService.add('success','Retrieved data for #' + issueData.nid);
            deferred.resolve(true);
          });
      })
        .error(function(data, status, headers, config) {
          toastService.add('danger', 'Sorry, there was an error processing the node ID ' + nid);
          deferred.resolve(false);
        });

      return deferred.promise;
    },
    addFromUser: function (uid) {
      var deferred = $q.defer();
      var self = this;
      apiService.getUser(uid).success(function(userData) {
          var $xml = $($.parseXML(userData));
          $xml.find('item').each(function() {
            var linkArray = $(this).find('guid').text().split('/');
            var nid = linkArray[linkArray.length-1];
            self.refreshIssue(nid);
            deferred.resolve(true);
          });
        })
        .error(function(data, status, headers, config) {
          // Ensure ajaxInProcess is false.
          toastService.add('danger', 'Sorry, there was an error processing the user ID');
          deferred.resolve(false);
        });
      return deferred.promise;
    }
  };
}]);
