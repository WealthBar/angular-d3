angular.module('ad3').directive 'area', ->
  scope:
    data: '='

  restrict: 'E'

  require: '^chart'

  link: (scope, el, attrs, chartController) ->
    x = chartController.getScale(attrs.xscale)
    y = chartController.getScale(attrs.yscale)
    height = chartController.innerHeight()
    areaStart = d3.svg.area()
      .x((d) -> x(d[0]))
      .y0(height)
      .y1(height)
    area = d3.svg.area()
      .x((d) -> x(d[0]))
      .y0(height)
      .y1((d) -> y(d[1]))
    chartController.getChart().append("path").attr("class", "area")
      .attr("style", "fill: #FF3030; stroke: #FF3030; opacity: 0.8")
      .datum(scope.data)
      .attr("d", areaStart)
      .transition()
      .duration(500)
      .attr("d", area)
