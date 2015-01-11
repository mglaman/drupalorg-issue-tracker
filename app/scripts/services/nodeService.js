'use strict';

DrupalIssuesApp.factory('nodeService', ['$http', '$q', 'nodeEndpoint', 'userEndpoint', function($http, $q, nodeEndpoint, userEndpoint) {
  return {
    getNode: function(nid) {
      return $http({method: 'get', url: nodeEndpoint + nid});
    },
    getUser: function(user) {
      return $http({method: 'get', url: userEndpoint + user + '/feed'});
    }
  };
}]);