'use strict';

var DrupalIssuesApp = angular.module('DrupalIssuesApp', ['angularModalService'])
  .constant('chromeStorage', chrome.storage.local)
  .constant('nodeEndpoint', 'https://www.drupal.org/api-d7/node/')
  .constant('userEndpoint', 'https://www.drupal.org/project/issues/user/');
