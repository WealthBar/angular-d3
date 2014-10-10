angular.module('ad3').directive 'd3Pie', ->
  defaults = ->
    x: 0
    y: 1
    innerRadius: 0
    labelRadius: 0.7
    transition: "cubic-in-out"
    transitionDuration: 800
    minOffset: 12
    value: 'value'

  restrict: 'E'

  require: '^d3Chart'

  link: (scope, el, attrs, chartController) ->
    options = angular.extend(defaults(), attrs)

    chart = chartController.getChart()
    innerRadius = parseFloat(options.innerRadius)
    labelRadius = parseFloat(options.labelRadius)

    if attrs.colors
      colorScale = switch attrs.colors
        when 'category20'
          d3.scale.category20()
        when 'category20b'
          d3.scale.category20b()
        when 'category20c'
          d3.scale.category20c()

    pie = d3.layout.pie().sort(null)
      .value((d) -> d[options.value])

    _current = null

    center = null
    redraw = (data) ->
      center = chartController.getChart().append("g").attr("class", "pie")

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

      slice = center.selectAll(".pie").data(pie(data))

      slice.enter().append("path")
        .attr("class", (d,i) ->  "pie pie-#{i}")
        .attr("d", arc)
        .each((d) -> @_current = d)

      slice.style('fill', (d,i) ->
        if colorScale then colorScale(i) else d[attrs.color]) if attrs.colors

      slice.exit().remove()

      slice.transition()
        .ease(options.transition)
        .duration(options.transitionDuration)
        .attrTween("d", arcTween)

      if options.label
        prevbb = null
        padding = +options.minOffset
        getPosition = (d, i) ->
          position = labelArc.centroid(d)

          if options.avoidCollisions
            # Basic collision adjustment, doesn't seem to quite work all the time.
            # Adapted from: http://stackoverflow.com/a/20645255/235243

            relativePosition = [position[0], position[1]]
            if @_position
              relativePosition[0] -= @_position[0]
              relativePosition[1] -= @_position[1]

            # Translate and pad the bounding rectangle for collision detection
            thisbb = _.transform @getBoundingClientRect(), (r, v, k) ->
              switch k
                when 'left'
                  r[k] = v - padding + relativePosition[0]
                when 'top'
                  r[k] = v - padding + relativePosition[1]
                when 'right'
                  r[k] = v + padding + relativePosition[0]
                when 'bottom'
                  r[k] = v + padding + relativePosition[1]

            if prevbb and !(
              thisbb.right < prevbb.left ||
              thisbb.left > prevbb.right ||
              thisbb.bottom < prevbb.top ||
              thisbb.top > prevbb.bottom)
              ctx = thisbb.left + (thisbb.right - thisbb.left)/2
              cty = thisbb.top + (thisbb.bottom - thisbb.top)/2
              cpx = prevbb.left + (prevbb.right - prevbb.left)/2
              cpy = prevbb.top + (prevbb.bottom - prevbb.top)/2
              offset = Math.sqrt(Math.pow(ctx - cpx, 2) + Math.pow(cty - cpy, 2))/2
              offsetArc = d3.svg.arc()
                .outerRadius(radius * labelRadius + offset)
                .innerRadius(radius * labelRadius + offset)
              position = offsetArc.centroid(d)

            @_position = position
            prevbb = thisbb

          "translate(#{position})"

        label = center.selectAll("text").data(pie(data))

        label.enter().append("text")
          .style("text-anchor", "middle")
          .attr("class", (d,i) -> "pie-label pie-label-#{i}")

        label.exit().remove()

        label.text((d,i) -> data[i][options.label])

        label.transition()
          .ease(options.transition)
          .duration(options.transitionDuration)
          .attr("transform", getPosition)

    chartController.registerElement(redraw, options.order)
