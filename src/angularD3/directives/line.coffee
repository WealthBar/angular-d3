angular.module('ad3').directive 'd3Line', ->
  defaults = ->
    x: 0
    y: 1

  restrict: 'E'

  require: '^d3Chart'

  link: (scope, el, attrs, chartController) ->
    options = angular.extend(defaults(), attrs)
    x = chartController.getScale(options.xscale or options.x)
    y = chartController.getScale(options.yscale or options.y)

    line = d3.svg.line()
      .x((d) -> x(d[options.x]))
      .y((d) -> y(d[options.y]))

    linePath = null
    redraw = (data) ->
      linePath ||= chartController.getChart().append("path")
        .attr("class", "line line-#{options.name or options.y}")
        .style("fill", "none")
        .style("stroke", options.stroke)

      return unless data? and data.length isnt 0
      linePath.datum(data)
        .transition()
        .duration(500)
        .attr("d", line)

    chartController.registerElement(redraw, options.order)
