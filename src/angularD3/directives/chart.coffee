angular.module('ad3').directive 'd3Chart', ->
  restrict: 'EA'
  scope: true

  controller: ['$scope', '$element', '$attrs', '$window', '$timeout',
  ($scope, $el, $attrs, $window, $timeout) ->
    scales = $scope.scales = {}
    elements = $scope.elements = []
    binding = $scope.binding = $attrs.data

    @margin = $scope.$eval($attrs.margin) or { top: 10, right: 10, bottom: 10, left: 10 }
    svg = d3.select($el[0]).append('svg').attr('class', "d3")
      .attr("width", "100%")
      .attr("height", "100%")

    # Used to calculated widths based on SVG margins
    width = -> $el[0].offsetWidth
    height = -> $el[0].offsetHeight

    chart = svg.append("g")
      .attr("transform", "translate(" + @margin.left + "," + @margin.top + ")")

    @getSvg = -> svg
    @getChart = -> chart
    @addScale = (name, scale, update) -> scales[name] = { scale: scale, update: update }
    @getScale = (name) -> scales[name].scale
    @registerElement = (el, order = 0) -> elements.push { redraw: el, order: Number(order) }

    updateSize = =>
      if @width != width() or @height != height()
        @width = width()
        @height = height()
        @innerWidth = @width - @margin.left - @margin.right
        @innerHeight = @height - @margin.top - @margin.bottom
        # Redraw if the chart size has changed
        @redraw()

    sortOrder = (a, b) -> a.order - b.order
    debounce = null
    @redraw = =>
      # We don't bother to redraw if the chart isn't visible
      return if debounce or @width is 0 or @height is 0
      debounce = $timeout =>
        debounce = null
        data = $scope.$eval(binding)
        for name, scale of scales
          scale.update(data)
        for element in elements.sort(sortOrder)
          element.redraw(data)
      , $attrs.updateInterval or 200

    $window.addEventListener 'resize', updateSize

    if $attrs.watch is 'deep'
      $scope.$watch binding, @redraw, true
    else
      $scope.$watch binding, @redraw

    # We check the size on all scope events since scope can affect chart
    # visibility and if the chart area is resized while not visible it won't
    # update.
    $scope.$watch updateSize

    updateSize()
    return
  ]
