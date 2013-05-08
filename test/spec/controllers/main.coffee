describe 'Controller: MainCtrl', ->
  beforeEach =>
    module 'angularD3App'
    inject ($controller, $rootScope) =>
      @scope = $rootScope.$new()
      @controller = $controller 'MainCtrl',
        $scope: @scope

  it 'should attach a list xvalues to the scope', () =>
    expect(@scope.xvalues.length).toBe(6);
