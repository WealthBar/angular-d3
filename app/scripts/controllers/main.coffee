angular.module('angularD3App').controller 'MainCtrl', ($scope) ->
  console.log('laoded')
  $scope.$watch '', ->
    $('body').scrollspy('refresh')

  $scope.stackedSum = () ->
    return unless $scope.line? and $scope.line.length isnt 0
    for value in $scope.line
      total: Number(value.savings) + Number(value.total) + Number(value.optimal)
