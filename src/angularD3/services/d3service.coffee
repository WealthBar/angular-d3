angular.module('ad3').provider 'd3Service', () ->
  defaults = @defaults = {}

  @$get = ['$cacheFactory', '$rootScope', '$q', ($cacheFactory, $rootScope, $q) ->
    cache = defaults.cache or $cacheFactory('d3Service')

    csv: (src, accessor, callback) ->
      deferred = $q.defer()
      cached = cache.get(src)
      if cached
        callback(rows) if callback
        deferred.resolve(cached)
      d3.csv src, accessor, (rows) ->
        $rootScope.$apply ->
          callback(rows) if callback
          if rows
            cache.put(src, rows)
            deferred.resolve(rows)
          else
            deferred.reject()
      return deferred.promise
  ]

  @
