angular.module('ad3').directive 'd3Data', () ->
  defaults = 
    src : "data/data.csv"

  restrict: 'E'

  link: (scope, el, attrs) ->

    d3.csv defaults.src, 
      (row)->
        datum = {}
        for name in attrs.columns.split(',')
          name = name.trim()
          datum[name] = row[name]
        datum
      (error, rows) -> 
        scope.data = rows
        scope.$digest()