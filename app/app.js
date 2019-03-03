'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ui.router',
  'ngMaterial',
  'md.data.table',
  'ngFileUpload',
  'satellizer',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3',
  'myApp.version'
]).
config(function($stateProvider, $urlRouterProvider, $mdThemingProvider, $mdAriaProvider) {
    $mdAriaProvider.disableWarnings();
    
    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('red')

    $urlRouterProvider.when("", "/view1");
    $stateProvider.state({
      name: 'view1',
      url: '/view1',
      views: {
        '': {
          templateUrl: 'view1/view1.html',
          controller: 'View1Ctrl',
          controllerAs: 'v1ctrl'
        }
      }
    })

    $stateProvider.state({
      name: 'view2',
      url: '/view2',
      views: {
        '': {
          templateUrl: 'view2/view2.html',
          controller: 'View2Ctrl'
        }
      }
    })

    $stateProvider.state({
      name: 'view3',
      url: '/view3',
      views: {
        '': {
          templateUrl: 'view3/view3.html',
          controller: 'View3Ctrl'
        }
      }
    })
});
