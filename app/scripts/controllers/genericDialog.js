/*global DrupalIssuesApp*/
'use strict';
DrupalIssuesApp.controller('GenericDialogController', ['$scope', '$mdDialog', function($scope, $mdDialog) {
  $scope.close = function() {
    $mdDialog.hide();
  };

}]);
