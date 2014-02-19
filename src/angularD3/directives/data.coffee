angular.module('ad3').directive 'd3Data',['d3Service', (d3) ->
  restrict: 'E'
  scope: false
  link: (scope, el, attrs) ->
    src = attrs.src
    binding = attrs.data
    scope[binding] = d3.csv(src, attrs.columns.split(','))
]
