angular.module('angularD3App').controller 'MainCtrl', ($scope) ->
  $scope.$watch '', ->
    $('body').scrollspy('refresh')
