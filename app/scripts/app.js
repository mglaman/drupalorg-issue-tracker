'use strict';

var DrupalIssuesApp = angular.module('DrupalIssuesApp', ['angularModalService'])
  .constant('chromeStorage', chrome.storage.local)
  .constant('nodeEndpoint', 'https://www.drupal.org/api-d7/node/');
