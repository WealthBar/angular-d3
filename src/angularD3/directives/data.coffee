angular.module('ad3').directive 'd3Data', () ->
  restrict: 'E'

  controller: ['$scope', '$attrs', (scope, attrs) ->
    src = attrs.src
    binding = attrs.data
    d3.csv src,
      (row)->
        datum = {}
        for name in attrs.columns.split(',')
          name = name.trim()
          datum[name] = row[name]
        datum
      (error, rows) ->
        scope[binding] = rows
        scope.$digest()
  ]
