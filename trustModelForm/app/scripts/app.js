'use strict';

/**
 * @ngdoc overview
 * @name trustModelFormApp
 * @description
 * # trustModelFormApp
 *
 * Main module of the application.
 */
angular
  .module('trustModelFormApp', ['ngRoute','schemaForm'])

  // configure our routes
  .config(function($routeProvider, $locationProvider) {
        $routeProvider
            // route for the about page
            .when('/about', {
                templateUrl : 'views/about.html',
                controller  : 'MainCtrl',
                activeTab: 'about'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : 'views/about.html',
                controller  : 'MainCtrl',
                activeTab: 'contact'
            })
            // route for the survey page
            .when('/:page', {
                templateUrl : 'views/main.html',
                controller  : 'MainCtrl',
                activeTab: 'survey'
            })
            .otherwise({ redirectTo: function() {window.location = '/0'} });


        $locationProvider.html5Mode(true)
  })
