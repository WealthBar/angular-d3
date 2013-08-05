//@ sourceMappingURL=app.map
(function() {
  angular.module('angularD3App', ['ad3']).config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    });
    return $locationProvider.html5Mode(true);
  });

}).call(this);

//@ sourceMappingURL=main.map
(function() {
  angular.module('angularD3App').controller('MainCtrl', function($scope, $timeout) {});

}).call(this);

//@ sourceMappingURL=list-group.map
(function() {


}).call(this);
