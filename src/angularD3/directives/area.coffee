angular.module('ad3').directive 'd3Area', ->
  defaults = -> {}

  restrict: 'E'
  require: '^d3Chart'

  link: (scope, el, attrs, chartController) ->
    # todo: DRY this up in line, area and bar directives
    options = angular.extend(defaults(), attrs)
    x = chartController.getScale(options.xscale or options.x)
    y = chartController.getScale(options.yscale or options.y)

    if options.vertical
      area = d3.svg.area()
        .y((d) -> x(d.x))
        .x0(0)
        .x1((d) -> y(d.y))
      areaStacked = d3.svg.area()
        .y((d) -> x(d.x))
        .x0((d) -> y(d.y0))
        .x1((d) -> y(d.y + d.y0))
    else
      area = d3.svg.area()
        .x((d) -> x(d.x))
        .y0(chartController.innerHeight)
        .y1((d) -> y(d.y))
      areaStacked = d3.svg.area()
        .x((d) -> x(d.x))
        .y0((d) -> y(d.y0))
        .y1((d) -> y(d.y + d.y0))

    areaElement = null
    redraw = (data) ->
      areaElement ||= chartController.getChart().append("g")
        .attr("class", "area")
      return unless data? and data.length isnt 0
      columns = options.y if options.y?
      if options.columns?
        columns = scope.$eval(options.columns)
      return unless columns?
      if angular.isString columns
        columns = columns.split(',').map((c) -> c.trim())
      return if columns.length is 0

      mappedData = for name in columns
        name: name
        values: for value in data
          x: value[options.x]
          y: value[name]
      stack = d3.layout.stack().values((d) -> d.values)
      stack.offset(options.offset) if options.offset?
      stackedData = stack(mappedData)

      charts = areaElement.selectAll('path.area').data(stackedData)
      charts.enter().append("path")
      charts.attr("class", (d) -> "area #{d.name}")
        .transition()
        .duration(500)
        .attr("d", (d,i) -> if i is 0 then area(d.values) else areaStacked(d.values))
      charts.exit()
        .attr("d", (d,i) -> if i is 0 then area(d.values) else areaStacked(d.values))
        .remove()

    scope.$watch options.columns, chartController.redraw, true if options.columns?
    chartController.registerElement(redraw, options.order)
