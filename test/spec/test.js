/* global describe, it */

(function () {
  'use strict';

  describe('Issue Controller', function() {
    var $rootScope, $scope, $controller;
    beforeEach(module('DrupalIssuesApp', []));

    beforeEach(inject(function(_$rootScope_, _$controller_){
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $controller = _$controller_;

      $controller('DrupalIssuesController', {'$scope': $scope});
    }));

    console.log($controller);

    describe('$scope.issues', function() {
      it('has an initiated issues object', function() {
        var $scope = {};
        var controller = $controller('DrupalIssuesController', { $scope: $scope });
        expect($scope.issues).toEqual({});
      });
    });
  });
})();
