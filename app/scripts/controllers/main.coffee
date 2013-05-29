angular.module('angularD3App').controller 'MainCtrl', ($scope) ->
  $scope.hello = "Hi there"
  $scope.xvalues = [0..5]
  $scope.yvalues = [0..10]
  $scope.y2values = [0..5]

  $scope.line = for value in [[0,1],[1,2],[3,1],[4,6],[5,0]]
    { age: value[0], savings: value[1] }

  $scope.area = [[0,0.5],[1,1],[3,2],[4,4],[5,8]]
  $scope.bar = [[1,3],[2,2],[3,1],[4,4]]
