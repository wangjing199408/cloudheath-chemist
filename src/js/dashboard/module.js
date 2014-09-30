var app = angular.module('Dashboard', ['ui.utils', 'ui.bootstrap', 'ui.router', 'ngCookies', 'ngMorph', 'angular-loading-bar', 'cloudheath-chemist.services'])
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.withCredentials = true
}])

.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})
