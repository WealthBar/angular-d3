angular.module('angularD3App').controller('MainCtrl', ($scope) ->
  $scope.xvalues = [0..5]
  $scope.yvalues = [0..7]
  $scope.data = [[0,1],[1,2],[3,1],[4,6],[5,0]]
)
