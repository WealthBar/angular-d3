angular.module('ad3').directive 'd3Axis', ->
  defaults = ->
    orientation: 'bottom'
    label: 'axis'
    ticks: '5'
    format: null
    extent: false

  priority: 1

  restrict: 'E'

  require: '^d3Chart'

  link: (scope, el, attrs, chartController) ->
    options = angular.extend(defaults(), attrs)

    range = ->
      if options.orientation is 'top' or options.orientation is 'bottom'
        [0 ,chartController.innerWidth()]
      else
        [chartController.innerHeight(), 0]

    translation = ->
      if options.orientation is 'bottom'
        "translate(0, #{chartController.innerHeight()})"
      else if options.orientation is 'top'
        "translate(0, 0)"
      else if options.orientation is 'left'
        "translate(0, 0)"
      else if options.orientation is 'right'
        "translate(#{chartController.innerWidth()}, 0)"

    scale = d3.scale.linear()

    axis = d3.svg.axis().scale(scale).orient(options.orientation)
      .ticks(options.ticks)

    if options.format
      format = d3.format(options.format)
      axis.tickFormat(format)

    positionLabel = (label) ->
      if options.orientation is 'bottom'
        label.attr("x", "#{chartController.innerWidth() / 2}")
          .attr("dy", "#{chartController.margin.bottom}")
          .attr("style", "text-anchor: middle;")
      else if options.orientation is 'top'
        label.attr("x", "#{chartController.innerWidth() / 2}")
          .attr("dy", "#{-chartController.margin.top}")
          .attr("style", "text-anchor: middle;")
      else if options.orientation is 'left'
        label.attr("x", "-#{chartController.innerHeight() / 2}")
          .attr("y", "#{-chartController.margin.left + 18}")
          .attr("style", "text-anchor: middle;")
          .attr("transform", "rotate(-90)")
      else if options.orientation is 'right'
        label.attr("x", "#{chartController.innerHeight() / 2}")
          .attr("dy", "#{-chartController.margin.right + 18}")
          .attr("style", "text-anchor: middle;")
          .attr("transform", "rotate(90)")

    # Append x-axis to chart
    axisElement = chartController.getChart().append("g")
      .attr("class", "axis axis-#{options.orientation} axis-#{options.name}")
      .attr("transform", translation())

    label = axisElement.append("text").attr("class", "axis-label").text(options.label)

    redraw = ->
      data = scope.$eval(attrs.data)
      return unless data? and data.length isnt 0
      scale.range(range())
      positionLabel(label.transition().duration(500))
      domainValues = (new Number(datum[options.name]) for datum in data)
      if options.extent
        scale.domain d3.extent domainValues
      else
        scale.domain [0, d3.max domainValues]
      axisElement.transition().duration(500)
        .attr("transform", translation())
        .call(axis)
      axisElement.selectAll('line').attr("style", "fill: none; stroke-width: 2px; stroke: #303030;")
      axisElement.selectAll('path').attr("style", "fill: none; stroke-width: 2px; stroke: #303030;")

    scope.$watch attrs.data, redraw, true
    chartController.addScale(options.name, { scale: scale, redraw: redraw })
