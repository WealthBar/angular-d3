angular.module('angularD3App').controller 'MainCtrl', ($scope, $interval) ->
  $scope.$watch '', ->
    $('body').scrollspy('refresh')

  $scope.arcs =
    arc1: { value: 60, label: '60%' }
    arc2: { value: 90, label: '90%' }

  $interval ->
    val = Math.random() * 100
    $scope.arcs.arc1.value = val
    $scope.arcs.arc1.label = "#{val.toFixed(0)}%"
  , 1000 * 2

  $interval ->
    val = Math.random() * 100
    $scope.arcs.arc2.value = val
    $scope.arcs.arc2.label = "#{val.toFixed(0)}%"
  , 1000 * 2.5


  $scope.stackedSum = (data) ->
    return unless data? and data.length isnt 0
    for value in data
      Number(value.savings) + Number(value.total) + Number(value.optimal)

  $scope.parseValues = (row) ->
    for k, v of row
      # http://stackoverflow.com/a/1830844/235243
      if !isNaN(parseFloat(v)) && isFinite(v)
        row[k] = +v
    row

  $scope.log = (data) ->
    console.log(data)
