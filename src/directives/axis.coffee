angular.module('ad3').directive 'axis', ->
  defaults =
    orientation: 'bottom'
    label: 'X-Axis'
    ticks: '5'
    format: null

  scope:
    values: '='

  restrict: 'E'

  require: '^chart'

  link: (scope, el, attrs, chartController) ->
    console.log(attrs)
    attrs = angular.extend(defaults, attrs)
    console.log(attrs)

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

    x = d3.scale.linear()
    x.range(range())
    x.domain d3.extent scope.values

    xAxis = d3.svg.axis().scale(x).orient(attrs.orientation)
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
