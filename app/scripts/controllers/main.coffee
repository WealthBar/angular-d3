angular.module('angularD3App').controller 'MainCtrl', ($scope, $interval) ->
  $scope.$watch '', ->
    $('body').scrollspy('refresh')

  $scope.arcs =
    arc1: { value: 60, label: '60%' }
    arc2: { value: 90, label: '90%' }

  $interval ->
    val = Math.random() * 100
    $scope.arcs.arc1 = { value: val, label: "#{val.toFixed(0)}%" }
  , 1000 * 5

  $interval ->
    val = Math.random() * 100
    $scope.arcs.arc2 = { value: val, label: "#{val.toFixed(0)}%" }
  , 1000 * 5

  $interval ->
    if $scope.columns.length == 3
      $scope.columns = ['savings', 'optimal']
    else
      $scope.columns = ['savings', 'total', 'optimal']
  , 1000 * 10

  $scope.stackDomain = (data) ->
    values = for value in data
      Number(value.savings) + Number(value.total) + Number(value.optimal)

  $scope.parseValues = (row) ->
    for k, v of row
      # http://stackoverflow.com/a/1830844/235243
      if k is 'date'
        row[k] = new Date(v.trim())
      else if !isNaN(parseFloat(v)) && isFinite(v)
        row[k] = +v
    row

  $scope.log = (data) ->
    console.log(data)

  $scope.columns = ['savings', 'total', 'optimal']

  $scope.tickValues = [200, 400, 600, 800]

  $scope.gradient = [
    { offset: '0%', color: '#098aae', opacity: 0.6 },
    { offset: '100%', color: '#684684', opacity: 0.9 }
  ]
