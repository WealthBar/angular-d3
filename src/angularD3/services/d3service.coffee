angular.module('ad3').service 'd3Service', ['$rootScope', ($rootScope) ->
  dataCache = {}

  @csv = (src, columns) ->
    return dataCache[src] if dataCache[src]?
    results = dataCache[src] = []
    d3.csv src,
      (row)->
        datum = {}
        for name in columns
          name = name.trim()
          datum[name] = row[name]
        datum
      (error, rows) ->
        results.push.apply(results, rows)
        $rootScope.$apply()
    return results
]
