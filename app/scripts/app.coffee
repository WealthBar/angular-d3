angular.module('angularD3App', ['ad3'])
.config ($routeProvider) ->
  $routeProvider
    .when('/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    ).otherwise
      redirectTo: '/'
