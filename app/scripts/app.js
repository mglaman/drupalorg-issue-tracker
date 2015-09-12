/*global angular*/
'use strict';
var DrupalIssuesApp = angular.module('DrupalIssuesApp', ['angularModalService', 'ngMaterial']);

DrupalIssuesApp
  .constant('chromeStorage', chrome.storage.local)
  .constant('nodeEndpoint', 'https://www.drupal.org/api-d7/node/')
  .constant('userEndpoint', 'https://www.drupal.org/project/issues/user/')
  .config(function($mdThemingProvider, $mdIconProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('light-blue')
      .accentPalette('orange');
    $mdIconProvider
      .icon('menu', './images/svg/menu.svg', 24)
      .icon('add', './images/svg/add.svg', 24)
      .icon('copy', './images/svg/copy.svg', 24)
      .icon('person', './images/svg/person.svg', 24)
      .icon('refresh', './images/svg/refresh.svg', 24);
  })
  // @todo: Move this to a 'helpers' directives file.
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
    };
  });
