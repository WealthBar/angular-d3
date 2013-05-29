angular.module('ad3').directive 'd3Line', ->
  defaults = ->
    x: 0
    y: 1

  scope:
    data: '='

  restrict: 'E'

  require: '^d3Chart'

  link: (scope, el, attrs, chartController) ->
    options = angular.extend(defaults(), attrs)
    x = chartController.getScale(options.xscale)
    y = chartController.getScale(options.yscale)
    height = chartController.innerHeight()
    lineStart = d3.svg.line()
      .x((d) -> x(d[options.x]))
      .y(height)
    line = d3.svg.line()
      .x((d) -> x(d[options.x]))
      .y((d) -> y(d[options.y]))
    graph = chartController.getChart().append("path").attr("class", "line")
      .attr("style", "fill: none; stroke-width: 2px; stroke: #3030FF")
      .datum(scope.data)
      .attr("d", lineStart)
      .transition()
      .duration(500)
      .attr("d", line)
