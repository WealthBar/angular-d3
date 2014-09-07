angular.module('ad3').directive 'd3Gradient', ->
  defaults = { transition: 500 }

  restrict: 'E'
  require: '^d3Chart'

  link: ($scope, $el, $attrs, chartController) ->
    svg = chartController.getSvg()

    gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", $attrs.id)

    ['x1', 'x2', 'y1', 'y2'].forEach (attr) ->
      $attrs.$observe attr, (val) -> gradient.attr(attr, val)

    transition = defaults.transition
    $attrs.$observe 'transition', (val) -> transition = val if val?

    $scope.$watch $attrs.stops, (stops) ->
      return unless stops?
      stops = gradient.selectAll('stop').data(stops)
      stops.enter().append('stop')
      stops.transition().duration(transition)
        .attr('offset', (d) -> d.offset)
        .attr('stop-color', (d) -> d.color)
        .attr('stop-opacity', (d) -> if d.opacity? then d.opacity else 1)
      stops.exit().remove()
