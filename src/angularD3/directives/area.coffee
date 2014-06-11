angular.module('ad3').directive 'd3Area', ->
  defaults = -> {}

  restrict: 'E'

  require: '^d3Chart'

  link: (scope, el, attrs, chartController) ->
    # todo: DRY this up in line, area and bar directives
    options = angular.extend(defaults(), attrs)
    x = chartController.getScale(options.xscale or options.x)
    y = chartController.getScale(options.yscale or options.y)
    height = chartController.innerHeight()

    if options.vertical
      area = d3.svg.area()
        .y((d) -> x(d[options.x]))
        .x0(0)
        .x1((d) -> y(d[options.y]))
      areaStacked = d3.svg.area()
        .y((d) -> x(d.x))
        .x0((d) -> y(d.y0))
        .x1((d) -> y(d.y + d.y0))
    else
      area = d3.svg.area()
        .x((d) -> x(d[options.x]))
        .y0(height)
        .y1((d) -> y(d[options.y]))
      areaStacked = d3.svg.area()
        .x((d) -> x(d.x))
        .y0((d) -> y(d.y0))
        .y1((d) -> y(d.y + d.y0))

    redraw = (data) ->
      return unless data? and data.length isnt 0
      columns = options.y if options.y?
      columns = scope.$eval(options.columns) if options.columns?
      return unless columns?
      if angular.isString columns
        columns = columns.split(',').map((c) -> c.trim())

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
            x: value[options.x]
            y: value[name]
        stack = d3.layout.stack().values((d) -> d.values)
        stack.offset(options.offset) if options.offset?
        stackedData = stack(temp)
        charts = chartController.getChart().selectAll('.area-stacked')
        if charts[0].length is 0
          charts = charts.data(stackedData)
            .enter()
            .append("path")
            .attr("class", (d) -> "area area-stacked #{d.name}")
        else
          charts = charts.data(stackedData)
        charts.transition()
          .duration(500)
          .attr("d", (d) -> areaStacked(d.values))

    scope.$watch options.columns, chartController.redraw(), true if options.columns?
    chartController.registerElement({ redraw: redraw })
