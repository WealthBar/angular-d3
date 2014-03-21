angular.module('ad3').directive 'd3Pie', () ->
  defaults = ->
    x: 0
    y: 1
    innerRadius: 0
    labelRadius: 0.7
    transition: "cubic-in-out"
    transitionDuration: 800
    colors: 'category10'

  restrict: 'E'

  require: '^d3Chart'

  link: (scope, el, attrs, chartController) ->
    options = angular.extend(defaults(), attrs)

    chart = chartController.getChart()
    innerRadius = parseFloat(options.innerRadius)
    labelRadius = parseFloat(options.labelRadius)

    colors = switch attrs.colors
      when 'category20'
        d3.scale.category20()
      when 'category20b'
        d3.scale.category20b()
      when 'category20c'
        d3.scale.category20c()
      else
        d3.scale.category10()

    pie = d3.layout.pie().sort(null)
      .value((d) -> d[options.amount])

    center = chartController.getChart().append("g").attr("class", "pie")

    _current = null

    redraw = (data) ->
      return unless data? and data.length isnt 0

      radius = Math.min(chartController.innerWidth(), chartController.innerHeight())/2

      center.attr("transform", "translate(" + radius + "," + radius + ")")

      arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius * innerRadius)

      arcTween = (a) ->
        i = d3.interpolate(@_current, a)
        @_current = i(0)
        (t) -> arc(i(t))

      labelArc = d3.svg.arc()
        .outerRadius(radius * labelRadius)
        .innerRadius(radius * labelRadius)

      reversedDataMap = {}
      for datum in data
        do (datum) ->
          reversedDataMap[datum[options.amount]] = datum[options.value]

      slice = center.selectAll(".pie").data(pie(data))

      slice.enter().append("path")
        .attr("class", (d,i) ->  "pie pie-#{i}")
        .style('fill', (d,i) -> colors(i))
        .attr("d", arc)
        .each((d) -> @_current = d)

      slice.exit().remove()

      slice.transition()
        .ease(options.transition)
        .duration(options.transitionDuration)
        .attrTween("d", arcTween)

      label = center.selectAll("text").data(pie(data))

      label.enter().append("text")
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .attr("transform", (d) -> "translate(" + labelArc.centroid(d) + ")")

      label.exit().remove()

      label.transition()
        .ease(options.transition)
        .duration(options.transitionDuration)
        .text((d) -> reversedDataMap[d.value])

    chartController.registerElement({ redraw: redraw })
