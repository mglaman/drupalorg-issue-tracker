'use strict';

DrupalIssuesApp.factory('nodeService', ['$http', '$q', 'nodeEndpoint', 'userEndpoint', function($http, $q, nodeEndpoint, userEndpoint) {
  return {
    getNode: function(nid) {
      return $http({method: 'get', url: nodeEndpoint + nid});
    },
    getUser: function(uid) {
      return $http({method: 'get', url: userEndpoint + uid + '/feed'});
    }
  };
}]);