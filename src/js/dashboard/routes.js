'use strict';

/**
 * Route configuration for the Dashboard module.
 */
app.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
  // For unmatched routes
  $urlRouterProvider.otherwise('/');

  // Application routes
  $stateProvider
    .state('index', {
        url: '/',
        templateUrl: 'partials/dashboard.html',
        data: {
          authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
        }
    })
    .state('tasks', {
        url: '/tasks', 
        templateUrl: 'partials/tasks.html'
    })
});
