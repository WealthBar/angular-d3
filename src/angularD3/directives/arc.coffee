angular.module('ad3').directive 'd3Arc', () ->
  defaults = ->
    x: 0
    y: 1
    innerRadius: 0
    labelRadius: 0
    transition: "cubic-in-out"
    transitionDuration: 1000

  restrict: 'E'

  require: '^d3Chart'

  link: (scope, el, attrs, chartController) ->
    options = angular.extend(defaults(), attrs)

    chart = chartController.getChart()
    innerRadius = parseFloat(options.innerRadius)
    labelRadius = parseFloat(options.labelRadius)

    center = chartController.getChart().append("g").attr("class", "arc")

    redraw = (data) ->
      return unless data? and data.length isnt 0

      radius = Math.min(chartController.innerWidth(), chartController.innerHeight())/2

      center.attr("transform", "translate(" + radius  + "," + radius + ")")

      arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius * innerRadius)
        .startAngle(0)
        .endAngle( (d) -> d.value/100 * 2 * Math.PI )

      labelArc = d3.svg.arc()
        .outerRadius(radius * labelRadius)
        .innerRadius(radius * labelRadius)

      arcTween = (b) ->
        i = d3.interpolate({value: 0}, b)
        (t) -> arc(i(t))

      path = center.selectAll("path")
        .data([{"value":data[options.amount]}])

      path.enter().append("path")
        .transition()
          .ease(options.transition)
          .duration(options.transitionDuration)
          .attrTween("d", arcTween)

      path.enter().append("text")
        .attr("class", "arc-label")
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .text(data[options.label])

      path.transition()
        .ease(options.transition)
        .duration(options.transitionDuration)
        .attrTween("d", arcTween)

    chartController.registerElement({ redraw: redraw })
