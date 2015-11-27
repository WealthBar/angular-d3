angular.module('ad3').directive 'd3Data',['d3Service', (d3) ->
  restrict: 'E'
  scope:
    accessor: '='
    callback: '='
    data: '='
  link: ($scope, $el, $attrs) ->
    src = $attrs.src
    d3.csv(src, $scope.accessor, $scope.callback).then (rows) ->
      $scope.data = rows
    , -> throw('Error loading CSV via D3')
]
