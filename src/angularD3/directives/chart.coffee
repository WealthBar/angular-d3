angular.module('ad3').directive 'd3Chart', ->
  defaults =
    width: '100%'
    height: '480'

  restrict: 'E'

  replace: true

  controller: ['$scope', '$element', '$attrs', (scope, el, attrs) ->
    angular.extend(attrs, defaults)
    margin = { top: 40, right: 60, bottom: 40, left: 60 }
    svg = d3.select(el[0]).append('svg')
      .attr("width", attrs.width)
      .attr("height", attrs.height)
    chart = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    @width = -> svg[0][0].offsetWidth
    @height = -> svg[0][0].offsetHeight
    @innerWidth = -> @width() - margin.left - margin.right
    @innerHeight = -> @height() - margin.top - margin.bottom

    @getChart = () -> chart

    scales = {}
    @addScale = (name, scale) -> scales[name] = scale
    @getScale = (name) -> scales[name]
  ]
