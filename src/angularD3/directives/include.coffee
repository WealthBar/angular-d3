# d3-include
#
# Allows arbitrary SVG content to be injected into the chart
#
# Todo: Consider making this work more like ng-include and allowing it to fetch
# the SVG content from view templates.

angular.module('ad3').directive 'd3Include', ->
  restrict: 'E'
  require: '^d3Chart'
  link: ($scope, $el, $attrs, chartController) ->
    chart = chartController.getChart()
    includes = chart.append('g').attr('class', 'includes')
    includes.html($el.html())
