//@ sourceMappingURL=app.map
(function() {
  angular.module('angularD3App', ['ad3']).config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    });
    return $locationProvider.html5Mode(true);
  }).directive('tab', function($rootScope, $location) {
    return function(scope, element, attrs) {
      var hash, toggleActive, watch;
      hash = attrs.href;
      watch = function() {
        return $location.hash();
      };
      toggleActive = function(value) {
        return element.parent().toggleClass("active", value === hash.slice(1));
      };
      return $rootScope.$watch(watch, toggleActive);
    };
  });

}).call(this);

//@ sourceMappingURL=main.map
(function() {
  angular.module('angularD3App').controller('MainCtrl', function($scope) {});

}).call(this);
