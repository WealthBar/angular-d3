angular.module('angularD3App', ['ad3'])
.config ($routeProvider, $locationProvider) ->
  $routeProvider
    .when('/',
      templateUrl: 'views/main.html'
      controller: 'MainCtrl'
    )
  $locationProvider.html5Mode(true);

.directive 'tab', ($rootScope, $location) ->
  (scope, element, attrs) ->
    hash = attrs.href
    watch = () -> $location.hash()
    toggleActive = (value) ->
      element.parent().toggleClass("active", value is hash.slice(1))
    $rootScope.$watch watch, toggleActive

