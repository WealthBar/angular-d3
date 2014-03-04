angular.module('angularD3App').controller 'MainCtrl', ($scope) ->
  $scope.$watch '', ->
    $('body').scrollspy('refresh')

  $scope.arcs =
    arc1: { value: 60, text: '60%' }
    arc2: { value: 90, text: '90%' }

  $scope.stackedSum = (data) ->
    return unless data? and data.length isnt 0
    for value in data
      Number(value.savings) + Number(value.total) + Number(value.optimal)
