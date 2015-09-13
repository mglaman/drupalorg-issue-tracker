/*global DrupalIssuesApp*/
'use strict';
DrupalIssuesApp.factory('toastService', ['$mdToast', function ($mdToast) {
  return {
    /**
     * Adds an alert to be displayed.
     *
     * @param type
     * @param message
     */
    add: function(type, message) {
      $mdToast.show(
        $mdToast.simple()
          .content(message)
          .position('bottom right')
          .hideDelay(2000)
      );
    }
  };
}]);
