angular.module('ad3').directive 'd3Pie', () ->
  defaults = ->
    x: 0
    y: 1
    innerRadius: 0
    labelRadius: 0.7
    transition: "cubic-in-out"
    transitionDuration: 1000

  restrict: 'E'

  require: '^d3Chart'

  link: (scope, el, attrs, chartController) ->
    options = angular.extend(defaults(), attrs)

    chart = chartController.getChart()
    innerRadius = parseFloat(options.innerRadius)
    labelRadius = parseFloat(options.labelRadius)

    pie = d3.layout.pie().sort(null)
      .value((d) ->
        d[options.amount])

    center = chartController.getChart().append("g").attr("class", "pie")

    redraw = ->
      data = scope.$eval(attrs.data)
      return unless data? and data.length isnt 0

      radius = Math.min(chartController.innerWidth(), chartController.innerHeight())/2

      center.attr("transform", "translate(" + radius + "," + radius + ")")

      arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius * innerRadius)

      labelArc = d3.svg.arc()
        .outerRadius(radius * labelRadius)
        .innerRadius(radius * labelRadius)

      reversedDataMap = {}
      for datum in data
        do (datum) ->
          reversedDataMap[datum[options.amount]] = datum[options.value]

      groups = center.selectAll(".pie").data(pie(data))
        .enter().append("g")

      groups.attr("class", (d,i) ->  "pie pie-#{i}")
        .append("path")

      groups.append("text")

      center.selectAll(".pie text").data(pie(data))
        .attr("transform", (d) -> "translate(" + labelArc.centroid(d) + ")")
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .text((d) -> reversedDataMap[d.value])

      center.selectAll(".pie path").data(pie(data)).attr("d", arc)


    scope.$watch attrs.data, redraw , true
    chartController.registerElement({ redraw: redraw })
