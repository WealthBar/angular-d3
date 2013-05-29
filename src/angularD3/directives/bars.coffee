angular.module('ad3').directive 'd3Bars', () ->
  scope:
    data: '='

  restrict: 'E'

  require: '^d3Chart'

  link: (scope, el, attrs, chartController) ->
    x = chartController.getScale(attrs.xscale)
    y = chartController.getScale(attrs.yscale)
    chart = chartController.getChart()
    height = chartController.innerHeight()
    width = 20
    bars = chart.selectAll("rect.bar").data(scope.data)
    bars.exit().transition().duration(500)
      .attr("y", (d) -> height)
      .attr("height", 0)
      .remove()
    bars.transition().duration(500)
      .attr("x", (d) -> x(d[0]) - width/2)
      .attr("y", (d) -> y(d[1]))
      .attr("height", (d) -> height - y(d[1]))
      .attr("width", width)
    bars.enter()
      .append("rect")
      .attr("x", (d) -> x(d[0]) - width/2)
      .attr("width", width)
      .attr("y", height)
      .attr("height", 0)
      .transition().duration(500)
      .attr("y", (d) -> y(d[1]))
      .attr("height", (d) -> height - y(d[1]))
