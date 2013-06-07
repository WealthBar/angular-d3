angular.module('ad3').directive 'd3Donut', () ->
  defaults = ->
    x: 0
    y: 1

  restrict: 'E'

  require: '^d3Chart'

  link: (scope, el, attrs, chartController) ->
    options = angular.extend(defaults(), attrs)

    chart = chartController.getChart()
    height = 500
    width = 960

    radius = Math.min(width,height) / 2

    color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", 
              "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
    
    arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 70)

    pie = d3.layout.pie().sort(null)
      .value((d) -> 
        d[options.amount])

    svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    draw = (data, old, scope) ->
      return unless data?

      reversedDataMap = {}
      for datum in data
        do (datum) ->
          reversedDataMap[datum[options.amount]] = datum[options.value]

      g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")

      g.append("path")
        .attr("d", arc)
        .style("fill", (d) -> color(reversedDataMap[d.value])
        )

      g.append("text")
        .attr("transform", (d) -> "translate(" + arc.centroid(d) + ")")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text((d) -> reversedDataMap[d.value])

    scope.$watch attrs.data, draw , true
