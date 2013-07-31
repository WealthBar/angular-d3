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
    height = chartController.innerHeight()
    width = chartController.innerWidth()
    innerRadius = parseFloat(options.innerRadius)
    labelRadius = parseFloat(options.labelRadius)

    radius = Math.min(width,height) / 2

    arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(radius * innerRadius)
      .startAngle(0)
      .endAngle( (d) -> d.value/100 * 2 * Math.PI )

    labelArc = d3.svg.arc()
      .outerRadius(radius * labelRadius)
      .innerRadius(radius * labelRadius)

    width = chartController.innerWidth()
    height = chartController.innerHeight()

    center = chartController.getChart()
      .append("svg:g")
      .attr("transform", "translate(" + width / 2  + "," + height / 2 + ")")

    arcTween = (b) ->
      i = d3.interpolate({value: 0}, b)
      (t) ->
         arc(i(t))

    draw = (data, old, scope) ->
      return unless data?

      path = center.selectAll("path")
        .data([{"value":data[options.amount]}])

      path.enter().append("path")
        .attr("class", "arc")
        .transition()
          .ease(options.transition)
          .duration(options.transitionDuration)
          .attrTween("d", arcTween)

      path.transition()
        .ease(options.transition)
        .duration(options.transitionDuration)
        .attrTween("d", arcTween)

      path.enter().append("text")
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .text(data[options.label])


    scope.$watch attrs.data, draw , true
