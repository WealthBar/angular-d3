angular.module('ad3').directive 'd3Bars', () ->
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
    chart = chartController.getChart()
    height = chartController.innerHeight()
    width = 20
    bars = chart.selectAll("rect.bar").data(scope.data)
    bars.exit().transition().duration(500)
      .attr("y", (d) -> height)
      .attr("height", 0)
      .remove()
    bars.transition().duration(500)
      .attr("x", (d) -> x(d[options.x]) - width/2)
      .attr("y", (d) -> y(d[options.y]))
      .attr("height", (d) -> height - y(d[options.y]))
      .attr("width", width)
    bars.enter()
      .append("rect")
      .attr("x", (d) -> x(d[options.x]) - width/2)
      .attr("width", width)
      .attr("y", height)
      .attr("height", 0)
      .transition().duration(500)
      .attr("y", (d) -> y(d[options.y]))
      .attr("height", (d) -> height - y(d[options.y]))
