angular.module('ad3').directive 'd3Data', () ->
  restrict: 'E'

  controller: ['$scope', '$attrs', 'd3Service', (scope, attrs, d3) ->
    src = attrs.src
    binding = attrs.data
    scope[binding] = d3.csv(src, attrs.columns.split(','))
  ]
