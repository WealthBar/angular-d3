angular.module('ad3').directive 'd3Data', () ->

  restrict: 'E'

  link: (scope, el, attrs) ->

    src = attrs.src
    d3.csv src, 
      (row)->
        datum = {}
        for name in attrs.columns.split(',')
          name = name.trim()
          datum[name] = row[name]
        datum
        console.log datum
      (error, rows) -> 
        scope.data = rows
        scope.$digest()