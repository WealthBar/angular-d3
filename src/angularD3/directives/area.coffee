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
    columns = options.y.split(',').map((c) -> c.trim())

    areaStart = d3.svg.area()
      .x((d) -> x(d[options.x]))
      .y0(height)
      .y1(height)

    area = d3.svg.area()
      .x((d) -> x(d[options.x]))
      .y0(height)
      .y1((d) -> y(d[options.y]))

    areaStackedStart = d3.svg.area()
      .x((d) -> x(d.x))
      .y0((d) -> y(d.y0))
      .y1((d) -> y(d.y0))

    areaStacked = d3.svg.area()
      .x((d) -> x(d.x))
      .y0((d) -> y(d.y0))
      .y1((d) -> y(d.y + d.y0))

    redraw = ->
      data = scope.$eval(attrs.data)
      return unless data? and data.length isnt 0
      if columns.length is 1
        chart = chartController.getChart().select("path.area")
        unless chart[0][0]
          chart = chartController.getChart().append("path").attr("class", "area")
        chart.datum(data)
          .transition()
          .duration(500)
          .attr("d", area)
      else
        temp = for name in columns
          name: name
          values: for value in data
            x: Number(value[options.x])
            y: Number(value[name])
        stack = d3.layout.stack().values((d) -> d.values)
        stack.offset(options.offset) if options.offset?
        stackedData = stack(temp)
        charts = chartController.getChart().selectAll('.area-stacked')
        if charts[0].length is 0
          charts = charts.data(stackedData).enter().append("path").attr("class", (d) -> "area area-stacked #{d.name}")
        else
          charts = charts.data(stackedData)
        charts.transition()
          .duration(500)
          .attr("d", (d) -> areaStacked(d.values))

    scope.$watch attrs.data, redraw, true
    chartController.registerElement({ redraw: redraw })
