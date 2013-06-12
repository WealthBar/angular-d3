angular.module('ad3').directive 'd3Pie', () ->
  defaults = ->
    x: 0
    y: 1
    innerRadius: 0
    labelRadius: 0.7

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

    labelArc = d3.svg.arc()
      .outerRadius(radius * labelRadius)
      .innerRadius(radius * labelRadius)

    pie = d3.layout.pie().sort(null)
      .value((d) ->
        d[options.amount])

    width = chartController.innerWidth()
    height = chartController.innerHeight()

    center = chartController.getChart()
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    draw = (data, old, scope) ->
      return unless data?

      reversedDataMap = {}
      for datum in data
        do (datum) ->
          reversedDataMap[datum[options.amount]] = datum[options.value]

      g = center.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", (d,i) ->  "arc arc-#{i}")

      g.append("path")
        .attr("d", arc)

      g.append("text")
        .attr("transform", (d) -> "translate(" + labelArc.centroid(d) + ")")
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .text((d) -> reversedDataMap[d.value])

    scope.$watch attrs.data, draw , true
