//@ sourceMappingURL=app.map
(function() {
  angular.module('angularD3App', ['ad3']);

}).call(this);

//@ sourceMappingURL=main.map
(function() {
  angular.module('angularD3App').controller('MainCtrl', function($scope) {
    console.log('laoded');
    $scope.$watch('', function() {
      return $('body').scrollspy('refresh');
    });
    return $scope.stackedSum = function() {
      var value, _i, _len, _ref, _results;
      if (!(($scope.line != null) && $scope.line.length !== 0)) {
        return;
      }
      _ref = $scope.line;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        value = _ref[_i];
        _results.push({
          total: Number(value.savings) + Number(value.total) + Number(value.optimal)
        });
      }
      return _results;
    };
  });

}).call(this);

//@ sourceMappingURL=list-group.map
(function() {


}).call(this);
