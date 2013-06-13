angular.module('ad3').directive 'd3Area', () ->
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

    areaStart = d3.svg.area()
      .x((d) -> x(d[options.x]))
      .y0(height)
      .y1(height)

    area = d3.svg.area()
      .x((d) -> x(d[options.x]))
      .y0(height)
      .y1((d) -> y(d[options.y]))

    draw = (data) ->
      return unless data?
      chartController.getChart().append("path").attr("class", "area")
        .datum(data)
        .attr("d", areaStart)
        .transition()
        .duration(500)
        .attr("d", area)

    scope.$watch attrs.data, draw, true
