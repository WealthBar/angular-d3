angular.module('ad3').directive 'd3Data',['d3Service', (d3) ->
  restrict: 'E'
  scope: false
  link: (scope, el, attrs) ->
    src = attrs.src
    binding = attrs.data
    accessor = scope.$eval(attrs.accessor) if attrs.accessor
    callback = scope.$eval(attrs.callback) if attrs.callback
    d3.csv(src, accessor, callback).then (rows) ->
      scope[binding] = rows
    , -> throw('Error loading CSV via D3')
]
