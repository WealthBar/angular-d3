angular.module('d3').directive 'chart', () ->

  controller: ['$scope', '$element', ($s, $el) ->
    $s.test = 'pass'
  ]
