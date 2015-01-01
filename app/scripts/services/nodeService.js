'use strict';

DrupalIssuesApp.factory('nodeService', ['$http', '$q', 'nodeEndpoint', function($http, $q, nodeEndpoint) {
  return {
    getNode: function(nid) {
      return $http({method: 'get', url: nodeEndpoint + nid});
    }
  };
}]);