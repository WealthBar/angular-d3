angular.module('ad3').directive 'd3Bars', ->
  defaults = ->
    x: 0
    y: 1
    width: 15

  restrict: 'E'

  require: '^d3Chart'

  link: (scope, el, attrs, chartController) ->
    options = angular.extend(defaults(), attrs)
    x = chartController.getScale(options.xscale or options.x)
    y = chartController.getScale(options.yscale or options.y)

    chart = chartController.getChart()
    height = chartController.innerHeight
    width = options.width

    barsElements = null
    redraw = (data) ->
      barsElements ||= chartController.getChart().append("g")
        .attr("class", "bars")
      return unless data? and data.length isnt 0
      bars = barsElements.selectAll("rect.bar").data(data)
      bars.exit().transition().duration(500)
        .attr("y", (d) -> height)
        .attr("height", 0)
        .remove()
      bars.transition().duration(500)
        .attr("x", (d) -> x(d[options.x]) - width/2)
        .attr("y", (d) -> y(d[options.y]))
        .attr("height", (d) -> height - y(d[options.y]))
        .attr("width", width)
      bars.enter()
        .append("rect")
        .attr("class", (d,i) -> "bar bar-#{i}")
        .attr("x", (d) -> x(d[options.x]) - width/2)
        .attr("width", width)
        .attr("y", height)
        .attr("height", 0)
        .transition().duration(500)
        .attr("y", (d) -> y(d[options.y]))
        .attr("height", (d) -> height - y(d[options.y]))

    chartController.registerElement(redraw, options.order)
