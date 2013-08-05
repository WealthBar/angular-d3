angular.module('angularD3App', ['ad3'])
.config ($routeProvider, $locationProvider) ->
  $routeProvider
    .when('/',
      templateUrl: 'views/main.html'
      controller: 'MainCtrl'
    )
  $locationProvider.html5Mode(true);

