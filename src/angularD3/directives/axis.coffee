angular.module('ad3').directive 'd3Axis', ->
  defaults = ->
    orientation: 'bottom'
    label: 'axis'
    ticks: '5'
    format: null

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
    scale.range(range())
    chartController.addScale(options.name, scale)

    update = (data) ->
      return unless data?
      domainValues = (new Number(datum[options.name]) for datum in data)
      scale.domain d3.extent domainValues
      console.log(domainValues)
      axis.call(xAxis)
      axis.selectAll('line').attr("style", "fill: none; stroke-width: 2px; stroke: #303030;")
      axis.selectAll('path').attr("style", "fill: none; stroke-width: 2px; stroke: #303030;")

    scope.$watch options.data, update, true

    xAxis = d3.svg.axis().scale(scale).orient(options.orientation)
      .ticks(options.ticks)

    if options.format
      format = d3.format(options.format)
      xAxis.tickFormat(format)

    # Append x-axis to chart
    axis = chartController.getChart().append("g")
      .attr("class", "#{options.orientation} axis")
      .attr("transform", translation())

    positionLabel = (label) ->
      if options.orientation is 'bottom'
        label
          .attr("x", "#{chartController.innerWidth() / 2}")
          .attr("dy", "2.5em").attr("style", "text-anchor: middle;")
      else if options.orientation is 'top'
        label.attr("x", "#{chartController.innerWidth() / 2}")
          .attr("dy", "-1.5em").attr("style", "text-anchor: middle;")
      else if options.orientation is 'left'
        label.attr("dy", "-2.5em")
          .attr("x", "-#{chartController.innerHeight() / 2}")
          .attr("style", "text-anchor: middle;")
          .attr("transform", "rotate(-90)")
      else if options.orientation is 'right'
        label.attr("dy", "-2.5em")
          .attr("x", "#{chartController.innerHeight() / 2}")
          .attr("style", "text-anchor: middle;")
          .attr("transform", "rotate(90)")

    label = axis.append("text").attr("class", "axis-label").text(options.label)
    positionLabel(label)
