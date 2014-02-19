angular.module('ad3').directive 'd3Line', ->
  defaults = ->
    x: 0
    y: 1

  restrict: 'E'

  require: '^d3Chart'

  link: (scope, el, attrs, chartController) ->
    # todo: DRY this up in line, area and bar directives
    options = angular.extend(defaults(), attrs)
    x = chartController.getScale(options.xscale or options.x)
    y = chartController.getScale(options.yscale or options.y)
    height = chartController.innerHeight()

    line = d3.svg.line()
      .x((d) -> x(d[options.x]))
      .y((d) -> y(d[options.y]))

    linePath = chartController.getChart().append("path").attr("class", "line")

    redraw = ->
      data = scope.$eval(attrs.data)
      return unless data? and data.length isnt 0
      linePath.datum(data)
        .transition()
        .duration(500)
        .attr("d", line)

    scope.$watch attrs.data, redraw , true
    chartController.registerElement({ redraw: redraw })
