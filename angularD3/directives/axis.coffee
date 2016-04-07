angular.module('ad3').directive 'd3Axis', ['d3locale', (d3locale) ->
  defaults = ->
    orientation: 'bottom'
    ticks: '5'
    extent: false

  priority: 1
  restrict: 'E'
  require: '^d3Chart'
  scope:
    customTimeFormat: '='
    filter: '='
    tickValues: '='

  link: ($scope, $el, $attrs, chartController) ->
    options = angular.extend(defaults(), $attrs)

    range = ->
      if options.orientation is 'top' or options.orientation is 'bottom'
        if options.reverse?
          [chartController.innerWidth, 0]
        else
          [0 ,chartController.innerWidth]
      else
        if options.reverse?
          [0, chartController.innerHeight]
        else
          [chartController.innerHeight, 0]

    translation = ->
      if options.orientation is 'bottom'
        "translate(0, #{chartController.innerHeight})"
      else if options.orientation is 'top'
        "translate(0, 0)"
      else if options.orientation is 'left'
        "translate(0, 0)"
      else if options.orientation is 'right'
        "translate(#{chartController.innerWidth}, 0)"

    if options.scale is 'time'
      scale = d3.time.scale()
    else if options.scale
      scale = d3.scale[options.scale]()
    else
      scale = d3.scale.linear()

    getAxis = ->
      axis = d3.svg.axis().scale(scale).orient(options.orientation)
      if options.ticks
        axis.ticks(options.ticks)
      if options.timeScale
        axis.ticks(d3.time[options.timeScale], options.timeInterval)
      if $scope.tickValues
        axis.tickValues($scope.tickValues)
      if options.tickSize
        tickSize = options.tickSize.split(',')
        axis.innerTickSize(tickSize[0])
        axis.outerTickSize(tickSize[1])
      if $scope.customTimeFormat?
        # We copy this because D3 is bad and mutates the time format.
        # See: https://github.com/mbostock/d3/issues/1769
        format = d3.time.format.multi(angular.copy($scope.customTimeFormat))
        axis.tickFormat((value) -> format(new Date(value)))
      if options.timeFormat?
        format = d3.time.format(options.timeFormat)
        axis.tickFormat((value) -> format(new Date(value)))
      else if options.format?
        format = d3.format(options.format)
        axis.tickFormat(format)
      axis

    positionLabel = (label) ->
      if options.orientation is 'bottom'
        label.attr("x", "#{chartController.innerWidth / 2}")
          .attr("dy", "#{chartController.margin.bottom}")
          .attr("style", "text-anchor: middle;")
      else if options.orientation is 'top'
        label.attr("x", "#{chartController.innerWidth / 2}")
          .attr("dy", "#{-chartController.margin.top}")
          .attr("style", "text-anchor: middle;")
      else if options.orientation is 'left'
        label.attr("x", "-#{chartController.innerHeight / 2}")
          .attr("dy", "#{-chartController.margin.left + 18}")
          .attr("style", "text-anchor: middle;")
          .attr("transform", "rotate(-90)")
      else if options.orientation is 'right'
        label.attr("x", "#{chartController.innerHeight / 2}")
          .attr("dy", "#{-chartController.margin.right + 18}")
          .attr("style", "text-anchor: middle;")
          .attr("transform", "rotate(90)")

    drawGrid = (grid, axis) ->
      if options.orientation is 'bottom'
        grid.call(axis.tickSize(chartController.innerHeight, 0, 0)
          .tickFormat('')
        )
      else if options.orientation is 'top'
        grid.attr("transform", "translate(0, #{chartController.innerHeight})")
          .call(axis.tickSize(chartController.innerHeight, 0, 0)
          .tickFormat('')
        )
      else if options.orientation is 'left'
        grid.attr("transform", "translate(#{chartController.innerWidth}, 0)")
          .call(axis.tickSize(chartController.innerWidth, 0, 0)
          .tickFormat('')
        )
      else if options.orientation is 'right'
        grid.call(axis.tickSize(chartController.innerWidth, 0, 0)
          .tickFormat('')
        )

    adjustTickLabels = (g) ->
      tickLabels = g.selectAll('.tick text')
      if options.tickDy
        tickLabels.attr('dy', options.tickDy)
      if options.tickDx
        tickLabels.attr('dx', options.tickDx)
      if options.tickAnchor
        tickLabels.style('text-anchor', options.tickAnchor)
      lastTickLabels = d3.select(tickLabels[0].slice(-1)[0])
      if options.lastTickDy
        lastTickLabels.attr('dy', options.lastTickDy)
      if options.lastTickDx
        lastTickLabels.attr('dx', options.lastTickDx)
      if options.lastTickAnchor
        lastTickLabels.style('text-anchor', options.lastTickAnchor)
      firstTickLabels = d3.select(tickLabels[0][0])
      if options.firstTickDy
        firstTickLabels.attr('dy', options.firstTickDy)
      if options.firstTickDx
        firstTickLabels.attr('dx', options.firstTickDx)
      if options.listTickAnchor
        firstTickLabels.style('text-anchor', options.firstTickAnchor)

    axisElement = null
    grid = null
    label = null

    redraw = (data) ->
      return unless data? and data.length isnt 0
      # Append x-axis to chart
      axisElement ||= chartController.getChart().append("g")
        .attr("class", "axis axis-#{options.orientation} axis-#{options.name}")
        .attr("transform", translation())
      if options.label
        label ||= axisElement.append("text").attr("class", "axis-label").text(options.label)
      if options.grid
        grid ||= chartController.getChart().append("g")
          .attr("class", "axis-grid axis-grid-#{options.name}")

      axis = getAxis()
      positionLabel(label.transition().duration(500)) if label
      axisElement.transition().duration(500)
        .attr("transform", translation())
        .call(axis)
        .selectAll('tick text')
          .tween("attr.dx", null)
          .tween("attr.dy", null)
          .tween("style.text-anchor", null)

      drawGrid(grid.transition().duration(500), axis) if grid?
      tickLabels = axisElement.selectAll('.tick text')
      axisElement.call(adjustTickLabels)

    updateScale = (data) ->
      return unless data? and data.length isnt 0
      scale.range(range())
      if options.domain
        data
      if $scope.filter
        domainValues = $scope.filter(data)
      else
        domainValues = (datum[options.name] for datum in data)
      if options.extent
        scale.domain d3.extent domainValues
      else
        scale.domain [0, d3.max domainValues]

    chartController.addScale(options.name, scale, updateScale)
    chartController.registerElement(redraw, options.order)
    $scope.$watchCollection 'tickValues', chartController.redraw
    $scope.$watchCollection 'customTimeFormat', chartController.redraw
    $scope.$watch 'filter', chartController.redraw
    $scope.$watch 'tickValues', chartController.redraw
]
