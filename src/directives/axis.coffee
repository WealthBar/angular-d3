angular.module('ad3').directive 'axis', ->
  defaults =
    orientation: 'bottom'
    label: 'X-Axis'
    ticks: '5'
    format: null

  priority: 1

  scope:
    domain: '='

  restrict: 'E'

  require: '^chart'

  link: (scope, el, attrs, chartController) ->
    attrs = angular.extend(defaults, attrs)

    console.log(chartController.innerWidth())
    range = ->
      if attrs.orientation is 'top' or attrs.orientation is 'bottom'
        [0 ,chartController.innerWidth()]
      else
        [chartController.innerHeight(), 0]

    translation = ->
      if attrs.orientation is 'bottom'
        "translate(0, #{chartController.innerHeight()})"
      else if attrs.orientation is 'top'
        "translate(0, 0)"
      else if attrs.orientation is 'left'
        "translate(0, 0)"
      else if attrs.orientation is 'right'
        "translate(#{chartController.innerWidth()}, 0)"

    scale = d3.scale.linear()
    scale.range(range())
    scale.domain d3.extent scope.domain
    chartController.addScale(attrs.name, scale)

    xAxis = d3.svg.axis().scale(scale).orient(attrs.orientation)
      .ticks(attrs.ticks)

    if attrs.format
      format = d3.format(attrs.format)
      xAxis.tickFormat(format)

    # Append x-axis to chart
    axis = chartController.getChart().append("g")
      .attr("class", "#{attrs.orientation} axis")
      .attr("transform", translation())

    positionLabel = (label) ->
      if attrs.orientation is 'bottom'
        label
          .attr("x", "#{chartController.innerWidth() / 2}")
          .attr("dy", "2.5em").attr("style", "text-anchor: middle;")
      else if attrs.orientation is 'top'
        label.attr("x", "#{chartController.innerWidth() / 2}")
          .attr("dy", "-1.5em").attr("style", "text-anchor: middle;")
      else if attrs.orientation is 'left'
        label.attr("dy", "-2.5em")
          .attr("x", "-#{chartController.innerHeight() / 2}")
          .attr("style", "text-anchor: middle;")
          .attr("transform", "rotate(-90)")
      else if attrs.orientation is 'right'
        label.attr("dy", "-2.5em")
          .attr("x", "#{chartController.innerHeight() / 2}")
          .attr("style", "text-anchor: middle;")
          .attr("transform", "rotate(90)")

    label = axis.append("text").attr("class", "axis-label").text(attrs.label)
    positionLabel(label)

    axis.call(xAxis)
    axis.selectAll('line').attr("style", "fill: none; stroke-width: 2px; stroke: #303030;")
    axis.selectAll('path').attr("style", "fill: none; stroke-width: 2px; stroke: #303030;")
