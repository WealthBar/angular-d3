//@ sourceMappingURL=app.map
(function() {
  angular.module('angularD3App', ['ad3']);

}).call(this);

//@ sourceMappingURL=main.map
(function() {
  angular.module('angularD3App').controller('MainCtrl', function($scope) {
    return $scope.$watch('', function() {
      return $('body').scrollspy('refresh');
    });
  });

}).call(this);

//@ sourceMappingURL=list-group.map
(function() {


}).call(this);
