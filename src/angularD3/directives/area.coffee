angular.module('ad3').directive 'd3Area', () ->
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
    areaStart = d3.svg.area()
      .x((d) -> x(d[options.x]))
      .y0(height)
      .y1(height)
    area = d3.svg.area()
      .x((d) -> x(d[options.x]))
      .y0(height)
      .y1((d) -> y(d[options.y]))
    chartController.getChart().append("path").attr("class", "area")
      .attr("style", "fill: #FF3030; stroke: #FF3030; opacity: 0.8")
      .datum(scope.data)
      .attr("d", areaStart)
      .transition()
      .duration(500)
      .attr("d", area)
