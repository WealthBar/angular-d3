angular.module('ad3').provider 'd3Service', () ->
  defaults = @defaults = {}

  @$get = ['$cacheFactory', '$rootScope', ($cacheFactory, $rootScope) ->
    cache = defaults.cache or $cacheFactory('d3Service')

    csv: (src, columns) ->
      results = cache.get(src)
      return results if results
      cache.put(src, results = [])
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
      results
  ]

  @
