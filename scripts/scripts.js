//@ sourceMappingURL=app.map
(function() {
  angular.module('angularD3App', ['ad3']);

}).call(this);

//@ sourceMappingURL=main.map
(function() {
  angular.module('angularD3App').controller('MainCtrl', function($scope, $interval) {
    $scope.$watch('', function() {
      return $('body').scrollspy('refresh');
    });
    $scope.arcs = {
      arc1: {
        value: 60,
        label: '60%'
      },
      arc2: {
        value: 90,
        label: '90%'
      }
    };
    $interval(function() {
      var val;
      val = Math.random() * 100;
      $scope.arcs.arc1.value = val;
      return $scope.arcs.arc1.label = "" + (val.toFixed(0)) + "%";
    }, 1000 * 2);
    $interval(function() {
      var val;
      val = Math.random() * 100;
      $scope.arcs.arc2.value = val;
      return $scope.arcs.arc2.label = "" + (val.toFixed(0)) + "%";
    }, 1000 * 2.5);
    $scope.stackedSum = function(data) {
      var value, _i, _len, _results;
      if (!((data != null) && data.length !== 0)) {
        return;
      }
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        value = data[_i];
        _results.push(Number(value.savings) + Number(value.total) + Number(value.optimal));
      }
      return _results;
    };
    $scope.parseValues = function(row) {
      var k, v;
      for (k in row) {
        v = row[k];
        if (k === 'date') {
          row[k] = new Date(v);
        } else if (!isNaN(parseFloat(v)) && isFinite(v)) {
          row[k] = +v;
        }
      }
      return row;
    };
    return $scope.log = function(data) {
      return console.log(data);
    };
  });

}).call(this);

//@ sourceMappingURL=list-group.map
(function() {


}).call(this);
