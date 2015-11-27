d3 = require('d3')

angular.module('ad3').directive 'd3Arc', ->
  defaults = ->
    x: 0
    y: 1
    innerRadius: 0
    labelRadius: 0
    transition: "cubic-in-out"
    transitionDuration: 1000
    value: 'value'
    label: 'label'

  restrict: 'E'

  require: '^d3Chart'

  link: (scope, el, attrs, chartController) ->
    options = angular.extend(defaults(), attrs)

    chart = chartController.getChart()
    innerRadius = parseFloat(options.innerRadius)
    labelRadius = parseFloat(options.labelRadius)

    center = null
    arcPath = null
    arcLabel = null
    redraw = (data) ->
      center ||= chartController.getChart().append("g").attr("class", "arc")
      arcPath ||= center.append("path")
      arcLabel ||= center.append("text")
        .attr("class", "arc-label")
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")

      return unless data? and data.length isnt 0

      radius = Math.min(chartController.innerWidth, chartController.innerHeight)/2

      center.attr("transform", "translate(" + radius  + "," + radius + ")")

      arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius * innerRadius)
        .startAngle(0)
        .endAngle((d) -> d/100 * 2 * Math.PI)

      arcTween = (d) ->
        @_current ?= 0
        i = d3.interpolate(@_current, d)
        @_current = d
        (t) -> arc(i(t))

      labelArc = d3.svg.arc()
        .outerRadius(radius * labelRadius)
        .innerRadius(radius * labelRadius)

      arcPath.datum(data[options.value])
        .transition()
        .ease(options.transition)
        .duration(options.transitionDuration)
        .attrTween("d", arcTween)

      arcLabel.text(data[options.label])

    chartController.registerElement(redraw, options.order)
