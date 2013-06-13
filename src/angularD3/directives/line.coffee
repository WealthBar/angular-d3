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

    lineStart = d3.svg.line()
      .x((d) -> x(d[options.x]))
      .y(height)

    line = d3.svg.line()
      .x((d) -> x(d[options.x]))
      .y((d) -> y(d[options.y]))

    draw = (data, old, scope) ->
      return unless data?
      chartController.getChart().append("path").attr("class", "line")
        .datum(data)
        .attr("d", lineStart)
        .transition()
        .duration(500)
        .attr("d", line)

    scope.$watch attrs.data, draw , true
