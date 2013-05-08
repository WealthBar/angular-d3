angular.module('ad3').directive 'line', ->
  scope:
    data: '='

  restrict: 'E'

  require: '^chart'

  link: (scope, el, attrs, chartController) ->
    x = chartController.getScale(attrs.xscale)
    y = chartController.getScale(attrs.yscale)
    height = chartController.innerHeight()
    lineStart = d3.svg.line()
      .x((d) -> x(d[0]))
      .y(height)
    line = d3.svg.line()
      .x((d) -> x(d[0]))
      .y((d) -> y(d[1]))
    chartController.getChart().append("path").attr("class", "line")
      .attr("style", "fill: none; stroke-width: 2px; stroke: #3030FF")
      .datum(scope.data)
      .attr("d", lineStart)
      .transition()
      .duration(500)
      .attr("d", line)
