angular.module('ad3').directive 'bars', () ->
  scope:
    data: '='

  restrict: 'E'

  require: '^chart'

  link: (scope, el, attrs, chartController) ->
    console.log(chartController.getChart())

