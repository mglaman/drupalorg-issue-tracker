'use strict';

var DrupalIssuesApp = angular.module('DrupalIssuesApp', ['angularModalService'])
  .constant('chromeStorage', chrome.storage.local)
  .constant('nodeEndpoint', 'https://www.drupal.org/api-d7/node/')
  .constant('userEndpoint', 'https://www.drupal.org/project/issues/user/')
  // @todo: Move this to a "helpers" directives file.
  .directive('autoSelectText', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        element.on('click', function () {
          this.select();
        });
      }
    };
  })
  .filter('objLength', function(){
    return function(input){
      return Object.keys(input).length;
    }
  });
