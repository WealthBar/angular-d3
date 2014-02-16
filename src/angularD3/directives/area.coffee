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

    areaStacked = d3.svg.area()
      .x((d) -> x(d.x))
      .y0((d) -> y(d.y0))
      .y1((d) -> y(d.y + d.y0))

    draw = (data) ->
      return unless data? and data.length isnt 0
      columns = options.y.split(',')
      if columns.length is 1
        chartController.getChart().append("path").attr("class", "area").datum(data)
          .attr("d", areaStart)
          .transition()
          .duration(500)
          .attr("d", area)
      else
        temp = for name in columns
          name: name
          values: for value in data
            x: Number(value[options.x])
            y: Number(value[name.trim()])
        stack = d3.layout.stack().values((d) -> d.values)
        stack.offset(options.offset) if options.offset?
        stackedData = stack(temp)
        chartController.getChart().selectAll('.area-stacked').data(stackedData)
          .enter().append("path").attr("class", (d) -> "area area-stacked #{d.name}")
          .attr("d", (d) -> areaStacked(d.values))

    scope.$watch attrs.data, draw, true
